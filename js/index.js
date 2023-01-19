// Some DOM manipulation to get started
const myCanvas = document.querySelector("canvas")
const ctx = myCanvas.getContext("2d")
const loseScreen = document.querySelector("#loseScreen")
const resetBtn = document.querySelector("#reset")
const scoreGameOver = document.querySelector("#loseScreen span")
const introScreen = document.querySelector(".game-intro")
myCanvas.style.display = "none"

// Road elements and variables
const roadOne = new Image()
const roadTwo = new Image()
const grassSize = 65
const backgroundRollingSpeed = 3.2
roadOne.src = "../images/road.png"
roadTwo.src = "../images/road.png"
let roadOneY = 0
let roadTwoY = -myCanvas.height


// Car elements - original size of the picture 159*319 pixels
const myCar = new Image()
myCar.src = "../images/car.png"
const myCarWidth = 158 / 3
const myCarHeight = 319 / 3
let carSpeed = 2
let isMovingLeft = false
let isMovingRight = false


// Obstacle elements
// Class Obstacle extends the Image class to be able to spawn 
// Obstacles with a source property
class Obstacle extends Image {
  constructor(width, height, src){
  super(width, height, src)

  // Obstacles will have a fixed height but a random width
  this.width = 50 + Math.floor(Math.random() * 100)
  this.height = 50
  this.src = "../images/rock.png"
  // needs some fine tuning. Ideally would never spawn an obstacle entirely on grass
  this.obstacleX = Math.floor(Math.random() * (myCanvas.width - grassSize * 2) + grassSize)
  this.obstacleY = 0
  }
}

// Initial state variables
let gameOver = false
let gameStarted = false
let animateID = 0
let carX = myCanvas.width / 2 - myCarWidth / 2
let carY = myCanvas.height / 1.2
let score = 0


// Animate background function
const animateBg = function () {
  ctx.drawImage(roadOne, 0, roadOneY, myCanvas.width, myCanvas.height)
  ctx.drawImage(roadTwo, 0, roadTwoY, myCanvas.width, myCanvas.height)
  roadOneY += backgroundRollingSpeed
  roadTwoY += backgroundRollingSpeed
  if(roadOneY > myCanvas.height) {
    roadOneY = -myCanvas.height
  }
  if(roadTwoY > myCanvas.height) {
    roadTwoY = -myCanvas.height
  }
}


// Animate car function
const moveCar = function() {
  ctx.drawImage(myCar, carX, carY, myCarWidth, myCarHeight)
  if (isMovingLeft && carX > grassSize) {
    carX -= carSpeed
  }
  if (isMovingRight  && carX + myCarWidth < myCanvas.width - grassSize) {
    carX += carSpeed
  }
}


// createObstacle function to call in later iterations
let myObstacle
let myObstacle2

const createObstacle = function() {
    myObstacle = new Obstacle

    // Obstacle 2 and all the clunky variable naming are an afterthought. 
    // I thought I could create newObstacles with setInterval but it went 
    // sideways for too long and I decided to settle for an easier work-around.
    myObstacle2 = new Obstacle
  } 


// moveObstacle function to draw moving obstacles
const moveObstacle = function() {
  ctx.drawImage(myObstacle, myObstacle.obstacleX, myObstacle.obstacleY, myObstacle.width, myObstacle.height)
  ctx.drawImage(myObstacle2, myObstacle2.obstacleX, myObstacle2.obstacleY, myObstacle2.width, myObstacle2.height)
  myObstacle.obstacleY += 3
  myObstacle2.obstacleY += 4

  if(myObstacle.obstacleY > myCanvas.height) {
    createObstacle()
    score += 1
  }
}

// Animate function
const animate = function () {
  animateBg()
  moveCar()
  moveObstacle()

  ctx.font = '45px cursive'
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black"
  ctx.lineWidth = 2
  // Close enough to Comic Sans haha!
  ctx.fillText(`Score: ${score}`, 15, 50)
  ctx.strokeText(`Score: ${score}`, 15, 50)

  // Collision logic for the two obstacles
  if(myObstacle.obstacleX < carX + myCarWidth &&
    myObstacle.obstacleX + myObstacle.width > carX &&
    myObstacle.obstacleY < carY + myCarHeight &&
    myObstacle.height + myObstacle.obstacleY > carY) {
    gameOver = true;
  }
  if(myObstacle2.obstacleX < carX + myCarWidth &&
    myObstacle2.obstacleX + myObstacle2.width > carX &&
    myObstacle2.obstacleY < carY + myCarHeight &&
    myObstacle2.height + myObstacle2.obstacleY > carY) {
    gameOver = true;
  }
  
  if(!gameOver) {
    animateID = requestAnimationFrame(animate)
  }
  else {
    cancelAnimationFrame(animateID)
    myCanvas.style.display = "none"
    introScreen.style.display = "none"
    loseScreen.style.display = "block"
    scoreGameOver.innerText = score
  }
}

// Start game function for the click event listener
function startGame() {
  myCanvas.style.display = "flex"
  introScreen.style.display = "none"

  // spawning the first Obstacles
  createObstacle()

  // checking if game has already started to prevent
  // clicking again on the start game button
  if (!gameStarted) {
    gameStarted = true
    window.addEventListener("keydown", (event)=>{
      if (event.key === "a") {
        isMovingLeft = true
      }
      if (event.key === "d") {
        isMovingRight = true
      }
    })

    window.addEventListener("keyup", ()=>{
      isMovingLeft = false
      isMovingRight = false
      }
    )
    animate()
    
  }
}
const reset = function() {
  gameOver = false
  gameStarted = false
  animateID = 0
  carX = myCanvas.width / 2 - myCarWidth / 2
  carY = myCanvas.height / 1.2
  score = 0
  loseScreen.style.display = "none"
  myCanvas.style.display = "block"
  introScreen.style.display = "block"
  startGame()
}


window.onload = () => {
  document.getElementById('start-button').onclick = () => {
    if(!gameStarted) {
      startGame();
    }
  };
  
  resetBtn.onclick = () => {
    reset()
  };
};
