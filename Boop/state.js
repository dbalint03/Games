import { Cats, Square } from "./square.js";
import { updatePlayerPoints, writeRecord, renderWinScreen, to2Digits } from "./render.js";
import { Player } from "./player.js";
import { Timer } from "./timer.js";

export const Stage = {
    NOT_STARTED: 1,
    PLAYING: 2,
    ORANGE_WIN: 4,
    GREY_WIN: 8,
    PAUSED: 16
}
let previousGames
if (localStorage.getItem('recentGames') !== null) {
    previousGames = JSON.parse(localStorage.getItem('recentGames'));
}
else {
    previousGames = [];
}

export class AppState {
    width = 0;
    height = 0;
    board = []
    stage = Stage.NOT_STARTED;
    currentPlayer = Player.FIRST;

    init(width, height, setTime) {

        if (setTime !== -1) {
            Player.FIRST.timer = new Timer(setTime);
            Player.SECOND.timer = new Timer(setTime);
        }
        this.width = width;
        this.height = height;
        this.board = [];
        this.currentPlayer = Player.FIRST;
        for (let y = 0; y < height; y++) {
            this.board[y] = [];
            for (let x = 0; x < width; x++) {
                this.board[y][x] = new Square();
                this.board[y][x].coords.x = x;
                this.board[y][x].coords.y = y;
            }
        }
        updatePlayerPoints(Player.FIRST.points, Player.SECOND.points);
    }

    placeCat(target) {

        const audio = new Audio('/media/sounds/place.mp3');
        audio.play()
        const td = target.parentNode;
        const tr = td.parentNode;
        let x = td.cellIndex;
        let y = tr.rowIndex;
        let count = 0;
        let catToADD = Player.getCat();

        this.board[y][x].catType = catToADD;
        this.board[y][x].isOccupied = true;
        var newButton = document.createElement('button')
        newButton.innerHTML = this.board[y][x].convertToImg();
        var row = document.querySelector("#gameBoard").rows[y].cells;
        row[x].replaceChild(newButton, row[x].childNodes[0]);
        row[x].childNodes[0].disabled = true;

        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (this.board[y + dy] && this.board[y + dy][x + dx]) {
                    const squareCat = this.board[y + dy][x + dx].catType
                    if (squareCat !== Cats.EMPTY
                        && !(y + dy === y && x + dx === x)) {
                        //this.writeContent(x + dx, y + dy)
                        //console.log(this.board[y + dy][x + dy]);
                        count++;
                        this.moveCat(x + dx, y + dy, dx, dy, squareCat, target);
                    }
                }
            }
        }

    }
    moveCat(ax, ay, dx, dy, squareCat, target) {
        const game = document.querySelector("#game");

        //Push off
        if (!(this.board[ay + dy] && this.board[ay + dy][ax + dx])) {
            if (this.board[ay][ax].catType == Cats.ORANGE_KITTEN
                || this.board[ay][ax].catType == Cats.ORANGE_CAT) {
                Player.FIRST.avaibleCats += 1;
                Player.FIRST.catsOnBoard -= 1
            }
            else {
                Player.SECOND.avaibleCats += 1;
                Player.SECOND.catsOnBoard -= 1
            }

            const audio = new Audio('/media/sounds/pushoff.mp3');
            audio.load();
            audio.play();

            this.board[ay][ax].catType = Cats.EMPTY;
            this.board[ay][ax].isOccupied = false;


            var newButton = document.createElement('button')
            newButton.innerHTML = this.board[ay][ax].convertToImg();
            var sor3 = document.querySelector("#gameBoard").rows[ay].cells;
            sor3[ax].replaceChild(newButton, sor3[ax].childNodes[0]);
            sor3[ax].childNodes[0].disabled = false;
            return;
        }

        const square = this.board[ay][ax];
        const newSquare = this.board[ay + dy][ax + dx]

        if (newSquare.catType !== Cats.EMPTY) {
            return;
        }


        //Push cat
        square.catType = Cats.EMPTY;
        square.isOccupied = false;

        var newButton = document.createElement('button')
        newButton.innerHTML = square.convertToImg();
        var row = document.querySelector("#gameBoard").rows[ay].cells;
        row[ax].replaceChild(newButton, row[ax].childNodes[0]);
        row[ax].childNodes[0].disabled = false;

        newSquare.catType = squareCat;
        newSquare.isOccupied = true;

        var newButton = document.createElement('button')
        newButton.innerHTML = newSquare.convertToImg();
        var sor3 = document.querySelector("#gameBoard").rows[ay + dy].cells;
        // sor3[ax].innerHTML = `<button>${Cats.EMPTY}</button>`
        sor3[ax + dx].replaceChild(newButton, sor3[ax + dx].childNodes[0]);
        sor3[ax + dx].childNodes[0].disabled = true;
    }

    deleteCat(x, y) {

        const square = this.board[y][x];
        if (square.catType == Cats.ORANGE_KITTEN
            || square == Cats.ORANGE_CAT) {
            Player.FIRST.avaibleCats += 1;
            Player.FIRST.catsOnBoard -= 1
        }
        else {
            Player.SECOND.avaibleCats += 1;
            Player.SECOND.catsOnBoard -= 1
        }

        square.catType = Cats.EMPTY;
        square.isOccupied = false;

        var row = document.querySelector("#gameBoard").rows[y].cells;
        row[x].innerHTML = `<button>${square.convertToImg()}</button>`
    }

    checkForPoints() {

        //Vertical
        for (let j = 0; j < this.height - 2; j++) {
            for (let i = 0; i < this.width; i++) {
                const winningCat = this.board[j][i].catType;
                if (this.board[j][i].isOccupied
                    && this.board[j][i].catType === winningCat
                    && this.board[j + 1][i].catType === winningCat
                    && this.board[j + 2][i].catType === winningCat) {
                    (winningCat == Cats.ORANGE_KITTEN || winningCat == Cats.ORANGE_CAT)
                        ? Player.FIRST.points += 1 : Player.SECOND.points += 1;
                    this.deleteCat(i, j);
                    this.deleteCat(i, j + 1);
                    this.deleteCat(i, j + 2);

                    updatePlayerPoints(Player.FIRST.points, Player.SECOND.points);
                    return;
                }
            }
        }


        //Horizintal
        for (let j = 0; j < this.height; j++) {
            for (let i = 0; i < this.width - 2; i++) {
                const winningCat = this.board[j][i].catType;
                if (this.board[j][i].isOccupied
                    && this.board[j][i].catType === winningCat
                    && this.board[j][i + 1].catType === winningCat
                    && this.board[j][i + 2].catType === winningCat) {
                    (winningCat == Cats.ORANGE_KITTEN || winningCat == Cats.ORANGE_CAT)
                        ? Player.FIRST.points += 1 : Player.SECOND.points += 1;
                    this.deleteCat(i, j);
                    this.deleteCat(i + 1, j);
                    this.deleteCat(i + 2, j);
                    console.log(Player.FIRST.points);
                    console.log(Player.SECOND.points);

                    updatePlayerPoints(Player.FIRST.points, Player.SECOND.points);
                    return;
                }
            }
        }

        //Diagonal upwards
        for (let j = 2; j < this.height; j++) {
            for (let i = 0; i < this.width - 2; i++) {
                const winningCat = this.board[j][i].catType;
                if (this.board[j][i].isOccupied
                    && this.board[j][i].catType === winningCat
                    && this.board[j - 1][i + 1].catType === winningCat
                    && this.board[j - 2][i + 2].catType === winningCat) {
                    (winningCat == Cats.ORANGE_KITTEN || winningCat == Cats.ORANGE_CAT)
                        ? Player.FIRST.points += 1 : Player.SECOND.points += 1;
                    console.log(Player.FIRST.points);
                    console.log(Player.SECOND.points);
                    this.deleteCat(i, j);
                    this.deleteCat(i + 1, j - 1);
                    this.deleteCat(i + 2, j - 2);

                    updatePlayerPoints(Player.FIRST.points, Player.SECOND.points);
                    return;
                }
            }
        }

        //Diagonal downwards
        for (let j = 2; j < this.height; j++) {
            for (let i = 2; i < this.width; i++) {
                const winningCat = this.board[j][i].catType;
                if (this.board[j][i].isOccupied
                    && this.board[j][i].catType === winningCat
                    && this.board[j - 1][i - 1].catType === winningCat
                    && this.board[j - 2][i - 2].catType === winningCat) {
                    (winningCat == Cats.ORANGE_KITTEN || winningCat == Cats.ORANGE_CAT)
                        ? Player.FIRST.points += 1 : Player.SECOND.points += 1;
                    this.deleteCat(i, j);
                    this.deleteCat(i - 1, j - 1);
                    this.deleteCat(i - 2, j - 2);

                    console.log(Player.FIRST.points);
                    console.log(Player.SECOND.points);

                    updatePlayerPoints(Player.FIRST.points, Player.SECOND.points);
                    return;
                }
            }
        }
    }

    checkForWin(pointsToWin, CatCount) {
        let onTime = false;
        let currentDate = new Date();
        if (Player.FIRST.points >= pointsToWin || Player.SECOND.catsOnBoard == CatCount) {
            this.stage = Stage.ORANGE_WIN;
            previousGames.push({ date: currentDate.toDateString(), winner: Player.FIRST.name, score: Player.FIRST.points });
            console.log(previousGames);
            writeRecord(previousGames);

        }
        if (Player.SECOND.points >= pointsToWin || Player.FIRST.catsOnBoard == CatCount) {
            previousGames.push({ date: currentDate.toDateString(), winner: Player.SECOND.name, score: Player.SECOND.points });
            console.log(previousGames);
            writeRecord(previousGames);
            this.stage = Stage.GREY_WIN;
        }

        if (Player.FIRST.timer.getSec() < 1) {
            this.stage = Stage.GREY_WIN;
            onTime = true;
            previousGames.push({
                date: `${currentDate.toDateString()} ${currentDate.getHours()}:${to2Digits(currentDate.getMinutes())}`,
                winner: Player.SECOND.name, score: Player.SECOND.points
            });
            writeRecord(previousGames);
        }

        if (Player.SECOND.timer.getSec() < 1) {
            this.stage = Stage.ORANGE_WIN;
            onTime = true;
            previousGames.push({
                date: `${currentDate.toDateString()} ${currentDate.getHours()}:${to2Digits(currentDate.getMinutes())}`,
                winner: Player.FIRST.name, score: Player.FIRST.points
            });
            writeRecord(previousGames);
        }
        if (this.stage !== Stage.PLAYING && this.stage !== Stage.NOT_STARTED) {
            renderWinScreen(onTime, this.stage);
            console.log(previousGames);
        }
    }
}