var canvas = document.getElementById("mycanvas");
var ctx = canvas.getContext("2d");
/***
 * Trade points for powerups. like fortnite interface
 * 
 * Boss Level: dark red background, bright orange play pieces.  Mario boss music.  
 * When you break block, sparks of lava can come down, if it hits you, it makes you small.  
 * need power up or to use points for power ups to get back to size
 */
//feedback block
var statsBlock = document.getElementById("statsblock");

//graph of canvas
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;


function drawRect(x, y, w, h, color){
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}
function drawCirc(x, y, r, sAngle, eAngle, color){
    ctx.beginPath();
    ctx.arc(x,y,r,sAngle,eAngle);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}
//ballObject
var ballRadius = 10;

function drawBall(color) {
    drawCirc(x, y, ballRadius, 0, Math.PI*2, color);
}

//paddleObject
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;

// var paddle = {
//     height: 10,
//     width: 75,
//     x: (canvas.width - this.width)/2,
// }

function drawPaddle(pwidth) {
    drawRect(paddleX, canvas.height-paddleHeight, pwidth, paddleHeight, "#0095DD");
}

//brick object
var brickRowCount = 5;
var brickColumnCount = 8;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1){
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                console.log('brickx: ', brickX);
                console.log('bricky: ', brickY);
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                drawRect(brickX, brickY, brickWidth, brickHeight, "#0095DD");
            }
            
        }
    }
}

//player info
var score = 0;
var lives = 3;
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

//key controls
var rightPressed = false;
var leftPressed = false;
var paddleMoveSlow= false;
var paddleMoveFast = false;

var leftArrow = 37;
var rightArrow = 39;
var upArrow = 38;
var downArrow = 40;
//if move fast, less point, move slow more point, reg speed same points?
var paddleGoFast = 70; //f
var paddleGoSlow = 83;  //s
var paddleGoRegSpeed = 32; //space

//io event listeners
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if(e.keyCode == rightArrow) {
        rightPressed = true;
    }
    else if(e.keyCode == leftArrow) {
        leftPressed = true;
    } 
    //change size of paddle
    else if(e.keyCode == upArrow) {
        paddleWidth = paddleWidth *2;
    }
    else if(e.keyCode == downArrow) {
        paddleWidth = paddleWidth /2;
    }
    //change speed of paddle
    else if(e.keyCode == paddleGoFast) {
        paddleMoveSlow = false;
        paddleMoveFast = true;
    }
    else if(e.keyCode == paddleGoSlow) {
        paddleMoveSlow = true;
        paddleMoveFast = false;
    }
    else if(e.keyCode == paddleGoRegSpeed) {
        paddleMoveSlow = false;
        paddleMoveFast = false;
    }
}
function keyUpHandler(e) {
    if(e.keyCode == rightArrow) {
        rightPressed = false;
    }
    else if(e.keyCode == leftArrow) {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}



//Custom Events
function changeColor(){
    let randColor = '#'+Math.floor(Math.random()*16777215).toString(16);
    drawBall(randColor);
}

function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            // calculations
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    //winning message...TODO: set as a publisher for asubscriber method
                    if(score == brickRowCount*brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS! Your Score is: " + score);
                        document.location.reload();
                    }
                }
            }
            
        }
    }
}

//Main: set stage and interact
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall("#0095DD");
    drawPaddle(paddleWidth);
    collisionDetection();
    drawScore();
    drawLives();

   let paddleHits = 0;

   if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
       dx = -dx;
       //changeColor()
   }
   if( y + dy < ballRadius) {
       dy = -dy;
       //changeColor()
   } else if (y + dy > canvas.height - ballRadius){
       if(x > paddleX && x < paddleX + paddleWidth){
           paddleHits = paddleHits++;
           console.log(paddleHits);
           //statsBlock.innerHTML('Paddle Hits: ' + paddleHits);
           
           /**
            * capture each hit so that each third hit we can boost speed, 
           * each 5th hit we can return it to normal 
           * and each 10th hit we can slow it down for a reprieve..hey you earned it
           */
          //isnt slowing down after 4...
        //    if(paddleHits <= 4){
        //     dy = -dy-1;
        //    } else {
            dy = -dy;
        //    }
           
       }
       else {
        lives--;
        if(!lives) {
            alert("GAME OVER");
            document.location.reload();
        }
        else {
            x = canvas.width/2;
            y = canvas.height-30;
            dx = 2;
            dy = -2;
            paddleX = (canvas.width-paddleWidth)/2;
        }
       }
       
   }

   if(rightPressed && paddleX < canvas.width-paddleWidth) {
       if(paddleMoveSlow){
        paddleX += 2;
       } else if(paddleMoveFast){
        paddleX += 12;
       } else{
        paddleX += 7;
       }
    
    }
    else if(leftPressed && paddleX > 0) {
        if(paddleMoveSlow){
             paddleX -= 2;
        } else if(paddleMoveFast){
            paddleX -= 12;
        } else{
            paddleX -= 7;
        }
    }

    x += dx;
    y += dy;
}

//Do or do not, there is no try
setInterval(draw, 10);