import { Cats } from "./square.js";
import { Timer } from "./timer.js";

export const Player = {
    FIRST: {
        name: "Player1",
        points: 0,
        catsOnBoard: 0,
        avaibleCats: 8,
        timer: null
    },
    SECOND: {
        name: "Player2",
        points: 0,
        catsOnBoard: 0,
        avaibleCats: 8,
        timer:null
    },
    currentPlayer: 0,
    init(numOfCats, setTime, p1name, p2name) {
        this.FIRST.points = 0;
        this.FIRST.catsOnBoard = 0;
        this.FIRST.avaibleCats = numOfCats;
        this.FIRST.name = p1name;

        this.SECOND.points = 0;
        this.SECOND.catsOnBoard = 0;
        this.SECOND.avaibleCats = numOfCats;
        this.SECOND.name = p2name;
        if (setTime !== -1) {
            this.FIRST.timer = new Timer(setTime);
            this.SECOND.timer = new Timer(setTime);
        }
        this.currentPlayer = 0;
    },
    getCat() {
        if (this.currentPlayer == 0) {

            this.FIRST.avaibleCats -= 1;
            this.FIRST.catsOnBoard += 1;
            return Cats.ORANGE_KITTEN;
        }
        this.SECOND.avaibleCats -= 1;
        this.SECOND.catsOnBoard += 1;
        return Cats.GREY_KITTEN;
    },
    switchPlayers() {
        this.currentPlayer = (this.currentPlayer == 0) ? 1 : 0;
    },
    switchTimers() {
        if (this.currentPlayer === 1) {
            this.FIRST.timer.pause();
            this.SECOND.timer.continue();
        } else {
            this.SECOND.timer.pause();
            this.FIRST.timer.continue();
        }
    }

}