var mario, mario_running, mario_collided;
var ground, groundImg;
var gameOver, goImg, restart, rImg;
var obstaclesGroup, brick1Group;
var bg, backgd;
var oAni;
var brickImg;
var score =0;
var PLAY =1;
var END =0;
var gameState = PLAY;
var dieSound, jumpSound, checkpointSound;

function preload(){
  mario_running = loadAnimation("mario00.png","mario01.png","mario02.png","mario03.png");
  groundImg = loadImage("bg.png");
  mario_collided = loadAnimation("collided.png");
  //backgd = loadImage("bg.png");
  brickImg = loadImage("brick.png");
  dieSound = loadSound("die.mp3");
  jumpSound = loadSound("jump.mp3");
  goImg = loadImage("gameOver.png");
  rImg = loadImage("restart.png");
  checkpointSound = loadSound("checkPoint.mp3");
  oAni = loadAnimation("obstacle1.png","obstacle2.png","obstacle3.png", "obstacle4.png");
}
function setup(){
  createCanvas(400,400);
  
  mario = createSprite(50, 310, 20,50);
  mario.addAnimation("mario_running", mario_running);
  mario.addAnimation("collided", mario_collided);
  mario.scale = 1;
  mario.setCollider("circle", 0,0,20);
  mario.debug= true;


  invisibleGround = createSprite(50,330,width,10);  
  invisibleGround.visible = false;
  
  ground = createSprite(200,200);
  ground.addImage("ground",groundImg);
  ground.x = 250;
  //ground.velocityX = -3;
  ground.scale = 0.9;
  
  brick1Group = createGroup();
  
  obstaclesGroup = createGroup();

  gameOver = createSprite(width/2, 150, 20,10);
  gameOver.addImage(goImg);
  gameOver.scale =0.5;
  restart = createSprite(width/2, 190, 20, 10);
  restart.addImage(rImg);
  restart.scale =0.5;
  
}

function draw(){
  background("brown");
  stroke("yellow");
  ground.depth = 0;
  //mario.depth = mario.depth +1;
  textSize(20);
  text("Score: "+ score, 300, 20 );
  console.log(gameState);
  if(gameState === PLAY){
    gameOver.visible = false;
    restart.visible = false;
    if(frameCount % 1000 === 0 && score >0){
      checkpointSound.play();
    }
    ground.velocityX = -(3+score/200);
    mario.changeAnimation("mario_running", mario_running);
    if(keyDown("space") && mario.y >= 225){
      jumpSound.play();
      mario.velocityY = -10;
    }
    mario.velocityY = mario.velocityY +0.5;
    //console.log(ground.x);
    if(ground.x < 150){
      ground.x = 200;
    }
    mario.collide(invisibleGround);
    spawnObstacles();
    spawnBricks();
    if(mario.isTouching(brick1Group)){
      score = score+ 1;
      brick1Group.destroyEach();
    }
    
    if(mario.isTouching(obstaclesGroup)){
      gameState = END;
      dieSound.play();
      
    }
  }
  else if(gameState === END){
    gameOver.visible = true;
      restart.visible = true;
    mario.velocityY =0;
    ground.velocityX =0;
    obstaclesGroup.setVelocityEach(0,0);
    brick1Group.setVelocityEach(0,0);
    

    mario.changeAnimation("collided", mario_collided);
    

    obstaclesGroup.setLifetimeEach(-1);
    brick1Group.setLifetimeEach(-1);
    
        if(mousePressedOver(restart)){
      reset();
    }
    
  }
  
  drawSprites();
}
function spawnObstacles(){
  if(frameCount % 80 ==0){
    var obstacle = createSprite(350, 300, 10, 10);
    obstacle.velocityX = -3;
    obstacle.addAnimation("obstacle",oAni);
    obstacle.scale =0.7;
    obstacle.lifetime = 300;
    obstaclesGroup.add(obstacle);
  }
}
function spawnBricks(){
  if(frameCount % 50 ==0){
    var brick1 = createSprite(350, 200, 10, 10);
    
    
    brick1.y = Math.round(random(220,250));
    

    brick1.depth = mario.depth;
    
    mario.depth = mario.depth +1;
    brick1.velocityX = -3;
    
    brick1.addImage("brick",brickImg);
    
    brick1.scale =0.7;
    
    brick1.lifetime = 300;
    
    brick1Group.add(brick1);
    
  }
}
function reset(){
  score =0;
  obstaclesGroup.destroyEach();
  brick1Group.destroyEach();
  
  restart.visible = false;
  gameOver.visible = false;
  gameState = PLAY;

}