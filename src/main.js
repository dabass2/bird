import '../css/style.css';
import {sketch} from 'p5js-wrapper';
import randomWords from 'random-words';

class Word {
  constructor(xPos, yPos = 0, textSize = 70) {
    this.text = randomWords({exactly: 1, maxLength: 4})[0];
    this.x = xPos;
    this.y = yPos;
    this.size = textSize;
    // console.log(xPos, (this.size * this.text.length)/2);
    const wordScreenSize = (this.size * this.text.length)/2;
    if (this.x - wordScreenSize < 0) {
      this.x += wordScreenSize * 0.5
    } else if (this.x + wordScreenSize > width) {
      this.x -= wordScreenSize * 0.5
    }
  }

  draw() {
    if (this.y > height) words = words.filter((x) => x.text !== this.text)
    this.y += this.size / 20
    push();
    textSize(this.size);
    text(this.text, this.x, this.y);
    pop();
  }
}

const NUM_INIT_WORDS = 1
let numCorrect = 0
let numTotal = 0
let numWordsToSpawn = 1
let typedWord = ''
let words = []
sketch.setup = function() {
  createCanvas (windowWidth, windowHeight);
}

sketch.draw = function() {
  if (words.length < numWordsToSpawn) {
    numTotal += 1
    words.push(new Word(Math.floor(Math.random() * windowWidth)))
  }
  background(0);
  fill(255, 255, 255)
  textAlign(CENTER);
  drawWords();
  textSize(50);
  text(typedWord, width/2, windowHeight - 20)

  push();
  textAlign(LEFT)
  textSize(20)
  text(`Correct: ${numCorrect}`, 20, 30)
  text(`Total: ${numTotal}`, 20, 50)
  pop();

  numWordsToSpawn = Math.max(Math.floor(3*Math.log10(numTotal + (numCorrect * 0.01))), 1)
  // console.log(numWordsToSpawn)
}

function drawWords() {
  for (const wordToDraw of words) {
    wordToDraw.draw()
  }
}

function checkForMatches() {
  let initLength = words.length
  words = words.filter((x) => x.text !== typedWord.replace(/\s/g,''))
  numCorrect += (initLength === words.length ? 0 : 1)
  // console.log(numCorrect, numTotal);
}

sketch.keyPressed = function() {
  // console.log("key pressed", keyCode);
  if (keyCode === ENTER) {
    checkForMatches()
    typedWord = ''
  } else if (keyCode === BACKSPACE && typedWord.length > 0) {
    typedWord = typedWord.slice(0, -1)
  }
}

sketch.keyTyped = function() {
  // console.log("key typed", key);
  if (key !== "Enter") typedWord += key
}

sketch.windowResized = function() {
  resizeCanvas(windowWidth, windowHeight);
}


