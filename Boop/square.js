export const Cats = {
    EMPTY : 1,
    ORANGE_KITTEN: 2,
    GREY_KITTEN: 4,
    ORANGE_CAT: 8,
    GREY_CAT: 16
}


export class Square {
    isOccupied = false;
    neighbourCount = 0;
    catType = Cats.EMPTY;
    coords = {
        x : 0,
        y : 0,
    };
    convertToImg() {
        if (this.catType == Cats.EMPTY) {
            return ' ';
        }
        return this.catType === Cats.ORANGE_KITTEN ? `<img width=45px height=45px src="media/orange_cat.png"/>` : `<img width=45px height=45px src="media/grey_cat.png"/>`;

    };   
}