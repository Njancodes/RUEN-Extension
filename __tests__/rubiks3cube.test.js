import Rubiks3Cube from '../src/RubiksCube.js';

describe('Rubiks3Cube', () => {
    let cube;

    beforeEach(() => {
        cube = new Rubiks3Cube();
    });

    describe('writeTextToCube and readTextFromCube', () => {
        test('should write and read text correctly', () => {
            const text = 'HELLO WORLD!';
            const remaining = cube.writeTextToCube(text);
            const retrieved = cube.readTextFromCube();

            expect(retrieved).toContain('HELLO WORLD!');
            expect(remaining).toBe('');
        });

        test('should handle text longer than 54 characters', () => {
            const text = 'A'.repeat(60);
            const remaining = cube.writeTextToCube(text);

            expect(remaining).toBe('AAAAAA'); // 54 spaces on cube, 6 remaining
            expect(remaining.length).toBe(6);
        });

        test('should fill empty spaces with X', () => {
            const text = 'HI';
            cube.writeTextToCube(text);
            const retrieved = cube.readTextFromCube();

            expect(retrieved).toMatch(/^HI/);
            expect(retrieved.length).toBe(54); // 6 faces * 9 squares
            expect(retrieved.slice(2)).toMatch(/^X+$/); // Rest should be X
        });

        test('should handle empty string', () => {
            const remaining = cube.writeTextToCube('');
            const retrieved = cube.readTextFromCube();

            expect(remaining).toBe('');
            expect(retrieved).toBe('X'.repeat(54));
        });

        test('should handle exactly 54 characters', () => {
            const text = 'A'.repeat(54);
            const remaining = cube.writeTextToCube(text);
            const retrieved = cube.readTextFromCube();

            expect(remaining).toBe('');
            expect(retrieved).toBe(text);
        });
    });

    describe('executeMoves', () => {
        test('should execute R move', () => {
            cube.writeTextToCube('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOP');
            cube.executeMoves('R');
            const result = cube.readTextFromCube();

            // After R move, the cube should be different
            expect(result).not.toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOP');
        });

        test('should execute R followed by R\' to return to original state', () => {
            const original = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOP';
            cube.writeTextToCube(original);

            cube.executeMoves("R R'");
            const result = cube.readTextFromCube();

            expect(result).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOPXX');
        });

        test('should execute L followed by L\' to return to original state', () => {
            const original = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOP';
            cube.writeTextToCube(original);

            cube.executeMoves("L L'");
            const result = cube.readTextFromCube();

            expect(result).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOPXX');
        });

        test('should execute U followed by U\' to return to original state', () => {
            const original = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOP';
            cube.writeTextToCube(original);

            cube.executeMoves("U U'");
            const result = cube.readTextFromCube();

            expect(result).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOPXX');
        });

        test('should execute D followed by D\' to return to original state', () => {
            const original = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOP';
            cube.writeTextToCube(original);

            cube.executeMoves("D D'");
            const result = cube.readTextFromCube();

            expect(result).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOPXX');
        });

        test('should execute F followed by F\' to return to original state', () => {
            const original = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOP';
            cube.writeTextToCube(original);

            cube.executeMoves("F F'");
            const result = cube.readTextFromCube();

            expect(result).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOPXX');
        });

        test('should execute B followed by B\' to return to original state', () => {
            const original = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOP';
            cube.writeTextToCube(original);

            cube.executeMoves("B B'");
            const result = cube.readTextFromCube();

            expect(result).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOPXX');
        });

        test('should execute R four times to return to original state', () => {
            const original = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOP';
            cube.writeTextToCube(original);

            cube.executeMoves('R R R R');
            const result = cube.readTextFromCube();

            expect(result).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOPXX');
        });

        test('should execute multiple moves', () => {
            const original = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOP';
            cube.writeTextToCube(original);

            cube.executeMoves("R U R' U'");
            const result = cube.readTextFromCube();

            expect(result).toBe('C23DEFGHIAKLMNOPQRJX0VWOYZX74SB56U89AB1DEFGHIJKCMNTPXL');
        });

        test('should throw error for unknown move', () => {
            expect(() => {
                cube.executeMoves('X');
            }).toThrow('Unknown move: X');
        });

        test('should handle moves with extra whitespace', () => {
            const original = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOP';
            cube.writeTextToCube(original);

            expect(() => {
                cube.executeMoves('  R   U   ');
            }).not.toThrow();
        });
    });

    describe('generateRandomMoves', () => {
        test('should generate moves of specified length', () => {
            const moves = Rubiks3Cube.generateRandomMoves(10);
            const moveArray = moves.split(' ');

            expect(moveArray.length).toBe(10);
        });

        test('should generate valid moves only', () => {
            const moves = Rubiks3Cube.generateRandomMoves(20);
            const moveArray = moves.split(' ');
            const validMoves = ['R', "R'", 'L', "L'", 'U', "U'", 'D', "D'", 'F', "F'", 'B', "B'"];

            moveArray.forEach(move => {
                expect(validMoves).toContain(move);
            });
        });

        test('should not have consecutive moves on same face', () => {
            const moves = Rubiks3Cube.generateRandomMoves(50);
            const moveArray = moves.split(' ');

            for (let i = 1; i < moveArray.length; i++) {
                const prevBase = moveArray[i - 1][0];
                const currBase = moveArray[i][0];
                expect(currBase).not.toBe(prevBase);
            }
        });

        test('should generate different sequences each time', () => {
            const moves1 = Rubiks3Cube.generateRandomMoves(20);
            const moves2 = Rubiks3Cube.generateRandomMoves(20);

            // Very unlikely to be the same (but technically possible)
            expect(moves1).not.toBe(moves2);
        });

        test('should generate single move', () => {
            const moves = Rubiks3Cube.generateRandomMoves(1);
            const moveArray = moves.split(' ');

            expect(moveArray.length).toBe(1);
        });
    });

    describe('generateInverseRandomMoves', () => {
        test('should invert simple move', () => {
            const inverse = Rubiks3Cube.generateInverseRandomMoves('R');
            expect(inverse).toBe("R'");
        });

        test('should invert prime move', () => {
            const inverse = Rubiks3Cube.generateInverseRandomMoves("R'");
            expect(inverse).toBe('R');
        });

        test('should invert sequence of moves', () => {
            const inverse = Rubiks3Cube.generateInverseRandomMoves("R U F");
            expect(inverse).toBe("F' U' R'");
        });

        test('should invert complex sequence', () => {
            const inverse = Rubiks3Cube.generateInverseRandomMoves("R U' F L' D B'");
            expect(inverse).toBe("B D' L F' U R'");
        });

        test('should be reversible', () => {
            const original = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOP';
            const moves = Rubiks3Cube.generateRandomMoves(10);
            const inverseMoves = Rubiks3Cube.generateInverseRandomMoves(moves);

            cube.writeTextToCube(original);
            cube.executeMoves(moves);
            cube.executeMoves(inverseMoves);
            const result = cube.readTextFromCube();

            expect(result).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOPXX');
        });

        test('should handle single character moves', () => {
            const inverse = Rubiks3Cube.generateInverseRandomMoves("R L U D F B");
            expect(inverse).toBe("B' F' D' U' L' R'");
        });
    });

    describe('encryption/decryption workflow', () => {
        test('should encrypt and decrypt text using random key', () => {
            const plaintext = 'SECRET MESSAGE';
            const key = Rubiks3Cube.generateRandomMoves(15);
            const inverseKey = Rubiks3Cube.generateInverseRandomMoves(key);

            // Encrypt
            const encryptCube = new Rubiks3Cube();
            encryptCube.writeTextToCube(plaintext);
            encryptCube.executeMoves(key);
            const ciphertext = encryptCube.readTextFromCube();

            // Decrypt
            const decryptCube = new Rubiks3Cube();
            decryptCube.writeTextToCube(ciphertext);
            decryptCube.executeMoves(inverseKey);
            const decrypted = decryptCube.readTextFromCube();

            expect(decrypted).toBe(plaintext + 'X'.repeat(54 - plaintext.length));
        });

        test('should produce different ciphertext with different keys', () => {
            const plaintext = 'HELLO';
            const key1 = Rubiks3Cube.generateRandomMoves(10);
            const key2 = Rubiks3Cube.generateRandomMoves(10);

            const cube1 = new Rubiks3Cube();
            cube1.writeTextToCube(plaintext);
            cube1.executeMoves(key1);
            const cipher1 = cube1.readTextFromCube();

            const cube2 = new Rubiks3Cube();
            cube2.writeTextToCube(plaintext);
            cube2.executeMoves(key2);
            const cipher2 = cube2.readTextFromCube();

            expect(cipher1).not.toBe(cipher2);
        });

        test('should handle long messages', () => {
            const plaintext = 'A'.repeat(50);
            const key = Rubiks3Cube.generateRandomMoves(20);
            const inverseKey = Rubiks3Cube.generateInverseRandomMoves(key);

            const encryptCube = new Rubiks3Cube();
            encryptCube.writeTextToCube(plaintext);
            encryptCube.executeMoves(key);
            const ciphertext = encryptCube.readTextFromCube();

            const decryptCube = new Rubiks3Cube();
            decryptCube.writeTextToCube(ciphertext);
            decryptCube.executeMoves(inverseKey);
            const decrypted = decryptCube.readTextFromCube();

            expect(decrypted.slice(0, 50)).toBe(plaintext);
        });
    });

    describe('edge cases', () => {
        test('should handle special characters', () => {
            const text = '!@#$%^&*()';
            cube.writeTextToCube(text);
            const result = cube.readTextFromCube();

            expect(result).toContain(text);
        });

        test('should handle numbers', () => {
            const text = '1234567890';
            cube.writeTextToCube(text);
            const result = cube.readTextFromCube();

            expect(result).toContain(text);
        });

        test('should handle mixed case', () => {
            const text = 'AbCdEfGhIj';
            cube.writeTextToCube(text);
            const result = cube.readTextFromCube();

            expect(result).toContain(text);
        });
    });
});