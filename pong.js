// the first section contains all the data variables we discussed
// to keep track of the information we need to make the game work
// the initial values are reset when initializePositions()
// is called
var GAMESTATE = 'START'; // 'PLAY', 'POINT', 'GAMEOVER'

var score = {
  player1: 0,
  player2: 0,
}

var ball = {
  x: 0,
  y: 0,
  xvelocity: 2,
  yvelocity: 2,
  size: 20
}

var paddle1 = {
  x: 100,
  y: 100,
  width: 10,
  length: 80
}
var paddle2 = {
  x: 20,
  y: 20,
  width: 10,
  length: 80,
}

var gameoversound, pointsound, osc;

var borders = {
  leftx: 0,
  rightx: 0,
  topy: 0,
  bottomy: 0
}

var keypress = {
  w: false, // up player 1 
  s: false, // down player 1
  o: false, // up player 2
  l: false, // down player 2
  spacebar: false // start signal for game 
}

// the preload function is empty for now.  this is where you can load mp3 
// sounds to play when the game state enters GAME OVER and POINT.  
function preload() {
  song = loadSound('bubble.mp3');
  pointsound = loadSound('point.mp3');
  gameoversound = loadSound('slide.mp3');
}

function setup() {
  createCanvas(400, 400);
  // i added some code here to initialize an oscillator!!!
  osc = new p5.Oscillator();
  osc.setType('sine');
  osc.freq(240);
  osc.amp(0);
  osc.start();
}

// this mainloop contains the three functions that do everything that our program will do
function draw() {
  checkInput(); // looks at the keyboard and logs the keys that are pressed
  updateState(); // transitions the program from state to state, and updates the data model
  drawStuff(); // displays the game elements (and produces the sounds)
}

// this function gathers input from the keyboard and saves
// it in our data structure so that the rest of the functions can 
// access it quickly
function checkInput() {
  // check is key w down?
  if (keyIsDown(87)) {
    keypress.w = true;
    print('w')
  } else {
    keypress.w = false;
  }
  if (keyIsDown(83)) {
    keypress.s = true;
    print('s')
  } else {
    keypress.s = false;
  }
  if (keyIsDown(79)) {
    keypress.o = true;
    print('o')
  } else {
    keypress.o = false;
  }
  if (keyIsDown(76)) {
    keypress.l = true;
    print('l')
  } else {
    keypress.l = false;
  }
  if (keyIsDown(32)) {
    keypress.spacebar = true;
    print('SPACEBAR')
  } else {
    keypress.spacebar = false;
  }
}


function updateState() {
  if (GAMESTATE == 'START') {
    initializePositions();
    // wait for spacebar
    if (keypress.spacebar == true) {
      GAMESTATE = 'PLAY';
      ball.y=random(borders.topy,borders.bottomy);
       }
  } else if (GAMESTATE == 'POINT') {
    initializePositions();
    if (keypress.spacebar == true) {
      GAMESTATE = 'PLAY';
      ball.y=random(borders.topy,borders.bottomy);  
    }
  } else if (GAMESTATE == 'GAMEOVER') {
    if (keypress.spacebar == true) {
      GAMESTATE = 'START';
    }
  } else if (GAMESTATE == 'PLAY') {
    // move ball 
    ball.x = ball.x + ball.xvelocity;
    ball.y = ball.y + ball.yvelocity;

    // move paddles.  you may want to modify this so that the paddles remain on the screen
    if (keypress.w == true) {
      paddle1.y = paddle1.y - 3;
    } else if (keypress.s == true) {
      paddle1.y = paddle1.y + 3;
    }
    if (keypress.o == true) {
      paddle2.y = paddle2.y - 3;
    } else if (keypress.l == true) {
      paddle2.y = paddle2.y + 3;
    }


    if (ball.y < borders.topy) {
      ball.yvelocity = -ball.yvelocity;
      song.play();
    }
    if (ball.y > borders.bottomy) {
      ball.yvelocity = -ball.yvelocity;
      song.play();
    }

    if (ball.x > borders.rightx) {
      if ((ball.y > paddle2.y) &&
        (ball.y < (paddle2.y + paddle2.length))) {
        ball.xvelocity = -ball.xvelocity;
        song.play();
      } else if (score.player1 >=5||score.player2 >=5) {
        GAMESTATE = 'GAMEOVER';
       } else {
        score.player1 = score.player1 + 1;
        GAMESTATE = 'POINT';
        pointsound.play();
        
      }
    }
    if (ball.x < borders.leftx) {
      if ((ball.y > paddle1.y) &&
        (ball.y < (paddle1.y + paddle1.length))) {
        ball.xvelocity = -ball.xvelocity;
        song.play();
      } else if (score.player1 >=5||score.player2 >=5) {
        GAMESTATE = 'GAMEOVER';
      }else {
        score.player2 = score.player2 + 1;
        GAMESTATE = 'POINT';
        pointsound.play();
      }
    }
  }
}


function drawStuff() {
  background(200);
  // draw paddles
  fill(250)

  push();
  fill(255, 200, 105)
  rect(paddle1.x, paddle1.y, paddle1.width,
    paddle1.length);
  rect(paddle2.x, paddle2.y, paddle2.width,
    paddle2.length);
  pop();
  // draw ball
  ellipse(ball.x, ball.y, ball.size);
  // draw net
  // draw score
  text(score.player1, width / 4, 20);
  text(score.player2, 3 * width / 4, 20);

  push();
  noFill();
  strokeWeight(4);
  stroke(255);
  rect(borders.leftx, borders.topy,
    borders.rightx - borders.leftx,
    borders.bottomy - borders.topy);
  pop();

  if (GAMESTATE == 'START') {
    // text press spacebar to play
    textAlign(CENTER);
    text('press SPACEBAR to start', width / 2, height / 2);
    // text instruction
  } else if (GAMESTATE == 'PLAY') {} else if (GAMESTATE == 'POINT') {
    // play point sound
    textAlign(CENTER);
    text('press SPACEBAR to continue', width / 2, height / 2);
  } else if (GAMESTATE == 'GAMEOVER') {
    // play gamesound
    // text GAME OVER and WINNER!
    textAlign(CENTER);
    text('GAMEOVER', width / 2, height / 2);
    gameoversound.play(); 


  }
}

function initializePositions() {
  ball.x = width / 2;
  ball.y = height + 10;
  ball.xvelocity = random(-2,2); // probably should randomize this somehow
  ball.yvelocity = random(-2,2);

  borders.leftx = 50;
  borders.rightx = width - 50;
  borders.topy = 100;
  borders.bottomy = height - 50;

  paddle1.x = borders.leftx - paddle1.width;
  paddle1.y = height / 2;
  paddle2.x = borders.rightx;
  paddle2.y = height / 2;
}  
