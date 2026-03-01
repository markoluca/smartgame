let currentLevel=1;
let questions=[];
let index=0;
let score=0;
let totalQuestions=10;
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

questions=[...QUESTION_BANK[level]].sort(()=>Math.random()-0.5).slice(0,10);

document.getElementById("levelMap").classList.add("hidden");
document.getElementById("gameArea").classList.remove("hidden");

showQuestion();
}

function showQuestion(){

let q=questions[index];

document.getElementById("question").innerText=
"ПИТАЊЕ "+(index+1)+" ОД 10: "+q.q;

document.getElementById("answer").value="";
document.getElementById("timerBar").style.width="100%";

startTimer(q.type==="sign"?2:(q.type==="subset"||q.type==="oduz"?20:5));
}

function startTimer(seconds){

clearInterval(timerInterval);
let timeLeft=seconds;
let bar=document.getElementById("timerBar");

timerInterval=setInterval(()=>{
timeLeft--;
bar.style.width=(timeLeft/seconds)*100+"%";

if(timeLeft<=0){
clearInterval(timerInterval);
checkAnswer();
}
},1000);
}

function checkAnswer(){

let user=document.getElementById("answer").value;
let q=questions[index];

clearInterval(timerInterval);

if(user && smartCheck(user,q)){
score++;
hearts();
}

index++;

if(index<10){
setTimeout(showQuestion,800);
}else{
finishLevel();
}
}

function finishLevel(){

let percent=Math.round((score/10)*100);
let grade=percent>=90?5:percent>=75?4:percent>=60?3:percent>=40?2:1;

document.getElementById("correct").innerText=score;
document.getElementById("percent").innerText=percent;
document.getElementById("grade").innerText=grade;

if(score>=8){
let unlocked=JSON.parse(localStorage.getItem("levels"))||[1];
if(!unlocked.includes(currentLevel+1) && currentLevel<5){
unlocked.push(currentLevel+1);
localStorage.setItem("levels",JSON.stringify(unlocked));
}
}

}
