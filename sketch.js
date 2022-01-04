var Play = 0;
var End = 1;
var backgroundIMG , balloonIMG;
var BG, balloon;
var topBoundary , bottomBoundary;
var img, img1, img2, img3;
var obstaclesGroup;
var gameState = Play;
var restartimg , gameOverimg;
var restart , gameover;
var score=0 , foodRate = 0; 
var cylinderimg , foodimg;
var cylinderGroup , foodGroup;
var jumps, dies;

function preload()
{
    backgroundIMG = loadImage("assets/bg.png");
    balloonIMG = loadAnimation("assets/balloon1.png","assets/balloon2.png","assets/balloon3.png");
    img = loadImage("assets/obsBottom1.png");
    img1 = loadImage("assets/obsBottom2.png");
    img2 = loadImage("assets/obsBottom3.png");
    img3 = loadImage("assets/obsTop2.png");
    restartimg = loadImage("assets/restart.png");
    gameOverimg = loadImage("assets/gameOver.png");
    cylinderimg = loadImage("assets/cylinder.png");
    foodimg = loadImage("assets/food.png");
    dies = loadSound("assets/die.mp3");
    jumps = loadSound("assets/jump.mp3");
}

function setup()
{
  createCanvas(400,400);

    //background
    BG = createSprite(165,485,1,1);
    BG.addImage(backgroundIMG);
    BG.scale = 1.3;
    BG.velocityX = -1;
    BG.x = BG.width/2;
    
    //balloon
    balloon = createSprite(100,200,20,50);
    balloon.addAnimation("balloon",balloonIMG);
    balloon.scale = 0.2;

    //boundaries
    topBoundary = createSprite(200,10,800,10);
    bottomBoundary = createSprite(200,390,800,10);
    topBoundary.visible = false;
    bottomBoundary.visible = false;

     //groups
    obstaclesGroup = new Group();
    birdGroup = new Group();
    cylinderGroup = new Group();
    foodGroup = new Group();

    //game over and restart
    restart = createSprite(200,250,2,2);
    restart.addImage(restartimg);
    gameover = createSprite(200,150,200,10);
    gameover.addImage(gameOverimg);
}

function draw()
{
   background("black");
    

   

   if(gameState === Play)
   {
       restart.visible = false;
       gameover.visible = false;

    balloon.isTouching(cylinderGroup,cylinderTouched);
    BG.velocityX = -2;                                   

    //bg infinite
        if(BG.x<0)
    {
        BG.x = BG.width/2;
    }
    
    if(keyDown("space"))
    {
        balloon.velocityY = -8;
        
    }

    balloon.velocityY = balloon.velocityY+0.8;
    spawnObstacles();
    spawnbirds();
    cylinders();
    foods();

    if(obstaclesGroup.isTouching(balloon))
    {
        gameState = End;
        dies.play();
    }
   }

   else if(gameState === End)
   {
       BG.velocityX = 0;
       obstaclesGroup.setVelocityXEach(0);
       birdGroup.setVelocityXEach(0);
        restart.visible = true;
        gameover.visible = true;
        cylinderGroup.setVelocityXEach(0);
        foodGroup.setVelocityXEach(0);

        if(mousePressedOver(restart)){
        reset(); 
        }
   }
   balloon.collide(bottomBoundary);
  drawSprites();
  fill("black");
  textSize(20);
  text("Score : "+score,300,30);        
}

function cylinderTouched(balloon,cylinder){
    cylinder.destroy();
    score = score + 1;
    jumps.play();
}

function reset(){
    gameState = Play;
   score = 0;
   obstaclesGroup.destroyEach();
   birdGroup.destroyEach();
   foodGroup.destroyEach();
   cylinderGroup.destroyEach();
}

function spawnObstacles(){
    if (frameCount % 250 === 0){
        var obstacle = createSprite(400,300,10,40);
        obstacle.velocityX = -1;
        
         //generate random obstacles
         var rand = Math.round(random(1,3));
         switch(rand) {
           case 1: obstacle.addImage(img);
                   break;
           case 2: obstacle.addImage(img1);
                   break;
           case 3: obstacle.addImage(img2);
                   break;
           default: break;
         }
        
         //assign scale and lifetime to the obstacle           
         obstacle.scale = 0.1;
         //obstacle.lifetime = 300;
        //depthvalue to restart
        restart.depth = obstacle.depth + 1;
        gameover.depth = restart.depth;
        //add each obstacle to the group
         obstaclesGroup.add(obstacle);
      }
     
}

function spawnbirds(){
    if (frameCount % 200 === 0) {
       var bird = createSprite(410,100,40,10);
       bird.y = Math.round(random(10,150));
       bird.addImage(img3);
       bird.scale = 0.1;
       bird.velocityX = -3;
       
        //assign lifetime to the variable
       //bird.lifetime = 134;
       
       //adjust the depth
       img3.depth = balloon.depth;
       img3.depth = balloon.depth + 1;
       birdGroup.add(bird);
      
       }
}

function cylinders(){
    if (frameCount % 50 === 0) {
        var cylinder = createSprite(410,100,10,10);
        cylinder.y = Math.round(random(10,100));
        cylinder.addImage(cylinderimg);
        cylinder.scale = 0.2;
        cylinder.velocityX = -3;
        cylinderGroup.add(cylinder);
    }
}

function foods(){
    if (frameCount % 500 === 0) {
        var food = createSprite(410,100,10,10);
        food.y = Math.round(random(10,100));
        food.addImage(foodimg);
        food.scale = 0.2;
        food.velocityX = -3;
        foodGroup.add(food);
    }
}