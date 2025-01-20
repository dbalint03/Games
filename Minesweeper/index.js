import { FieldState } from "./field.js";
import { render } from "./render.js";
import { AppState, Stage } from "./state.js";

const state = new AppState();

const game = document.querySelector("#game");
const newButton = document.querySelector("button");
const widthInput = document.querySelector("#width");
const heighthInput = document.querySelector("#height");
const mineCountInput = document.querySelector("#mineCount");

//Tábla kreálás
function handleNewButtonClick() {
    const width = parseInt(widthInput.value);
    const height = parseInt(heighthInput.value);
    const mineCount = parseInt(mineCountInput.value);

    if (mineCount >= width * height) {
        return;
    }

    state.init(width, height, mineCount);
    game.innerHTML = render(state);
}
newButton.addEventListener("click", handleNewButtonClick);

//bal kattintás
function handleFieldLeftClick(event) {
    if (!event.target.matches("button")) {
        return;
    }

    if (state.stage !== Stage.PLAYING) {
        return;
    }

    const td = event.target.parentNode;
    const tr = td.parentNode;
    const x = td.cellIndex;
    const y = tr.rowIndex;

    state.reveal(x, y);
    state.checkForVictory();

    game.innerHTML = render(state);
}
game.addEventListener("click", handleFieldLeftClick);

//2 gombos kattintás
function handleFieldDoubleClick(event) {
    if (event.buttons !== 3) {
        return;
    }

    if (!event.target.matches("td")) {
        return;
    }

    if (state.stage !== Stage.PLAYING) {
        return;
    }

    const td = event.target;
    const tr = td.parentNode;
    const x = td.cellIndex;
    const y = tr.rowIndex;

    const neighbourCount = state.board[y][x].neighbourCount;
    const flagsNearby = state.countFlagsNearby(x,y);

    if (flagsNearby === neighbourCount) {
        state.board[y][x].neighbourCount = 0;
        state.board[y][x].state = FieldState.UNREVEALED;
        state.reveal(x,y);
        state.board[y][x].neighbourCount = neighbourCount;
    }

    state.checkForVictory();
    
    game.innerHTML = render(state);
}
game.addEventListener("mousedown", handleFieldDoubleClick);


//jobb kattintás
function handleFieldRightClick(event) {
    event.preventDefault();

    if (!event.target.matches("button")) {
        return;
    }

    if (state.stage !== Stage.PLAYING) {
        return;
    }

    const td = event.target.parentNode;
    const tr = td.parentNode;
    const x = td.cellIndex;
    const y = tr.rowIndex;

    state.toggleFlag(x, y);

    game.innerHTML = render(state);
}
game.addEventListener("contextmenu", handleFieldRightClick);