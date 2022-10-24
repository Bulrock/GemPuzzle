let squares = [];
let results =  [];
let emptySquare = null;
let size = 4;
let moveNumber = 0;
let timeout = null;
let timeInSeconds = 0;
let isGameStopped = false;
let soundEnabled = false;

function setLocalStorage(){
    localStorage.setItem('size', size);
    localStorage.setItem('moves', moveNumber);
    localStorage.setItem('time', timeInSeconds);
    localStorage.setItem('saved-puzzle', JSON.stringify(readSquareNumbers()));
}

window.addEventListener('load', getLocalStorage);


function getLocalStorage(){
    if(localStorage.getItem('size')){
        size = Number(localStorage.getItem('size'));
    } else {
        size = 4;
    };

    if(localStorage.getItem('moves')){
        moveNumber = Number(localStorage.getItem('moves'));
    } else {
        moveNumber = 0;
    };

    if(localStorage.getItem('time')){
        timeInSeconds = Number(localStorage.getItem('time'));
    } else {
        timeInSeconds = 0;
    };

    if(localStorage.getItem('results')){
        results = JSON.parse(localStorage.getItem('results'));
    };
}

let mainTag = document.getElementsByTagName('main');
const toolBar = document.createElement('div');
mainTag[0].append(toolBar);
toolBar.classList.add('toolbar');

function createButton (buttonId, text){
    let button = document.createElement('button');
    toolBar.append(button);
    button.setAttribute("id", buttonId);
    button.textContent = text;
}

createButton('restart-button', 'Shuffle and start');
createButton('stop-button', 'Stop');
createButton('save-button', 'Save');
createButton('results-button', 'Results');

const info = document.createElement('div');
mainTag[0].append(info);
info.classList.add('info');

function createInfo (spanId, text){
    let infoDiv = document.createElement('div');
    let span = document.createElement('span');
    info.append(infoDiv);
    infoDiv.textContent = text;
    infoDiv.appendChild(span);
    span.setAttribute("id", spanId);
}

createInfo('moveNumber', 'Moves:');
createInfo('time', 'Time:');

function createSizeRadioButtons(puzzleSize, ul){
    const radioDiv = document.createElement('div');
    radioDiv.classList.add('size-radio-button');
    const input = document.createElement('input');
    input.id = puzzleSize;
    input.classList.add('size-input');
    input.type = 'radio';
    input.name = 'size';
    input.value = puzzleSize;
    input.addEventListener('click', handlePuzzleSizeSelect);

    if(puzzleSize === size){
        input.checked = true;
    };

    const label = document.createElement('label');
    label.classList.add('size-text');
    label.for = puzzleSize;
    label.textContent = `${puzzleSize}x${puzzleSize}`

    radioDiv.appendChild(input);
    radioDiv.appendChild(label);

    ul.appendChild(radioDiv);
}

let moveNumberDiv = document.getElementById("moveNumber");
let timeDiv = document.getElementById("time");
let restartButton = document.getElementById("restart-button");
let stopButton = document.getElementById("stop-button");
let saveButton = document.getElementById("save-button");
let resultsButton = document.getElementById("results-button");

saveButton.addEventListener('click', setLocalStorage);
resultsButton.addEventListener('click', showResults);

function showResults () {
    let resultMessage = '';
    if(results.length === 0){
        alert('Finish game to add your score to results!');
    } else {
        for (let i = 1; i <= results.length; i++){
            resultMessage = resultMessage + `${i}. Finished ${results[i-1][2]}x${results[i-1][2]} in ${results[i-1][0]} second(s) and ${results[i-1][1]} move(s)\n`
        }
        alert(`Last 10 results:\n${resultMessage}`);
    }
}

const puzzleContainer = document.createElement('div');
mainTag[0].append(puzzleContainer);
puzzleContainer.classList.add('puzzle-container');

const switcherDiv = document.createElement('div');
switcherDiv.classList.add('sound-switcher');
const switcherText = document.createElement('p');
switcherText.classList.add('sound-switcher-text');
switcherText.textContent = 'Sound on/off';
const switcher = document.createElement('img');
switcher.classList.add('switcher');
switcher.src = "./assets/svg/switch-passive.svg";
switcher.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    if(soundEnabled) {
        switcher.src = "./assets/svg/switch-active.svg";
    }
    else {
        switcher.src = "./assets/svg/switch-passive.svg";
    }
})

switcherDiv.appendChild(switcherText);
switcherDiv.appendChild(switcher);

function createFrameSizeText(size){
    if(document.querySelector('.frame')){
        let removeElement = document.querySelector('.frame');
        removeElement.remove();
    }

    const frameDiv = document.createElement('div');
    frameDiv.classList.add('frame');
    frameDiv.textContent = `Frame size: ${size}x${size}`;
    frameDivContainer.append(frameDiv);
}

const frameDivContainer = document.createElement('div');
frameDivContainer.classList.add('frame-container');
frameDivContainer.appendChild(switcherDiv);
mainTag[0].append(frameDivContainer);


function createOtherSizesDIv(){
    const sizeDiv = document.createElement('div');
    sizeDiv.textContent = 'Other sizes:'
    sizeDiv.classList.add('size');
    const ul = document.createElement('ul');
    ul.classList.add('size-radio');
    sizeDiv.appendChild(ul)
    mainTag[0].append(sizeDiv);

    for (let i = 3; i < 9; i++){
        createSizeRadioButtons(i, ul);
    }
}

function generateSquares(size) {
    squares = [];
    for(var i = 0; i < size; i++) {
        for(var j = 0; j < size; j++) {
            var square = createSquare(i*size + j);
            if(i === size - 1 && j === size - 1) {
                emptySquare = square;
            }
            squares.push(square);
        }
    }

    squares = shuffle(squares);
    // squares[size*size-1] = squares[size*size-2]
    // squares[size*size-2] = emptySquare;
    draw(squares, moveNumber)
}

function draw(squares, moveNumber) {
    puzzleContainer.textContent = "";
    squares.forEach(square => puzzleContainer.appendChild(square));

    moveNumberDiv.textContent = moveNumber;
}

function drawTime(timeInSeconds) {
    timeDiv.textContent = createHmsString(timeInSeconds);
}

function createRow() {
    var result = document.createElement("div");
    result.classList.add("row");
    return result;
}

function createSquare(number) {
    var result = document.createElement("div");
    result.id = `square-${number}`
    var text = document.createElement("div");
    text.textContent = (number + 1).toString();
    if(number === size*size - 1) {
        text.textContent = "";
        result.classList.add("empty");
    }
    else {
        result.addEventListener("click", handleSquareClick);
    }
    result.appendChild(text);
    result.classList.add("square");
    return result;
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
}

function handlePuzzleSizeSelect (e) {
    puzzleContainer.classList.remove(`size${size}`);
    size = Number(e.target.value);
    puzzleContainer.classList.add(`size${size}`);
    createNewGame(size);
    createFrameSizeText(size);
}

function getParentByClass(element, parentClassName) {
	let result = element;
	while (!result.classList.contains(parentClassName) && element.parentElement) {
		result = element.parentElement;
	}
	return result;
}

function handleSquareClick(event) {
    if(isGameStopped) return;

    var clickedSquare = getParentByClass(event.target, 'square');
    var clickedSquareNumber = getSquareNumber(event.target);
    if (clickedSquareNumber < 0 || clickedSquareNumber >= size*size - 1) return;

    var emptySquareIndex = squares.indexOf(emptySquare);
    var clickedSquareIndex = squares.indexOf(clickedSquare);
    var canMoveRight = clickedSquareIndex === emptySquareIndex - 1
                       && clickedSquareIndex % size != size - 1;
    var canMoveLeft = clickedSquareIndex === emptySquareIndex + 1
                      && clickedSquareIndex % size != 0;
    var canMoveDown = clickedSquareIndex === emptySquareIndex - size
                      && clickedSquareIndex + size < size * size;
    var canMoveUp = clickedSquareIndex === emptySquareIndex + size
                    && clickedSquareIndex - size >= 0;
    if(!canMoveRight && !canMoveLeft && !canMoveDown && !canMoveUp) return;

    squares[emptySquareIndex] = clickedSquare;
    squares[clickedSquareIndex] = emptySquare;

    if(canMoveRight) move(clickedSquare, "to-right");
    if(canMoveLeft) move(clickedSquare, "to-left");
    if(canMoveDown) move(clickedSquare, "down");
    if(canMoveUp) move(clickedSquare, "up");
}

const audio = new Audio('./assets/sounds/sound-card.mp3');

function move(square, direction) {
    square.onanimationend = () => {
        square.classList.remove(direction);

        moveNumber++;
        draw(squares, moveNumber);
        if(soundEnabled) {
            audio.pause();
            audio.currentTime = 0;
            audio.play();
        }

        if(isPuzzleSolved()) {
            let unshiftElement = [timeInSeconds, moveNumber, size];
            stopTimer();
            if(results.length < 10){
                results.unshift(unshiftElement);
            } else if(results.length === 10){
                results.pop();
                results.unshift(unshiftElement);
            };
            saveResult();
            showAlert()
        }
    };
    square.classList.add(direction);
}

function saveResult(){
    localStorage.setItem('results', JSON.stringify(results));
}

let timeoutAlert;

function showAlert() {
  timeout = setTimeout(alertFunc, 200);
}

function alertFunc() {
    alert(`Hooray! You solved the puzzle in ${createHmsString(timeInSeconds)} and ${moveNumber} move(s)!`);
}

function getSquareNumber(squareElement) {
    return Number.parseInt(squareElement.id.split("-")[1]);
}

function createHmsString(totalSeconds) {
    const sec = parseInt(totalSeconds, 10);
    let hours   = Math.floor(sec / 3600);
    let minutes = Math.floor((sec - (hours * 3600)) / 60);
    let seconds = sec - (hours * 3600) - (minutes * 60);
    if (hours   < 10) { hours   = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    if(hours > 0) return hours + ':' + minutes + ':' + seconds;
    return minutes + ':' + seconds;
}

restartButton.onclick = () => {
    createNewGame(size);
}

stopButton.onclick = () => {
    if(isGameStopped) {
        timeout = setTimeout(timer, 1000)
        stopButton.textContent = "Stop";
    }
    else {
        stopTimer();
        stopButton.textContent = "Resume";
        if(timeout) clearTimeout(timeout);
    }

    isGameStopped = !isGameStopped;
}

function stopTimer() {
    if(timeout) clearTimeout(timeout);
}

function timer() {
    timeInSeconds++;
    drawTime(timeInSeconds);
    if(timeout) clearTimeout(timeout);
    timeout = setTimeout(timer, 1000)
}

function isPuzzleSolved() {
    var currentSquareNumbers = readSquareNumbers();
    for(var i = 0; i < size*size; i++) {
        if(currentSquareNumbers[i] !== i) return false;
    }
    return true;
}

function readSquareNumbers() {
    var result = [];
    squares.forEach(square => {
        result.push(getSquareNumber(square));
    });
    return result;
}

function createNewGame(size) {
    moveNumber = 0
    generateSquares(size);

    timeInSeconds = 0;
    drawTime(timeInSeconds);
    if(timeout) clearTimeout(timeout);
    timeout = setTimeout(() => { timer(); }, 1000);
}

function init (){
    if(localStorage.getItem('saved-puzzle')){
        getLocalStorage()
        squares = [];
        let savedPuzzle = JSON.parse(localStorage.getItem('saved-puzzle'));
        for(var i = 0; i < savedPuzzle.length; i++) {
            var square = createSquare(savedPuzzle[i]);
            if(savedPuzzle[i] === savedPuzzle.length - 1) {
                emptySquare = square;
            }
            squares.push(square);
        }
        draw(squares, moveNumber);
        drawTime(timeInSeconds);
        timeout = setTimeout(() => { timer(); }, 1000);
    }
    else {
        createNewGame(size);
    }
    createFrameSizeText(size)
    createOtherSizesDIv()
    puzzleContainer.classList.add(`size${size}`);
}

init()