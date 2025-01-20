import { Cats } from "./square.js";
import { Player } from "./player.js";
import { Stage } from "./state.js";

export function renderBoard(state) {
    return `${renderTable(state.board)}`;
}

function renderTable(board) {
    return `<table id="gameBoard">${board.map(row => renderRow(row)).join("")}</table>`;
}

function renderRow(row) {
    return `<tr>${row.map(square => renderSquare(square)).join("")}</tr>`;
}

function renderSquare(square) {
    return `<td><button>${square.convertToImg()}</button></td>`;

}

export function updatePlayerPoints(p1point, p2point) {
    const p1pointLabel = document.querySelector("#p1Point")
    const p2pointLabel = document.querySelector("#p2Point")
    p1pointLabel.innerHTML = `Points: ${p1point}`;
    p2pointLabel.innerHTML = `Points: ${p2point}`;
}

export function updatePlayerCats(p1cats, p2cats) {
    const p1CatsLabel = document.querySelector("#p1Cats")
    const p2CatsLabel = document.querySelector("#p2Cats")
    p1CatsLabel.innerHTML = `Cats: ${p1cats}`;
    p2CatsLabel.innerHTML = `Cats: ${p2cats}`;
}

export function updatePlayerNames(p1name, p2name) {
    const p1NameLabel = document.querySelector("#p1name")
    const p2NameLabel = document.querySelector("#p2name")
    if (p1name !== undefined) p1NameLabel.innerHTML = `${p1name}`;
    if (p2name !== undefined) p2NameLabel.innerHTML = `${p2name}`;
}

export function writeRecord(previousGames) {
    const recordList = document.querySelector('#records');
    const newUl = document.createElement('ul');
    localStorage.setItem('recentGames', JSON.stringify(previousGames));
    previousGames.slice(previousGames.length - 5, previousGames.length).reverse().forEach(element => {
        const newLi = document.createElement('li');
        newLi.innerText = `${element.date}, ${Player.FIRST.name} vs ${Player.SECOND.name} Winner:${element.winner}, ${Player.FIRST.points}-${Player.SECOND.points}`;
        newUl.appendChild(newLi);
    });
    recordList.innerHTML = newUl.innerHTML;
}

export function highligthCats(square, board) {
    const td = square.localName == "img" ? square.parentNode.parentNode : square.parentNode;
    const tr = td.parentNode;
    let x = td.cellIndex;
    let y = tr.rowIndex;
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            var row = document.querySelector("#gameBoard").rows[i].cells;
            row[j].firstChild.style.background = 'darkorchid';
        }
    }
    if (board[y][x].catType === Cats.EMPTY) {
        var row = document.querySelector("#gameBoard").rows[y].cells;
        row[x].firstChild.style.background = 'purple';
    }


    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (board[y + dy] && board[y + dy][x + dx]) {
                const squareCat = board[y + dy][x + dx].catType
                if (squareCat !== Cats.EMPTY
                    && !(y + dy === y && x + dx === x)) {
                    var row = document.querySelector("#gameBoard").rows[y + dy].cells;
                    row[x + dx].firstChild.style.background = '#996C90';
                }
            }
        }
    }
}

export function drawCanvases() {
    const p1canvas = document.querySelector('#p1canvas');
    const p1context = p1canvas.getContext('2d');
    const orangeImg = new Image();
    orangeImg.src = "/media/orange_cat.png"

    const p2canvas = document.querySelector('#p2canvas');
    const p2context = p2canvas.getContext('2d');

    const greyImg = new Image();
    greyImg.src = "/media/grey_catok.png"

    orangeImg.addEventListener("load", () => {
        p1context.clearRect(0, 0, p1canvas.width, p1canvas.height);
        for (let i = 0; i < Player.FIRST.avaibleCats / 4; i++) {
            for (let index = 0; index < Player.FIRST.avaibleCats - (i * 4); index++) {
                p1context.drawImage(orangeImg, 0 + index * 50, 0 + i * 50, 50, 50)
            }

        }
    })

    greyImg.addEventListener("load", () => {
        p2context.clearRect(0, 0, p2canvas.width, p2canvas.height);
        for (let i = 0; i < Player.SECOND.avaibleCats / 4; i++) {
            for (let index = 0; index < Player.SECOND.avaibleCats - (i * 4); index++) {
                p2context.drawImage(greyImg, 0 + index * 50, 0 + i * 50, 50, 50);
            }

        }


    })
}

export function renderTimers(p1timer, p2timer, checked) {
    const p1clock = document.querySelector('#p1clock');
    const p2clock = document.querySelector('#p2clock');
    if (p1timer.getSec() < 15) {
        p1clock.style.color = "red";
    }
    if (p2timer.getSec() < 15) {
        p2clock.style.color = "red";
    }
    if (checked) {
        p1clock.innerText = p1timer.getTime();
        p2clock.innerText = p2timer.getTime();
    }
}

export function renderWinScreen(winOnTime, winner) {
    const winScreen = document.querySelector('#winScreen').childNodes[1];
    const board = document.querySelector("#board");
    console.log(winScreen);
    winScreen.innerHTML = "";
    board.hidden = true;
    winScreen.parentElement.hidden = false;
    winScreen.innerHTML += `<h1> ${winner === Stage.ORANGE_WIN ? Player.FIRST.name : Player.SECOND.name} won!</h1>`
    if (winOnTime) {
        winScreen.innerHTML += `<h3>${winner === Stage.ORANGE_WIN ? Player.SECOND.name : Player.FIRST.name} has run out of time!</h3>`
    }
    else {
        winScreen.innerHTML += `<h3> ${winner === Stage.ORANGE_WIN ? Player.FIRST.name : Player.SECOND.name} has reached the point goal!</h3>`
    }
}

export function to2Digits(num) {
    return String(num).padStart(2,'0');
}