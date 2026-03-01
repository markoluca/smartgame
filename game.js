let currentLevel=1;
let questions=[];
let index=0;
let score=0;
let timerInterval=null;

function initLevels(){
const map=document.getElementById("levelMap");
const unlocked=JSON.parse(localStorage.getItem("levels"))||[1];

for(let i=1;i<=5;i++){
let div=document.createElement("div");
div.className="level";
div.innerText="НИВО "+i;

if(!unlocked.includes(i)){
div.classList.add("locked");
}else{
div.onclick=()=>startLevel(i);
}

map.appendChild(div);
}
}

window.onload=initLevels;

function startLevel(level){

let name=document.getElementById("studentName").value;
if(!name){ alert("УНЕСИ ИМЕ 👑"); return; }

currentLevel=level;
score=0;
index=0;

if(level<5){
questions=[...QUESTION_BANK[level]].sort(()=>Math.random()-0.5).slice(0,10);
}else{
let combined=[];
for(let i=1;i<=4;i++){
combined=combined.concat(QUESTION_BANK[i]);
}
questions=combined.sort(()=>Math.random()-0.5).slice(0,30);
}

document.getElementById("levelMap").classList.add("hidden");
document.getElementById("gameArea").classList.remove("hidden");

showQuestion();
}

function showQuestion(){

let q=questions[index];
document.getElementById("question").innerText=
"ПИТАЊЕ "+(index+1)+" ОД "+questions.length+": "+q.q;

document.getElementById("answer").value="";
document.getElementById("keyboardContainer").innerHTML="";
startTimer(q.type==="sign"?2:(q.type==="subset"||q.type==="oduz"?20:5));

if(q.type==="sign") showSignKeyboard();
else if(q.type==="subset"||q.type==="oduz"||!isNaN(q.a)) showNumericKeyboard();
else showCyrillicKeyboard();
}

function startTimer(seconds){
clearInterval(timerInterval);
let timeLeft=seconds;
let bar=document.getElementById("timerBar");
bar.style.width="100%";

timerInterval=setInterval(()=>{
timeLeft--;
bar.style.width=(timeLeft/seconds)*100+"%";
if(timeLeft<=0){
clearInterval(timerInterval);
checkAnswer();
}
},1000);
}

function smartCheck(user,q){
if(q.type==="subset"){
return user.replace(/\s/g,"")===q.a;
}
if(q.type==="oduz"){
return user.includes(q.a);
}
return user.toLowerCase().trim()===String(q.a).toLowerCase();
}

function checkAnswer(){
clearInterval(timerInterval);
let user=document.getElementById("answer").value;
let q=questions[index];

if(user && smartCheck(user,q)){
score++;
hearts();
}

index++;

if(index<questions.length){
setTimeout(showQuestion,800);
}else{
finishLevel();
}
}

function finishLevel(){

let percent=Math.round((score/questions.length)*100);
let grade=percent>=90?5:percent>=75?4:percent>=60?3:percent>=40?2:1;

document.getElementById("correct").innerText=score;
document.getElementById("percent").innerText=percent;
document.getElementById("grade").innerText=grade;

if(score>=8 && currentLevel<5){
let unlocked=JSON.parse(localStorage.getItem("levels"))||[1];
if(!unlocked.includes(currentLevel+1)){
unlocked.push(currentLevel+1);
localStorage.setItem("levels",JSON.stringify(unlocked));
}
}

}
