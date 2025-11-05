import { matrix, clone, index } from "mathjs";
//Utilty func
function create3Matrix(def_value) {
    return matrix([[def_value, def_value, def_value], [def_value, def_value, def_value], [def_value, def_value, def_value]])
}

class Rubiks3Cube {

    #front;
    #back;

    #left;
    #right;

    #up;
    #down;

    constructor(text) {
        this.#back = create3Matrix('X');
        this.#front = create3Matrix('X');
        this.#up = create3Matrix('X');
        this.#down = create3Matrix('X');
        this.#left = create3Matrix('X');
        this.#right = create3Matrix('X');

    }


    writeTextToCube(text) {
        let textp = 0;

        //Maybe decrease this to a single function with a loop
        textp = this.#mapTextToFace(text, this.#back, textp);
        textp = this.#mapTextToFace(text, this.#left, textp);
        textp = this.#mapTextToFace(text, this.#up, textp);
        textp = this.#mapTextToFace(text, this.#right, textp);
        textp = this.#mapTextToFace(text, this.#down, textp);
        textp = this.#mapTextToFace(text, this.#front, textp);

        return text.slice(textp);
    }

    readTextFromCube() {
        let text = '';


        text += this.#extractTextFromFace(this.#back);
        text += this.#extractTextFromFace(this.#left);
        text += this.#extractTextFromFace(this.#up);
        text += this.#extractTextFromFace(this.#right);
        text += this.#extractTextFromFace(this.#down);
        text += this.#extractTextFromFace(this.#front);


        return text;
    }

    #mapTextToFace(text, cubletMatrix, textp) {
        for (let i = 0; i < cubletMatrix.size()[0]; i++) {
            for (let j = 0; j < cubletMatrix.size()[1]; j++) {
                //Remember to turn it into character code
                cubletMatrix.set([i, j], text[textp] ? text[textp++] : 'X');
            }
        }
        return textp;
    }

    #extractTextFromFace(cubletMatrix, textp) {

        let text = '';

        for (let i = 0; i < cubletMatrix.size()[0]; i++) {
            for (let j = 0; j < cubletMatrix.size()[1]; j++) {
                //Remember to turn it into character code
                text += cubletMatrix.get([i, j]);
            }
        }

        return text;
    }

    #displayLTRBFaces() {
        let leftArray = this.#left.valueOf();
        let topArray = this.#up.valueOf();
        let rightArray = this.#right.valueOf();
        let bottomArray = this.#down.valueOf();

        let maxNoOfRows = leftArray.length
        let maxRowLength = leftArray[0].length


        for (let i = 0; i < maxNoOfRows; i++) {
            let outputRow = '';
            for (let j = 0; j < maxRowLength; j++) {
                if (j === 0) {
                    outputRow += `\x1b[32m${leftArray[i][j]}\x1b[0m`;
                } else {
                    outputRow += ` \x1b[32m${leftArray[i][j]}\x1b[0m`;
                }
            }
            outputRow += ' ';
            for (let j = 0; j < maxRowLength; j++) {
                if (j === 0) {
                    outputRow += `\x1b[34m${topArray[i][j]}\x1b[0m`;
                } else {
                    outputRow += ` \x1b[34m${topArray[i][j]}\x1b[0m`;
                }
            }
            outputRow += ' ';
            for (let j = 0; j < maxRowLength; j++) {
                if (j === 0) {
                    outputRow += `\x1b[42m${rightArray[i][j]}\x1b[0m`;
                } else {
                    outputRow += ` \x1b[42m${rightArray[i][j]}\x1b[0m`;
                }
            }
            outputRow += ' ';
            for (let j = 0; j < maxRowLength; j++) {
                if (j === 0) {
                    outputRow += `\x1b[44m${bottomArray[i][j]}\x1b[0m`;
                } else {
                    outputRow += ` \x1b[44m${bottomArray[i][j]}\x1b[0m`;
                }
            }
            console.log(outputRow);
        }
    }

    displayRubikcube() {
        let backArray = this.#back.valueOf();
        let frontArray = this.#front.valueOf();

        for (let i = 0; i < backArray.length; i++) {
            process.stdout.write('      ');
            for (let j = 0; j < backArray[0].length; j++) {
                if (j === 0) {
                    process.stdout.write(`\x1b[90m\x1b[41m${backArray[i][j]}\x1b[0m`);
                } else {
                    process.stdout.write(` \x1b[41m${backArray[i][j]}\x1b[0m`);
                }
            }
            process.stdout.write('\n');
        }
        this.#displayLTRBFaces();
        for (let i = 0; i < frontArray.length; i++) {
            process.stdout.write('      ');
            for (let j = 0; j < frontArray[0].length; j++) {
                if (j === 0) {
                    process.stdout.write(`\x1b[31m${frontArray[i][j]}\x1b[0m`);
                } else {
                    process.stdout.write(` \x1b[31m${frontArray[i][j]}\x1b[0m`);
                }
            }
            process.stdout.write('\n');
        }

    }

    #rotateFaceClockwise(face) {
        let cpface = clone(face)

        for (let i = 0; i < face.size()[0]; i++) {
            face.set([i, 2], cpface.get([0, i]));
            face.set([i, 1], cpface.get([1, i]));
            face.set([i, 0], cpface.get([2, i]));
        }

    }

    #rotateFaceAntiClockwise(face) {

        let cpface = clone(face)

        for (let i = 0; i < face.size()[0]; i++) {
            face.set([2, i], cpface.get([i, 0]));
            face.set([1, i], cpface.get([i, 1]));
            face.set([0, i], cpface.get([i, 2]));
        }

    }

    #moveR() {
        this.#rotateFaceClockwise(this.#right);

        let cback = clone(this.#back);
        let cdown = clone(this.#down);
        let cup = clone(this.#up);
        let cfront = clone(this.#front);

        for (let i = 0; i < 3; i++) {
            this.#back.set([i, 0], cup.get([i, 2]));
        }
        for (let i = 0; i < 3; i++) {
            this.#down.set([i, 2], cback.get([i, 0]));
        }
        for (let i = 0; i < 3; i++) {
            this.#front.set([i, 2], cdown.get([i, 2]));
        }
        for (let i = 0; i < 3; i++) {
            this.#up.set([i, 2], cfront.get([i, 2]));
        }
    }

    #moveRPrime() {
        this.#rotateFaceAntiClockwise(this.#right);

        let cback = clone(this.#back);
        let cdown = clone(this.#down);
        let cup = clone(this.#up);
        let cfront = clone(this.#front);

        for (let i = 0; i < 3; i++) {
            this.#front.set([i, 2], cup.get([i, 2]));
        }
        for (let i = 0; i < 3; i++) {
            this.#down.set([i, 2], cfront.get([i, 2]));
        }
        for (let i = 0; i < 3; i++) {
            this.#back.set([i, 0], cdown.get([i, 2]));
        }
        for (let i = 0; i < 3; i++) {
            this.#up.set([i, 2], cback.get([i, 0]));
        }
    }

    #moveL() {
        this.#rotateFaceClockwise(this.#left);

        let cback = clone(this.#back);
        let cdown = clone(this.#down);
        let cup = clone(this.#up);
        let cfront = clone(this.#front);

        for (let i = 0; i < 3; i++) {
            this.#front.set([i, 0], cup.get([i, 0]));
        }
        for (let i = 0; i < 3; i++) {
            this.#down.set([i, 0], cfront.get([i, 0]));
        }
        for (let i = 0; i < 3; i++) {
            this.#back.set([i, 2], cdown.get([i, 0]));
        }
        for (let i = 0; i < 3; i++) {
            this.#up.set([i, 0], cback.get([i, 2]));
        }
    }

    #moveLPrime() {
        this.#rotateFaceAntiClockwise(this.#left);

        let cback = clone(this.#back);
        let cdown = clone(this.#down);
        let cup = clone(this.#up);
        let cfront = clone(this.#front);

        for (let i = 0; i < 3; i++) {
            this.#back.set([i, 0], cup.get([i, 0]));
        }
        for (let i = 0; i < 3; i++) {
            this.#down.set([i, 0], cback.get([i, 0]));
        }
        for (let i = 0; i < 3; i++) {
            this.#front.set([i, 0], cdown.get([i, 0]));
        }
        for (let i = 0; i < 3; i++) {
            this.#up.set([i, 0], cfront.get([i, 0]));
        }
    }


    #moveD() {
        this.#rotateFaceClockwise(this.#down)

        let cback = clone(this.#back);
        let cright = clone(this.#right);
        let cleft = clone(this.#left);
        let cfront = clone(this.#front);

        for (let i = 0; i < 3; i++) {
            this.#left.set([2, i], cback.get([2, i]));
        }
        for (let i = 0; i < 3; i++) {
            this.#front.set([2, i], cleft.get([2, i]));
        }
        for (let i = 0; i < 3; i++) {
            this.#right.set([2, i], cfront.get([2, i]));
        }
        for (let i = 0; i < 3; i++) {
            this.#back.set([2, i], cright.get([2, i]));
        }
    }

    #moveDPrime() {
        this.#rotateFaceAntiClockwise(this.#down);


        let cback = clone(this.#back);
        let cright = clone(this.#right);
        let cleft = clone(this.#left);
        let cfront = clone(this.#front);

        for (let i = 0; i < 3; i++) {
            this.#right.set([2, i], cback.get([2, i]));
        }
        for (let i = 0; i < 3; i++) {
            this.#front.set([2, i], cright.get([2, i]));
        }
        for (let i = 0; i < 3; i++) {
            this.#left.set([2, i], cfront.get([2, i]));
        }
        for (let i = 0; i < 3; i++) {
            this.#back.set([2, i], cleft.get([2, i]));
        }
    }


    #moveU() {
        this.#rotateFaceClockwise(this.#up);

        let cback = clone(this.#back);
        let cright = clone(this.#right);
        let cleft = clone(this.#left);
        let cfront = clone(this.#front);


        for (let i = 0; i < 3; i++) {
            this.#right.set([0, i], cback.get([0, i]));
        }
        for (let i = 0; i < 3; i++) {
            this.#front.set([0, i], cright.get([0, i]));
        }
        for (let i = 0; i < 3; i++) {
            this.#left.set([0, i], cfront.get([0, i]));
        }
        for (let i = 0; i < 3; i++) {
            this.#back.set([0, i], cleft.get([0, i]));
        }
    }

    #moveUPrime() {
        this.#rotateFaceAntiClockwise(this.#up);

        let cback = clone(this.#back);
        let cright = clone(this.#right);
        let cleft = clone(this.#left);
        let cfront = clone(this.#front);


        for (let i = 0; i < 3; i++) {
            this.#left.set([0, i], cback.get([0, i]));
        }
        for (let i = 0; i < 3; i++) {
            this.#front.set([0, i], cleft.get([0, i]));
        }
        for (let i = 0; i < 3; i++) {
            this.#right.set([0, i], cfront.get([0, i]));
        }
        for (let i = 0; i < 3; i++) {
            this.#back.set([0, i], cright.get([0, i]));
        }
    }

    #moveB() {
        this.#rotateFaceClockwise(this.#back)

        let cright = clone(this.#right);
        let cup = clone(this.#up);
        let cleft = clone(this.#left);
        let cdown = clone(this.#down);


        for (let i = 0; i < 3; i++) {
            this.#left.set([0, i], cup.get([0, i]));
        }
        for (let i = 0; i < 3; i++) {
            this.#down.set([0, i], cleft.get([0, i]));
        }
        for (let i = 0; i < 3; i++) {
            this.#right.set([0, i], cdown.get([0, i]));
        }
        for (let i = 0; i < 3; i++) {
            this.#up.set([0, i], cright.get([0, i]));
        }
    }

    #moveBPrime() {
        this.#rotateFaceAntiClockwise(this.#back);

        let cright = clone(this.#right);
        let cup = clone(this.#up);
        let cleft = clone(this.#left);
        let cdown = clone(this.#down);

        for (let i = 0; i < 3; i++) {
            this.#right.set([0, i], cup.get([0, i]));
        }
        for (let i = 0; i < 3; i++) {
            this.#down.set([0, i], cright.get([0, i]));
        }
        for (let i = 0; i < 3; i++) {
            this.#left.set([0, i], cdown.get([0, i]));
        }
        for (let i = 0; i < 3; i++) {
            this.#up.set([0, i], cleft.get([0, i]));
        }
    }


    #moveF() {
        this.#rotateFaceClockwise(this.#front)

        let cright = clone(this.#right);
        let cup = clone(this.#up);
        let cleft = clone(this.#left);
        let cdown = clone(this.#down);


        for (let i = 0; i < 3; i++) {
            this.#right.set([i, 2], cup.get([i, 2]));
        }
        for (let i = 0; i < 3; i++) {
            this.#down.set([i, 2], cright.get([i, 2]));
        }
        for (let i = 0; i < 3; i++) {
            this.#left.set([i, 2], cdown.get([i, 2]));
        }
        for (let i = 0; i < 3; i++) {
            this.#up.set([i, 2], cleft.get([i, 2]));
        }
    }

    #moveFPrime() {
        this.#rotateFaceAntiClockwise(this.#front);

        let cright = clone(this.#right);
        let cup = clone(this.#up);
        let cleft = clone(this.#left);
        let cdown = clone(this.#down);

        for (let i = 0; i < 3; i++) {
            this.#left.set([i, 2], cup.get([i, 2]));
        }
        for (let i = 0; i < 3; i++) {
            this.#down.set([i, 2], cleft.get([i, 2]));
        }
        for (let i = 0; i < 3; i++) {
            this.#right.set([i, 2], cdown.get([i, 2]));
        }
        for (let i = 0; i < 3; i++) {
            this.#up.set([i, 2], cright.get([i, 2]));
        }
    }

    executeMoves(notation) {
        const moves = notation.trim().split(/\s+/);
        for (const move of moves) {
            switch (move) {
                case 'R': this.#moveR(); break;
                case "R'": this.#moveRPrime(); break;
                case 'L': this.#moveL(); break;
                case "L'": this.#moveLPrime(); break;
                case 'U': this.#moveU(); break;
                case "U'": this.#moveUPrime(); break;
                case 'D': this.#moveD(); break;
                case "D'": this.#moveDPrime(); break;
                case 'F': this.#moveF(); break;
                case "F'": this.#moveFPrime(); break;
                case 'B': this.#moveB(); break;
                case "B'": this.#moveBPrime(); break;
                // ... etc
                default: throw new Error(`Unknown move: ${move}`);
            }
        }
    }
}



const cube = new Rubiks3Cube();


cube.writeTextToCube('This is placeholder text for your design or layout.');

cube.displayRubikcube();

cube.executeMoves("U U'")

console.log(cube.readTextFromCube())

cube.displayRubikcube();