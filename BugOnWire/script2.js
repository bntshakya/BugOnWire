const canvas = document.getElementById('canvas');
const canvas2 = document.getElementById('scoreboard');
const ctx = canvas.getContext('2d');
const scoreboard = canvas2.getContext('2d');    
// const b = timer();
const bugimg = new Image();
bugimg.src = './images/TigerMothFlap4.png';
const coinimg = new Image();
coinimg.src = './images/Coin-Sheet.png';
const obstacleimg = new Image();
obstacleimg.src = "images/spider01.png";
let myFont = new FontFace("myFont","url(./assets/Honk-Regular.ttf)");
myFont.load().then(function(font){
    // with canvas, if this is ommited won't work
    document.fonts.add(font);
    //console.log('Font loaded');
  });
// ctx.font = "20px myFont";

function createline(x,y){
    const line1 = new Path2D();
    line1.moveTo(x,y);
    line1.lineTo(x,y+1200);
    ctx.strokeStyle='gray';
    ctx.stroke(line1);
}

createline(250,0);
createline(450,0);
createline(650,0);

const staggerFrame = 5;
let gameFrame_coins = 0;
let coin_width = 32;
let coin_height = 32;
let coin_x = 0;
let coin_y = 0;
let coin_stagger = 0;
const coin_frame = 15;

class Coins {
    constructor(x,y,size=50){
        this.x = x;
        this.y = y;
        if (this.x === 200) this.wirepos = -1;
        else if (this.x === 400) this.wirepos = 0;
        else (this.wirepos = 1);
        //console.log(`${this.wirepos} coin`);
        this.size = size;
    }

    draw() {
        // ctx.fillStyle = 'blue';
        // const rect = new Path2D();
        // rect.rect(this.x, this.y, this.size, this.size);
        // ctx.fill(rect);
        // console.log(this.y);
        if (coin_stagger === coin_frame){
            if (gameFrame_coins >= 0 && gameFrame_coins < 4){
                coin_x = gameFrame_coins * coin_width;
                coin_y = 0;
            }
            else if (gameFrame_coins >= 4 && gameFrame_coins < 8){
                coin_x = (gameFrame_coins-4) * coin_width;
                coin_y = 32;
            }
            else if (gameFrame_coins >= 8 && gameFrame_coins < 11){
                coin_x = (gameFrame_coins-8) * coin_width;
                coin_y = 64;
            }
            else {
                gameFrame_coins = 0;
            }
            ctx.drawImage(coinimg,coin_x,coin_y,coin_width,coin_height,this.x,this.y,this.size,this.size);
            gameFrame_coins ++;
            coin_stagger = 0;
        }
        else{
            coin_stagger++;
            ctx.drawImage(coinimg,coin_x,coin_y,coin_width,coin_height,this.x,this.y,this.size,this.size);
        }
    }

    update() {
        this.y += t/8; // Adjust the speed of the obstacles t/8
        if (this.x === 200) this.wirepos = -1;
        else if (this.x === 400) this.wirepos = 0;
        else (this.wirepos = 1);
        // console.log(`${this.wirepos} obstacle`);
        this.draw();
    }

    checkForEnd() {
        if (this.y > 900) {
            // console.log('outside coin ');
            this.resetRandomY();
            this.iscounted= false;
        }
    }

    resetRandomY() {
        if (Math.random() < 0.005){
            this.y = 0-(Math.random()*100); // Reset to the top
            this.x = Math.floor(Math.random() * 3) * 200 + 200; // Random x position (200, 400, or 600)
        }
        else{
            this.y = 1000;
        }
    }

    collisiondetection(bug){
        if ((bug.y > this.y && bug.y < (this.y + this.size)) && wirepos === this.wirepos && spaceflag === 0 && !this.iscounted){
            coinCount++;
            playcoinsound();
            this.iscounted = true;
            this.resetRandomY();
        };
    }
}

// const staggerFrame = 5;
let gameFrame_obstacle = 0;
let obstacle_width = 64;
let obstacle_height = 64;
let obstacle_x = 0;
let obstacle_y = 128;
let obstacle_stagger = 0;
const obstacle_frame = 20;

let over_id;


class Obstacle {
    constructor(x, y, size = 100) {
        this.x = x;
        this.y = y;
        if (this.x === 200) this.wirepos = -1;
        else if (this.x === 400) this.wirepos = 0;
        else (this.wirepos = 1);
        //console.log(`${this.wirepos} obstacle`);
        this.size = size;
        this.iscounted= false;
    }

    draw() {
        // ctx.fillStyle = 'red';
        // const rect = new Path2D();
        // rect.rect(this.x, this.y, this.size, this.size);
        // ctx.fill(rect);
        // //console.log(this.y);
        if (obstacle_stagger === obstacle_frame){
            // if (gameFrame_obstacle >= 0 && gameFrame_obstacle < 3){
            //     obstacle_x = gameFrame_obstacle * obstacle_width;
            //     obstacle_y = 0;
            // }
            // else if (gameFrame_obstacle >= 3 && gameFrame_obstacle < 5){
            //     obstacle_x = (gameFrame_obstacle-3) * obstacle_width;
            //     obstacle_y = 176;
            // }
            // else {
            //     gameFrame_obstacle = 0;
            // }
            if (gameFrame_obstacle >= 0 && gameFrame_obstacle < 10){
                obstacle_x = gameFrame_obstacle * obstacle_width;
            }
            else{
                gameFrame_obstacle = 0;
            }
            ctx.drawImage(obstacleimg,obstacle_x,obstacle_y,obstacle_width,obstacle_height,this.x,this.y,this.size,this.size);
            gameFrame_obstacle++;
            obstacle_stagger = 0;
        }
        else{
            obstacle_stagger++;
            ctx.drawImage(obstacleimg,obstacle_x,obstacle_y,obstacle_width,obstacle_height,this.x,this.y,this.size,this.size);
        }
    }

    update() {
        this.y += t/8; // Adjust the speed of the obstacles
        if (this.x === 200) this.wirepos = -1;
        else if (this.x === 400) this.wirepos = 0;
        else (this.wirepos = 1);
        // //console.log(`${this.wirepos} obstacle`);
        this.draw();
    }

    checkForEnd() {
        if (this.y > 900) {
            //console.log('outside');
            this.resetRandomY();
        }
    }

    resetRandomY() {
        // this.y = Math.min(-(Math.random()*200),-110); // Reset to the top
        // this.x = Math.floor(Math.random() * 3) * 200 + 200; // Random x position (200, 400, or 600)
            const minY = 0 - Math.random() * 100; // Reset to the top
            const newX = Math.floor(Math.random() * 3) * 200 + 200; // Random x position (200, 400, or 600)
        
            // Check for overlap with existing obstacles
            const overlap = obstacles.some(obstacle => {
                return obstacle.x === newX && obstacle.y === minY;
            });
        
            if (!overlap) {
                this.y = minY;
                this.x = newX;
            } else {
                // If overlap, try again by recursively calling resetRandomY
                this.resetRandomY();
            }
    }

    collisiondetection(bug){
        if ((bug.y > this.y && bug.y < (this.y + this.size)) && wirepos === this.wirepos && spaceflag === 0){
            over_id = setInterval(() => {
                ctx.clearRect(0,0,1000,1000);
            }, 100);
            //console.log('clear the rect');
            eatsound();
            gameover();
        };
        // console.log('collided');
    }
}

const obstacles = [
    new Obstacle(200, 0),
    new Obstacle(400, 0),
    new Obstacle(600, 0)
];

const coins = [
    new Coins(200, 0),
    new Coins(400, 0),
    new Coins(600, 0)
];

let frameX = 0;
let frameY = 0;
let spriteWidth = 162;
let spriteHeight = 79;
let gameFrame = 0;

let stagger = 0;

class Bug {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.wirepos = 0;
        // ctx.fillStyle = 'black';
        // const rect1 = new Path2D();
        // rect1.rect(this.x,this.y,50,50);
        // ctx.fill(rect1);
        // const img = new Image();
        // img.src = './images/TigerMothFlap.gif';

        if (stagger === staggerFrame){ 
            if (gameFrame < 4){
                if (gameFrame < 2){
                    frameX = spriteWidth * gameFrame;
                    frameY = 0;
                }
                else {
                    frameX = spriteWidth * (gameFrame-2);
                    frameY = 79;
                }
                gameFrame ++;
            }
            else{
                gameFrame = 0;
                frameX = 0;
                frameY = 0;
            }
                ctx.drawImage(bugimg,frameX,frameY,spriteWidth,spriteHeight, this.x, this.y,80,80);
                stagger = 0;    
            }
        else{
            ctx.drawImage(bugimg,frameX,frameY,spriteWidth,spriteHeight, this.x, this.y,80,80);
            stagger++;
        }
    }
    position(x,y){
        this.x = x;
        this.y = y;
        // ctx.fillStyle = 'black';
        // const rect1 = new Path2D();
        // rect1.rect(this.x,this.y,50,50);
        // ctx.fill(rect1);
        // const img = new Image();
        // img.src = './images/TigerMothFlap.gif';
        if (stagger === staggerFrame){ 
            if (gameFrame < 4){
                if (gameFrame < 2){
                    frameX = spriteWidth * gameFrame;
                    frameY = 0;
                }
                else {
                    frameX = spriteWidth * (gameFrame-2);
                    frameY = 79;
                }
                gameFrame ++;
            }
            else{
                gameFrame = 0;
                frameX = 0;
                frameY = 0;
            }
                ctx.drawImage(bugimg,frameX,frameY,spriteWidth,spriteHeight, this.x, this.y,100,100);
                stagger = 0;
                
            }
        else{
            ctx.drawImage(bugimg,frameX,frameY,spriteWidth,spriteHeight, this.x, this.y,100,100);
            stagger++;
        }
    }
    // position(){
    //     this.x = 
    // }
}

// function eventListener() {
    
//     let bug = new Bug(400,800);
//     document.addEventListener('keydown',(event)=>{
//     console.log('keypress');
//     bug.position(0,0);
//     // if (event.key === 'Enter'){
//         //     bug.x = 0;
//         //     bug.y = 0;
//         // }
//     });
// }
    
//     function animate() {
//         ctx.clearRect(0, 0, 800, 900);
//         createline(200,0);
//         createline(400,0);
//         createline(600,0);
//         eventListener();
//         // obstacles.forEach(obstacle => {
//         //     obstacle.update();
//         //     obstacle.checkForEnd();
//         // });
//     requestAnimationFrame(animate);
// }

// // Randomize the starting positions of the obstacles
// obstacles.forEach(obstacle => {
//     obstacle.x = Math.floor(Math.random() * 3) * 200 + 200;
// });

// animate();


let bug = new Bug(400, 600);
let spaceflag = 0;
let tid;
let wirepos = 0;

function eventListener() {
    document.addEventListener('keydown', (event) => {
        if(event.key === "ArrowRight" && wirepos != 1 && spaceflag === 0) {
            bug.position(bug.x+200, 600);
            wirepos ++;
            //console.log(`${wirepos} bug position`)
        }
        else if(event.key === "ArrowLeft" && wirepos != -1 && spaceflag === 0) {
            bug.position(bug.x-200, 600);
            wirepos --; 
            //console.log(`${wirepos} bug position`);
        }
        else if (event.key === ' ' && spaceflag === 0){
            spaceflag = 1;
            bug.position(bug.x + 80,550);
            setTimeout(()=>{
                bug.position(bug.x-80,600);
                spaceflag = 0;
            },750);
            //console.log('space');
        }
        // else if (event.key === 'Shift'){
        //     clearInterval(tid);
        //     console.log(`${t} is time`);
        // }
    });
}

// function 
let timevalue = 0;
let coinCount = 0;
let isGameOver = false;
function animate() {
    ctx.font = "40px myFont";
    // clearInterval(startid);
    if (isGameOver !== true){
    ctx.clearRect(0, 0, 800, 900);
    ctx.lineWidth=10;
    createline(250, 0);
    createline(450, 0);
    createline(650, 0);

    coins.forEach(coin => {
        coin.update();
        coin.checkForEnd();
        coin.collisiondetection(bug);
    });

    obstacles.forEach(obstacle => {
        obstacle.update();
        obstacle.checkForEnd();
        obstacle.collisiondetection(bug);
    });
    // Draw bug outside of eventListener to avoid continuous position resets
    bug.position(bug.x, bug.y);
    // if bug.x 
    requestAnimationFrame(animate);
}
}


let min = 0;

function animate2(){
    clearInterval(startid);
    scoreboard.clearRect(0,0,800,800);
    scoreboard.font = "35px myFont";
    let sec = t % 60;
    // scoreboard.drawImage(scoretitle,0,0,400,100); 
    if (t % 60 === 0) {
        min = t / 60 ;
        // sec = 0;   
    }
    scoreboard.fillText(`Time :` , 115, 125);
    scoreboard.fillText(`${min} min :: ${sec} sec`,115,150)
    scoreboard.fillText(`Coins : ${coinCount}`,115,190);
    requestAnimationFrame(animate2);
}
// function timer(){
//     const d = new Date();
//     return d.getTime();
// }

// function timer2(val=0){
//     return setTimeout((val)=>{
//         val += 1;
//     },1000)
// }
let t = 0; // initial speed

// Randomize the starting positions of the obstacles

eventListener(); // Register the event listener once

obstacles.forEach(obstacle => {
    obstacle.resetRandomY();
});
// let over_id2;
// let isEventListenerAttached = false;
// let gid;
function gameover(){
    ctx.clearRect(0,0,1000,1000);
    ctx.font = "40px myFont";
    clearInterval(over_id);
    // over_id2 = setInterval(() => {
    //     ctx.clearRect(0,0,1000,1000)
    // }, 3000);
    setTimeout(() => {
        ctx.clearRect(0,300,1000,1000);
    }, 100);
    ctx.fillText("GAME OVER",200,200);
    ctx.fillText("PRESS M TO GO TO STARTSCREEN",200,250);
    isGameOver = true;
    clearInterval(tid);
    document.addEventListener('keydown',function handleKeyDown(event) {
        if(event.key === 'M' || event.key === 'm'){
            // clearInterval(over_id2);
            ctx.clearRect(0, 0, 1000, 1000);
            //console.log('called start screen ');
            document.removeEventListener('keydown',handleKeyDown);
            location.reload();
            // ismpressed = true;
            // return 0;
        }
    requestAnimationFrame(gameover);
    })
    // gid = setInterval(gameover,1000);
}

let isGameRunning = false;
let scoretitle = new Image();
scoretitle.src = "./images/bugslife.jpg";

function startscreen(){
    let newfont = new FontFace("newfont","url(assets/LondrinaSolid-Regular.ttf)");
    newfont.load();
    t = 0;
    coinCount = 0;
    // if (gid){
    //     clearInterval(gid);
    // }
    ctx.clearRect(0,0,1000,1000);
    // el = document.getElementById('scoreboard');
    ctx.font = "40px myFont";
    // const grad = ctx.createLinearGradient(25, 170, 39, 240);
    // ctx.fillStyle = grad;
    // ctx.f
    // ctx.drawImage(scoretitle,0,0,100,100);
    // playbackgroundmusic();
    startid = setInterval(() => {
        scoreboard.drawImage(scoretitle,80,70,337,195);
    }, 100);
    // requestAnimationFrame(()=>{
    //     scoreboard.drawImage(scoretitle,80,70,337,195);
    // });
    ctx.fillText('PRESS ENTER TO BEGIN',200,450);
    ctx.fillText('PRESS H FOR INSTRUCTIONS',200,550);
    //console.log('at the start screen');
    // let startid = setInterval(startscreen, 1000);
    document.addEventListener('keydown', (event) => {
        if(event.key === "Enter" && !isGameRunning) {
            // clearInterval(startid);
            //console.log("Enter pressed ");
            isGameRunning = true;
            animate();
            tid = setInterval(() => {
                t++;
            }, 1000);
            animate2();
        }
        else if (event.key === 'h'|| event.key === 'H'){
            ctx.clearRect(0,0,1000,1000);
            ctx.font = "40px myFont";
            ctx.fillText('SURVIVE AS LONG AS POSSIBLE',80,200);
            ctx.fillText('COLLECT COINS',80,250);
            ctx.fillText('DONT TOUCH THE SPIDERS OR YOU WILL DIE',80,300);
            ctx.fillText('USE ARROW KEYS TO MOVE LEFT AND RIGHT',80,350);
            ctx.fillText('PRESS SPACE TO JUMP',80,400);
            ctx.fillText('PRESS ENTER TO BEGIN',200,550);
        }
     });
    //  requestAnimationFrame(startscreen);
}

// function playbackgroundmusic(){
//     const sound = new Audio("audio/background.mp3");
//     sound.muted = true;
//     sound.play();
// }

function playcoinsound(){
    const sound = new Audio('audio/super-mario-coin-sound.mp3')
    sound.play();
}

function eatsound(){
    const sound = new Audio('audio/nom-nom-nom_gPJiWn4.mp3');
    // sound.muted = true;
    sound.play();
}

startscreen();

