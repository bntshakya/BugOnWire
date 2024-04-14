const canvas = document.getElementById('canvas');
const canvas2 = document.getElementById('scoreboard');
const ctx = canvas.getContext('2d');
const scoreboard = canvas2.getContext('2d');   
const bugimg = new Image();
bugimg.src = './images/TigerMothFlap4.png';
const coinimg = new Image();
coinimg.src = './images/Coin-Sheet.png';

function createline(x,y){
    const line1 = new Path2D();
    line1.moveTo(x,y);
    line1.lineTo(x,y+1200);
    ctx.strokeStyle='red';
    ctx.stroke(line1);
}

createline(200,0);
createline(400,0);
createline(600,0);

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
        console.log(`${this.wirepos} coin`);
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
        this.y += t/8; // Adjust the speed of the obstacles
        if (this.x === 200) this.wirepos = -1;
        else if (this.x === 400) this.wirepos = 0;
        else (this.wirepos = 1);
        // console.log(`${this.wirepos} obstacle`);
        this.draw();
    }

    checkForEnd() {
        if (this.y > 900) {
            console.log('outside coin');
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
            this.iscounted = true;
            this.resetRandomY();
        };
    }
}

class Obstacle {
    constructor(x, y, size = 50) {
        this.x = x;
        this.y = y;
        if (this.x === 200) this.wirepos = -1;
        else if (this.x === 400) this.wirepos = 0;
        else (this.wirepos = 1);
        console.log(`${this.wirepos} obstacle`);
        this.size = size;
        this.iscounted= false;
    }

    draw() {
        ctx.fillStyle = 'red';
        const rect = new Path2D();
        rect.rect(this.x, this.y, this.size, this.size);
        ctx.fill(rect);
        // console.log(this.y);
    }

    update() {
        this.y += t/8; // Adjust the speed of the obstacles
        if (this.x === 200) this.wirepos = -1;
        else if (this.x === 400) this.wirepos = 0;
        else (this.wirepos = 1);
        // console.log(`${this.wirepos} obstacle`);
        this.draw();
    }

    checkForEnd() {
        if (this.y > 900) {
            console.log('outside');
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

    coordinate(){
        return [this.x,this.y];
    }

    collisiondetection(bug){
        if ((bug.y > this.y && bug.y < (this.y + this.size)) && bug.wirepos === this.wirepos && spaceflag === 0) gameover();
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
]

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
                ctx.drawImage(bugimg,frameX,frameY,spriteWidth,spriteHeight, this.x, this.y,100,100);
                stagger = 0;    
            }
        else{
            ctx.drawImage(bugimg,frameX,frameY,spriteWidth,spriteHeight, this.x, this.y,100,100);
            stagger++;
        }
    }
        // ctx.drawImage(img, this.x, this.y,50,50);
    
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

}

let bug = new Bug(400, 600);
let spaceflag = 1;
let tid;
let wirepos = 0;

function eventListener() {
    document.addEventListener('keydown', (event) => {
        if(event.key === "ArrowRight" && wirepos != 1 && spaceflag === 0) {
            bug.position(bug.x+200, 600);
            wirepos ++;
            console.log(`${wirepos} bug position`)
        }
        else if(event.key === "ArrowLeft" && wirepos != -1 && spaceflag === 0) {
            bug.position(bug.x-200, 600);
            wirepos --; 
            console.log(`${wirepos} bug position`);
        }
        else if (event.key === ' ' && spaceflag === 0){
            spaceflag = 1;
            bug.position(bug.x + 80,550);
            setTimeout(()=>{
                bug.position(bug.x-80,600);
                spaceflag = 0;
            },500);
            console.log('space');
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
    if (isGameOver !== true)
    {ctx.clearRect(0, 0, 800, 900);
    createline(200, 0);
    createline(400, 0);
    createline(600, 0);
    bug.position(bug.x, bug.y);

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
    
    // if bug.x 
    requestAnimationFrame(animate);
}
}

function animate2(){
    scoreboard.clearRect(0,0,400,400);
    scoreboard.font = "50px serif";
    scoreboard.fillText(`Time : ${t} seconds`, 50, 90);
    scoreboard.fillText(`Coins : ${coinCount}`,45,250);
    requestAnimationFrame(animate2);
}

let t = 0;

// Randomize the starting positions of the obstacles

eventListener(); // Register the event listener once

obstacles.forEach(obstacle => {
    obstacle.resetRandomY();
});

// let isEventListenerAttached = false;
// let gid;
function gameover(){
    ctx.clearRect(0,0,1000,1000);
    ctx.fillText("game over press m to go to startscreen",200,200);
    isGameOver = true;
    clearInterval(tid);
    document.addEventListener('keydown',function handleKeyDown(event) {
        if(event.key === 'M' || event.key === 'm'){
            ctx.clearRect(0, 0, 1000, 1000);
            console.log('called start screen ');
            this.location.reload();
        }
    // requestAnimationFrame(gameover);
    })
    requestAnimationFrame(gameover);
    // gid = setInterval(gameover,1000);
}

let isGameRunning = false;

function startscreen(){
    t = 0;
    coinCount = 0;
    // if (gid){
    //     clearInterval(gid);
    // }
    ctx.clearRect(0,0,1000,1000); 
    ctx.fillText(`press enter to begin 
                  press h for help `,100,100);
    console.log('at the start screen');
    document.addEventListener('keydown', (event) => {
        if(event.key === "Enter" && !isGameRunning) {
            spaceflag = 0;
            console.log("Enter pressed ");
            isGameRunning = true;
            animate();
            tid = setInterval(() => {
                t++;
            }, 1000);
            animate2();
        }
        else if (event.key === 'h'){
            ctx.clearRect(0,0,1000,1000);
            ctx.font = "50px Londrina Outline"
            ctx.fillText('help details press enter to begin ',200,200);
        }
     });
    //  requestAnimationFrame(startscreen);
}

startscreen();

