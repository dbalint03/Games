import { Player } from "./player.js"

const saveState = {
    // width,
    // height,
    // board : [],
    // currentPlayer:0,
    // FIRST : 0,
    // SECOND : 0,
    // init() {
    //     width = AppState.width,
    //     height = AppState.height,
    //     this.board = [];
    //     board = AppState.board,
    //     currentPlayer = AppState.currentPlayer,
    //     FIRST= {
    //         name: Player.FIRST.name,
    //         points: Player.FIRST.points,
    //         catsOnBoard: Player.FIRST.catsOnBoard,
    //         avaibleCats: Player.FIRST.catsOnBoard
    //     },
    //     SECOND= {
    //         name: Player.SECOND.name,
    //         points: Player.SECOND.points,
    //         catsOnBoard: Player.SECOND.catsOnBoard,
    //         avaibleCats: Player.SECOND.avaibleCats
    //     }
    // }


}

export function saveGame(state) {
    //saveState.init();
    localStorage.setItem('playerStats',JSON.stringify(Player))
    localStorage.setItem('boardStats',JSON.stringify(state))
}