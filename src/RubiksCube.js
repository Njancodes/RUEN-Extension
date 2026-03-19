import { matrix, clone, pickRandom } from "mathjs";

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

    constructor() {
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
            this.#back.set([i, 2], cup.get([i, 0]));
        }
        for (let i = 0; i < 3; i++) {
            this.#down.set([i, 0], cback.get([i, 2]));
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

    static generateInverseMoves(key) {
        const moves = key.match(/[A-Z]'?/g);
        const inverseMoves = [];
        moves.forEach((move) => {
            let inverseMove = "";
            if (move[move.length - 1] == "'") {
                inverseMove = move[0];

            } else {
                inverseMove = move[0] + "'";
            }
            inverseMoves.push(inverseMove);
        });
        return inverseMoves.reverse().join(' ');
    }

    static generateRandomMoves(length) {
        let moves = []
        let validMoves = ['R', 'L', 'U', 'D', 'F', 'B']
        let modifiers = ['', "'"]
        let previousMove = null;

        let randomMove = pickRandom(validMoves);
        let randomModifier = pickRandom(modifiers);
        let currentMove = randomMove + randomModifier;

        moves.push(currentMove);
        previousMove = currentMove;

        for (let i = 0; i < length - 1; i++) {
            do {
                randomMove = pickRandom(validMoves);
                randomModifier = pickRandom(modifiers);
                currentMove = randomMove + randomModifier;
            } while (this.#conflictsWithPreviousMove(currentMove, previousMove));

            moves.push(currentMove);
            previousMove = moves[moves.length - 1];
        }

        return moves.join(' ');
    }

    static #conflictsWithPreviousMove(curr, prev) {

        if (curr == null || prev == null) {
            return true;
        }

        let currBase = curr[0];
        let prevBase = prev[0];

        if (currBase === prevBase) {
            return true;
        }

        return false;
    }
}

// let plaintext = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce a odio quis nibh finibus sagittis ut vel libero. In felis diam, luctus vitae justo a, lobortis pretium dui. Curabitur ultrices erat ut semper accumsan. Fusce sodales, elit vel vehicula vehicula, augue lectus blandit ante, eget mattis magna urna vel dolor. Donec at turpis condimentum, hendrerit massa quis, tincidunt nibh. Nullam fringilla non mi in posuere. Aenean mattis nec dui eu volutpat. Vivamus sagittis diam in viverra commodo. Curabitur vehicula, lacus sed scelerisque hendrerit, lectus nunc consectetur nisi, sit amet gravida mi magna nec justo. Aliquam accumsan, erat sit amet pharetra pretium, lacus est fringilla nisl, eu sollicitudin libero dui sit amet leo. Phasellus nisi justo, auctor a eros in, accumsan rutrum nisl. Vivamus gravida at quam nec hendrerit.

// Morbi dui felis, convallis vitae luctus non, finibus viverra arcu. Vestibulum eget libero tincidunt, venenatis quam quis, placerat ex. Cras fringilla sit amet purus sed tempor. Phasellus vitae iaculis sapien. Sed ut ligula nec odio imperdiet facilisis in ut elit. Nunc bibendum, dolor non sollicitudin dictum, massa tortor iaculis mauris, sit amet tristique lorem eros a risus. Maecenas ac mattis enim. In augue massa, vulputate vel mauris sit amet, suscipit commodo sapien. Donec tempus ex sit amet tempor interdum. Duis posuere, metus ut rhoncus ornare, urna massa blandit leo, vel aliquam mi risus eget dolor. Maecenas semper, ligula sed scelerisque aliquam, augue ipsum rutrum lorem, vitae consectetur massa velit vulputate nibh. Curabitur fringilla tincidunt venenatis. Curabitur dolor dolor, eleifend nec ipsum eget, posuere tincidunt dolor. Nulla sed dui id sem suscipit sodales. Ut congue pulvinar metus vitae vulputate. Fusce semper a nunc quis malesuada.

// Vivamus posuere, nunc egestas tincidunt sodales, tellus ante posuere risus, eu fermentum augue quam vel mi. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque efficitur risus urna, quis blandit tortor consectetur at. Pellentesque sollicitudin interdum ex, eget accumsan purus molestie sed. Vivamus sit amet consectetur lorem. Pellentesque luctus, est non pellentesque eleifend, dolor velit imperdiet felis, et blandit risus enim eget tortor. Suspendisse tincidunt at neque a commodo. Ut lobortis est a mi vulputate molestie. Donec vel risus facilisis, tempor odio at, posuere metus. Fusce quis justo ac tortor vulputate facilisis quis sit amet elit. Duis cursus sed quam non vestibulum. Integer dignissim sollicitudin mi ut interdum. `
// let ciphertext = ''


// let j = 0
// console.log(Math.ceil(plaintext.length / 54))
// console.time('encrypt');
// for (let i = 0; i < Math.ceil(plaintext.length / 54); i++) {
//     let cube = new Rubiks3Cube();
//     cube.writeTextToCube(plaintext.slice(j, j + 54));
//     cube.executeMoves('R L D U')
//     j += 54;
//     ciphertext += cube.readTextFromCube();
// }
// console.timeEnd('encrypt');

// j = 0;
// console.time('decrypt');
// for (let i = 0; i < Math.ceil(plaintext.length / 54); i++) {
//     let cube = new Rubiks3Cube();
//     cube.writeTextToCube(ciphertext.slice(j, j + 54));
//     cube.executeMoves("U' D' L' R'");
//     j += 54;
//     console.log(cube.readTextFromCube());
// }
// console.timeEnd('decrypt');
export default Rubiks3Cube;