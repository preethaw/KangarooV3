var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var kangaroo, kangaroo_running, kangaroo_collided;
var jungle, invisibleGround, jungleImage;


var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;


function preload(){
  kangaroo_running =   loadAnimation("assets/kangaroo1.png","assets/kangaroo2.png","assets/kangaroo3.png");
  kangaroo_collided = loadAnimation("assets/kangaroo1.png");
  
  jungleImage = loadImage("assets/Bg.png");
  

  
  shrub1 = loadImage("assets/shrub1.png");
  shrub2 = loadImage("assets/shrub2.png");
  shrub3 = loadImage("assets/shrub3.png");
  obstacle1 = loadImage("assets/stone.png");
  
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");

  jumpSound = loadSound("assets/jump.wav");
  collidedSound = loadSound("assets/collided.wav");
}

function setup() {
  createCanvas(1000, 400);
  
  jungle = createSprite(500,200,1000,20);
  jungle.scale = 0.2;
  jungle.addImage("jungle",jungleImage);
  jungle.x = jungle.width /2;
 

  kangaroo = createSprite(950,380,20,50);
  
  kangaroo.addAnimation("running", kangaroo_running);
  kangaroo.addAnimation("collided", kangaroo_collided);
  kangaroo.scale = 0.1;
  kangaroo.debug= true;
  kangaroo.setCollider("rectangle",0,0,kangaroo.width/2,kangaroo.height/2)
  
  
  
  gameOver = createSprite(500,200);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(500,240);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(500,390,1000,10);
  invisibleGround.visible = false;
  

  obstaclesGroup = new Group();
  shrubsGroup= new Group();
  
  score = 0;
}

function draw() {
  //kangaroo.debug = true;
  background(255);
  
  
  if (gameState===PLAY){

    jungle.velocityX = (2 + 3*score/100);
    
    //camera.position.y = kangaroo.y;
    //change the kangaroo animation
    kangaroo.changeAnimation("running", kangaroo_running);

    if(keyDown("space")) {
      kangaroo.velocityY = -12;
      jumpSound.play();
      
    }
  
    kangaroo.velocityY = kangaroo.velocityY + 0.8
  
    if (jungle.x > 1000){
      jungle.x = jungle.width/2;
    }
  
    kangaroo.collide(invisibleGround);
    
    spawnObstacles();
    spawnShrubs();
  
    if(obstaclesGroup.isTouching(kangaroo)){
        collidedSound.play();
        gameState = END;
    }
    if(shrubsGroup.isTouching(kangaroo)){
      score = score + 1;
      shrubsGroup.destroyEach();
  }

  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    jungle.velocityX = 0;
    kangaroo.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);

    shrubsGroup.setVelocityXEach(0);
    
    //change the kangaroo animation
    kangaroo.changeAnimation("collided",kangaroo_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    
    shrubsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }

    else if (gameState === WIN) {
     
      //set velcity of each game object to 0
      jungle.velocityX = 0;
      kangaroo.velocityY = 0;
      obstaclesGroup.setVelocityXEach(0);

      shrubsGroup.setVelocityXEach(0);
      
      //change the kangaroo animation
      kangaroo.changeAnimation("collided",kangaroo_collided);
      //set lifetime of the game objects so that they are never destroyed
      obstaclesGroup.setLifetimeEach(-1);

      shrubsGroup.setLifetimeEach(-1);
      
     
  }
  
  
  drawSprites();
  textSize(20);
  fill("green")
  text("Score: "+ score, 900,150);

  if(score > 5){
    textSize(30);
    fill("red")
    text("Congragulations!! You win the game!! ", 300,200);
    gameState = WIN;
   
  }
}




function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  shrubsGroup.destroyEach();
  
  score = 0;
}

function spawnObstacles() {
  if(frameCount % 150 === 0) {
    var obstacle = createSprite(0,365,10,40);
    obstacle.debug = true;
    obstacle.velocityX = (6 + 3*score/100);
    obstacle.addImage(obstacle1 );   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function spawnShrubs() {
  if(frameCount % 80 === 0) {
    var shrub = createSprite(0,300,10,40);
    //shrub.debug = true;
    shrub.velocityX = (6 + 3*score/100);
    
    //generate random shrubs
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: shrub.addImage(shrub1);
              break;
      case 2: shrub.addImage(shrub2);
              break;
      case 3: shrub.addImage(shrub3);
              break;
      default: break;
    }
    //assign scale and lifetime to the shrub           
    shrub.scale = 0.15;
    shrub.lifetime = 300;
    //add each shrub to the group
    shrubsGroup.add(shrub);
  }
}

