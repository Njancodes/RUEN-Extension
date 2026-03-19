import { encryptMessage, decryptMessage } from "../background.js";
import Rubiks3Cube from "../src/RubiksCube.js";

describe('Test and Evaluate the encryption.', () => {
    test('Does decryption give the original string', () => {
        let plaintext = "The quick brown fox jumps over the lazy sleeping dogs.";
        let key = Rubiks3Cube.generateRandomMoves(10);
        let inversekey = Rubiks3Cube.generateInverseMoves(key);
        let ciphertext = encryptMessage(plaintext, key);

        expect(decryptMessage(ciphertext.slice(4), inversekey)).toBe(plaintext);
    })
    test('Evaluate the time for encryption and decryption of small sentences (<= 1000 characters)', () => {
        const data = 'N'.repeat(1026);
        const key = Rubiks3Cube.generateRandomMoves(10);
        const inversekey = Rubiks3Cube.generateInverseMoves(key);

        const startEncrypt = performance.now();
        const encrypted = encryptMessage(data, key);
        const endEncrypt = performance.now();

        const startDecrypt = performance.now();
        const decrypted = decryptMessage(encrypted.slice(4), inversekey);
        const endDecrypt = performance.now();

        console.log(`Encryption: ${(endEncrypt - startEncrypt).toFixed(2)}ms`);
        console.log(`Decryption: ${(endDecrypt - startDecrypt).toFixed(2)}ms`);

        expect(decrypted).toBe(data);
        expect(endEncrypt - startEncrypt).toBeLessThan(1000); // Should be under 1 second

    })
})