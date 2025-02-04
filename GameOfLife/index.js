"use strict";
import { Tile } from "./tile.js";
const gameArea = document.querySelector(".gameArea");
const newButton = document.querySelector("#newGame");
const nextGenButton = document.querySelector("#nextGen");
const widthInput = document.querySelector("#width");
const heighthInput = document.querySelector("#height");
const saveButton = document.querySelector("#save");
const loadButton = document.querySelector("#load");
const startButton = document.querySelector("#start");
const stopButton = document.querySelector("#stop");
const intervalInput = document.querySelector("#interval");
const helpButton = document.querySelector("#help");
const ctx = gameArea.getContext("2d");

const tileSize = 15;
const lineWidth = 2;
let colNum;
let rowNum;

let height;
let width;

let tiles = [];
let interval = null;
let delay = 100;
let isRunning = false;
window.onload = () => {
  colNum = parseInt(widthInput.value);
  rowNum = parseInt(heighthInput.value);
  NewGame();
};

// window.onbeforeunload = function () {
//   return "Are you sure you want to leave?";
// };

function Start() {
  delay = intervalInput.value;
  isRunning = true;
  clearInterval(interval);
  interval = setInterval(HandleNextGeneration, delay);
}
startButton.addEventListener("click", Start);

function Stop() {
  isRunning = false;
  clearInterval(interval);
}
stopButton.addEventListener("click", Stop);

window.addEventListener("keydown", function (e) {
  if (e.key == "p") {
    e.preventDefault();
    isRunning ? Stop() : Start();
  }
});

function saveGame() {
  localStorage.setItem("tiles", JSON.stringify(tiles));
}
saveButton.addEventListener("click", saveGame);

function loadGame() {
  console.log(tiles);

  let data = JSON.parse(localStorage.getItem("tiles"));
  // if (data.length != tiles.length || data[0].length != tiles[0].length) {
  //   window.alert('the saved and current game sizes dont match!');
  //   return;
  // }
  colNum = data.length;
  rowNum = data[0].length;
  widthInput.value = colNum;
  heighthInput.value = rowNum;
  NewGame();
  tiles = data;
  for (let x = 0; x < colNum; x++) {
    for (let y = 0; y < rowNum; y++) {
      if (tiles[x][y].isLive) {
        colorTile(x, y, "black");
      } else {
        colorTile(x, y, "white");
      }
    }
  }
  console.log(tiles);
}
loadButton.addEventListener("click", loadGame);

function showHelp() {
  window.alert('p - start/stop simulation \nn - next generation\nRules based on nearby live cells: \nLess than 2->dies, 2-3->stays alive, 3+-> dead \nif dead and 3 live nearby -> becomes live');
}
helpButton.addEventListener("click", showHelp);

function NewGame() {
  height = tileSize * rowNum + 1;
  width = tileSize * colNum + 1;
  for (let x = 0; x < colNum; x++) {
    tiles[x] = [];
    for (let y = 0; y < rowNum; y++) {
      tiles[x][y] = new Tile();
    }
  }
  //  tiles = [colNum][rowNum];
  gameArea.height = height;
  gameArea.width = width;
  renderBoard();
}

function HandLeNewButton() {
  colNum = parseInt(widthInput.value);
  rowNum = parseInt(heighthInput.value);
  NewGame();
}
newButton.addEventListener("click", HandLeNewButton);

function HandleNextGeneration() {
  for (let x = 0; x < colNum; x++) {
    for (let y = 0; y < rowNum; y++) {
      countNeightbours(x, y);
    }
  }

  for (let x = 0; x < colNum; x++) {
    for (let y = 0; y < rowNum; y++) {
      let currentTile = tiles[x][y];
      if (currentTile.neighbourCount < 2) {
        colorTile(x, y, "white");
        currentTile.isLive = false;
      } else if (currentTile.neighbourCount > 3) {
        colorTile(x, y, "white");
        currentTile.isLive = false;
      } else if (!currentTile.isLive && currentTile.neighbourCount == 3) {
        colorTile(x, y, "black");
        currentTile.isLive = true;
      }
    }
  }
}
nextGenButton.addEventListener("click", HandleNextGeneration);
window.addEventListener("keydown", function (e) {
  if (e.key == "n") {
    e.preventDefault();
    HandleNextGeneration();
  }
});

function HandleCellClick(event) {
  const [x, y] = getClickedTilePos(event);
  console.log(`x:${x}, y:${y}`);
  let currentTile = tiles[x][y];
  console.log(tiles[x][y]);
  if (currentTile.isLive) {
    colorTile(x, y, "white");
    tiles[x][y].isLive = false;
  } else {
    colorTile(x, y, "black");
    tiles[x][y].isLive = true;
  }
  tiles[x][y].neighbourCount = 0;
  // countNeightbours(x, y);
}
gameArea.addEventListener("click", HandleCellClick);

function HandleRightClick(event) {
  event.preventDefault();
  const [x, y] = getClickedTilePos(event);
  countNeightbours(x, y);
  console.log(tiles[x][y].neighbourCount);
}

gameArea.addEventListener("contextmenu", HandleRightClick);

function renderBoard() {
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = "lightgray";
  //   ctx.strokeRect(0, 0, gameArea.width, gameArea.height);
  console.log(rowNum);

  for (let i = 0; i < rowNum + 1; i++) {
    ctx.moveTo(0, i * tileSize);
    ctx.lineTo(width, i * tileSize);
    ctx.stroke();
  }

  for (let i = 0; i < colNum + 1; i++) {
    ctx.moveTo(i * tileSize, 0);
    ctx.lineTo(i * tileSize, height);
    ctx.stroke();
  }
}

function getClickedTilePos(event) {
  let rect = gameArea.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;
  console.log(`x: ${x}`);
  console.log(`y: ${y}`);
  let realX = Math.floor(x / tileSize);
  let realY = Math.floor(y / tileSize);
  // console.log(Math.floor(y/50));
  return [realX, realY];
}

function colorTile(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(
    x * tileSize + Math.ceil(lineWidth / 2),
    y * tileSize + Math.ceil(lineWidth / 2),
    tileSize - lineWidth,
    tileSize - lineWidth
  );
}

function countNeightbours(x, y) {
  tiles[x][y].neighbourCount = 0;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (
        tiles[x + dx] &&
        tiles[x + dx][y + dy] &&
        !(x == x + dx && y == y + dy) &&
        tiles[x + dx][y + dy].isLive
      ) {
        tiles[x][y].neighbourCount += 1;
      }
    }
  }
}
