import '../css/style.css';
import {sketch} from 'p5js-wrapper';
import randomWords from 'random-words';

const NUM_CORRECT_SOUNDS = 5

let numCorrect = 0
let numMissed = 0
let numWordsToSpawn = 1
let typedWord = ''
let words = []
let soundOn = false
let noSpawnZone = [0,0]

class Word {
  constructor(xPos, yPos = 0, textSize = 70) {
    this.text = randomWords({exactly: 1, maxLength: 4})[0];
    this.x = xPos;
    this.y = yPos;
    this.size = textSize;
    const wordScreenSize = (this.size * this.text.length)/2;
    if (this.x - wordScreenSize < 0) {
      this.x += wordScreenSize * 0.5
    } else if (this.x + wordScreenSize > width) {
      this.x -= wordScreenSize * 0.5
    }
  }

  draw() {
    if (this.y > height) {
      words = words.filter((x) => x.text !== this.text)
      numMissed++;
    }
    this.y += this.size / (20 / (windowHeight*.001))
    push();
    textSize(this.size);
    text(this.text, this.x, this.y);
    pop();
  }
}

sketch.setup = function() {
  createCanvas (windowWidth, windowHeight);
}

sketch.draw = function() {
  if (!soundOn && keyIsDown(17) && keyIsDown(16) && keyIsDown(70)) {
    soundOn = true
    typedWord = ""
    numCorrect = 0
    numMissed = 0
  }

  if (words.length < numWordsToSpawn) {
    let pos
    while (!pos || (pos >= noSpawnZone[0] && pos <= noSpawnZone[1])) {
      pos = Math.floor(Math.random() * windowWidth)
    }
    noSpawnZone = [pos - 100, pos + 100]
    words.push(new Word(pos))
  }

  background(soundOn ? '#964B00' : 0);
  fill('255, 255, 255')
  textAlign(CENTER);
  drawWords();
  textSize(50);
  text(typedWord, width/2, windowHeight - 20)

  push();
  textAlign(LEFT)
  textSize(20)
  text(`Correct: ${numCorrect}`, 20, 30)
  text(`Missed: ${numMissed}`, 20, 50)
  pop();

  numWordsToSpawn = Math.max(Math.floor(3*Math.log10(numMissed + (numCorrect * (0.01*windowWidth)))), 1)

  if (numMissed !== 0 && numMissed > Math.floor((numMissed + numCorrect)*0.5)) {
    if (soundOn) new Audio('/assets/game_over.mp3').play()
    noLoop()
    background(soundOn ? '#964B00' : 0);
    text(`GAME OVER\nScore: ${numCorrect}`, windowWidth/2, windowHeight/2)
    let button = createButton('Reset')
    button.addClass('resetBtn')
    button.position(windowWidth/2, windowHeight/2 + 150)
    button.center('horizontal')
    button.mousePressed(() => {
      numCorrect = 0
      numMissed = 0
      numWordsToSpawn = 1
      typedWord = ''
      words = []
      soundOn = false
      loop()
      button.remove()
    })
  }
}

function drawWords() {
  for (const wordToDraw of words) {
    wordToDraw.draw()
  }
}

function checkForMatches() {
  let initLength = words.length
  words = words.filter((x) => x.text !== typedWord.replace(/\s/g,''))
  if (initLength > words.length) {
    numCorrect++;
    let num = Math.ceil(Math.random()*NUM_CORRECT_SOUNDS)
    if (soundOn) new Audio(`/assets/correct_${num}.mp3`).play()
  }
}

sketch.keyPressed = function() {
  if (keyCode === ENTER) {
    checkForMatches()
    typedWord = ''
  } else if (keyCode === BACKSPACE && typedWord.length > 0) {
    typedWord = typedWord.slice(0, -1)
  }
}

sketch.keyTyped = function() {
  let ignoredKeys = ["Enter"]
  if (!ignoredKeys.includes(key)) typedWord += key
}

sketch.windowResized = function() {
  resizeCanvas(windowWidth, windowHeight);
}


