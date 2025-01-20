import { AppState, Stage } from "./state.js";
import { renderBoard, updatePlayerNames, highligthCats, drawCanvases, renderTimers, writeRecord } from "./render.js";
import { saveGame } from "./save.js";
import { Player } from "./player.js";

function delegate(parent, child, when, what) {
    function eventHandlerFunction(event) {
        let eventTarget = event.target
        let eventHandler = this
        let closestChild = eventTarget.closest(child)

        if (eventHandler.contains(closestChild)) {
            what(event, closestChild)
        }
    }

    parent.addEventListener(when, eventHandlerFunction)
}


const board = document.querySelector("#board")
const state = new AppState();
const p1NameInput = document.querySelector("#p1newName");
const p2NameInput = document.querySelector("#p2newName");
const widthInput = document.querySelector("#width");
const heightInput = document.querySelector('#height');
const chkboxTimer = document.querySelector('#chkboxTimer');
const timeInput = document.getElementById('timeInput');
const winScreen = document.querySelector('#winScreen');
state.stage = Stage.NOT_STARTED;
let pointsToWin;
let CatCount;
let setTime;
let p1name;
let p2name;
let previousGames

if (localStorage.getItem('recentGames') !== null) {
    previousGames = JSON.parse(localStorage.getItem('recentGames'));
    writeRecord(previousGames);   
}
else {
    previousGames = [];
}
//Start new game
const newBoardButton = document.querySelector("#new");

function handleNewBoardClick() {
    menu.hidden = true;
    setTime = chkboxTimer.checked? parseInt(timeInput.value): -1;
    pointsToWin = parseInt(document.querySelector('#pointGoal').value);
    CatCount = parseInt(document.querySelector('#maxCats').value);
    p1name = p1NameInput.value;
    p2name = p2NameInput.value;

    updatePlayerNames(p1name, p2name)
    state.init(parseInt(widthInput.value), parseInt(heightInput.value));
    Player.init(CatCount, setTime, p1name , p2name);
    board.innerHTML = renderBoard(state);
    drawCanvases();

    state.stage = Stage.PLAYING
    board.hidden = false;
    Player.FIRST.timer.start();
    Player.SECOND.timer.start();
    Player.SECOND.timer.pause();
}
newBoardButton.addEventListener('click', handleNewBoardClick);


//Show/hide advanced game settings
const advSettingsButton = document.querySelector('#advanced');
const menu = document.querySelector('#menu');

const extMenuList = document.querySelectorAll("#extendedMenu")
extMenuList.forEach(li => {
    li.style.display = "none"
})

advSettingsButton.addEventListener('click', () => {
    extMenuList.forEach(li => {
        li.style.display = li.style.display == "none" ? "block" : "none";
    })
})


//New game
const resetButton = document.querySelector("#reset")
resetButton.addEventListener('click', () => {
    board.hidden = true;
    winScreen.hidden = true;
    menu.hidden = false;
    state.stage = Stage.NOT_STARTED;
})


const newGameButton = document.querySelector("#start")
function handleNewGameClick() {

    state.init(state.width, state.height);
    Player.init(CatCount, setTime, p1name, p2name);
    board.innerHTML = renderBoard(state);
    state.stage = Stage.PLAYING;

    winScreen.hidden = true;
    menu.hidden = true;
    board.hidden = false;
    Player.FIRST.timer.start();
    Player.SECOND.timer.start();
    Player.SECOND.timer.pause();


}
newGameButton.addEventListener('click', handleNewGameClick)

//Enable/disable time input
chkboxTimer.addEventListener('change', () => {
    if (chkboxTimer.checked) {
        timeInput.disabled = false;
    }
    else {
        timeInput.disabled = true;
    }
})

//Place cat on board
delegate(board, 'button', 'click', (event, elem) => {
    if (state.stage === Stage.PLAYING) {
        state.placeCat(event.target);
        drawCanvases();
        state.checkForPoints();
        Player.switchPlayers();
        Player.switchTimers();
        
    }
})

//Board highlighting
delegate(board, 'button', 'mouseover', (event, elem) => {
    if (state.stage === Stage.PLAYING) {
        highligthCats(event.target, state.board);
    }
})

setInterval(log, 500);
function log() {
    if (state.stage === Stage.PLAYING) {
    renderTimers(Player.FIRST.timer, Player.SECOND.timer,chkboxTimer.checked);
    state.checkForWin(pointsToWin);
    }
}
