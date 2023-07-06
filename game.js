/**
 * @type {HTMLCanvasElement}
 */

const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");
let upButton= document.querySelector("#up");
let downButton= document.querySelector("#down");
let leftButton= document.querySelector("#left");
let rightButton= document.querySelector("#right");
let spanLives = document.querySelector("#lives");
let spanTime = document.querySelector("#time");
let spanRecord = document.querySelector("#record");
let pResult = document.querySelector("#result");

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;
let timeStart;
let timePlayer;
let timeInterval;

canvas.height = canvas.height.toFixed(0);
canvas.width = canvas.width.toFixed(0);
const playerPosition = {
    x: undefined,
    y: undefined,
}

const giftPosition = {
    x: undefined,
    y: undefined,
}

let enemyPosition = [];

window.addEventListener("load",setCanvasSize);
window.addEventListener("resize", setCanvasSize)

function setCanvasSize(){
    if (window.innerHeight > window.innerWidth){
        canvasSize= window.innerWidth * 0.7;
    }
    else {canvasSize = window.innerHeight *0.7}
    
   canvas.setAttribute("width", canvasSize)
   canvas.setAttribute("height",canvasSize)

   elementsSize = (canvasSize /10) -1;
   startGame();
}

function startGame() {

    game.font = elementsSize +"px Verdana";
    game.textAlign= "";

    const map = maps[level];

    if (!map){
        gameWin()
        return;
        
    }

    if (!timeStart){
        timeStart = Date.now();
        timeInterval = setInterval(showTime,100)
        saveRecord();
    }
    const mapRows = map.trim().split("\n");
    const mapRowsCols= mapRows.map(row=>row.trim().split(""));

    showLives();
    showTime();

    enemyPosition = [];

    mapRowsCols.forEach((row, rowI)=>{
        row.forEach((col,colI)=>{
            const emoji= emojis[col];
            const posX = elementsSize* (colI);
            const posY = elementsSize*(rowI+1);

            if (col=="O"){
                playerPosition.x = posX;
                playerPosition.y = posY;
            } else if (col=="I"){
                giftPosition.x = posX;
                giftPosition.y = posY;
            } else if (col=="X"){
                enemyPosition.push({
                    x:posX,
                    y:posY,
                })}

            game.fillText(emoji, posX, posY);

            })});
//     for (let i = 1; i <= 10; i++) {
//         for (let z = 0; z <= 9.; z++) {
//             game.fillText(emojis[mapRowsCols[i-1][z]], elementsSize*z,elementsSize*i);
//         }

//    }
            movePlayer();
}

function movePlayer () {
    const giftCollisionX = playerPosition.x.toFixed(3)==giftPosition.x.toFixed(3);
    const giftCollisionY = playerPosition.y.toFixed(3)==giftPosition.y.toFixed(3);
    const giftCollision= giftCollisionX && giftCollisionY;

    if (giftCollision){
        levelWin();
    }
        const enemyCollision= enemyPosition.find(enemy => {
        const enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3)
        const enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3)
        return enemyCollisionX && enemyCollisionY;
    });

    if (enemyCollision){
        levelFail();
    }

    game.fillText(emojis["PLAYER"],playerPosition.x,playerPosition.y);
    clearMap();
    renderMap();
    game.fillText(emojis["PLAYER"],playerPosition.x,playerPosition.y);
    console.log(playerPosition.x,playerPosition.y);
    } 
function gameWin(){
    clearInterval(timeInterval);
    const recordTime= localStorage.getItem("record_time");
    const playerTime = (Date.now()-timeStart)/1000;
   
    if (recordTime){
        if (recordTime>= playerTime){
            localStorage.setItem("record_time",playerTime);
            pResult.innerHTML= "You're a legend!";
        } else pResult.innerHTML= "Good luck next time";
    }else {
        localStorage.setItem("record_time",playerTime);
        pResult.innerHTML= "Good, but you can do it much better :)";
    }
    
}

function showLives(){
    spanLives.innerHTML = emojis["HEART"].repeat(lives);
}

function showTime(){
    spanTime.innerHTML = (Date.now()-timeStart)/1000;
}

function saveRecord(){
    spanRecord.innerHTML = localStorage.getItem('record_time');
}

function levelWin(){
    level++;
    startGame();
}

function levelFail(){
    lives--;

    if (lives<=0){
    level=0;
    lives=3;
    timeStart = undefined;
    }
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    giftPosition.x= undefined;
    giftPosition.y= undefined;
    enemyPosition.length = [];
    startGame();

}

function clearMap() {
    game.clearRect(0,0,canvasSize,canvasSize);
}

function renderMap(){
    const map = maps[level];
    const mapRows = map.trim().split("\n");
    const mapRowsCols= mapRows.map(row=>row.trim().split(""));

    mapRowsCols.forEach((row, rowI)=>{
        row.forEach((col,colI)=>{
            const emoji= emojis[col];
            const posX = elementsSize* (colI);
            const posY = elementsSize*(rowI+1);
            game.fillText(emoji, posX, posY);

            })});
}


let arrowUp= window.addEventListener("keydown",validar);
let arrowDown= window.addEventListener("keydown",validar);
let arrowLeft= window.addEventListener("keydown",validar);
let arrowRight= window.addEventListener("keydown",validar);

upButton.addEventListener("click",moveUp);
downButton.addEventListener("click",moveDown);
leftButton.addEventListener("click",moveLeft);
rightButton.addEventListener("click",moveRight);

function moveUp(){
    if((playerPosition.y-elementsSize)<elementsSize) {
    }else {
    (playerPosition.y -= elementsSize );
    movePlayer();
}
}
function moveDown(){
    if ((playerPosition.y+elementsSize)>canvas.height) {
    } else{
    playerPosition.y += elementsSize;
    movePlayer();
    }
}
function moveLeft(){
    if ((playerPosition.x-elementsSize)<0) {
    } else{
    playerPosition.x -= elementsSize;
    movePlayer();
    }
}
function moveRight(){
    if ((playerPosition.x+elementsSize)> canvasSize){
    } else{
    playerPosition.x += elementsSize;
    movePlayer();
    }
}

function validar(event){
    if(event.key==="ArrowUp") moveUp();
        else if(event.key==="ArrowDown")moveDown();
        else if(event.key==="ArrowLeft")moveLeft();
        else if(event.key==="ArrowRight")moveRight();
}
