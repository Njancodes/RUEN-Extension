import Rubiks3Cube from "./src/RubiksCube.js";

console.log("The background.js has started...");

async function sendMessageToActiveTab(message) {
    try {
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });

        if (!tabs[0]) {
            throw new Error('No active tab found');
        }

        return await browser.tabs.sendMessage(tabs[0].id, message);
    } catch (err) {
        console.error('Error: ', err);
        throw err;
    }
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.state === 'encrypt') {
        console.log('BG RECIEVED');
        sendResponse({ cipher: encryptMessage(message.clientMessage, message.key) });
    }
    if (message.state === 'decrypt') {
        browser.tabs.query({ active: true, currentWindow: true })
            .then(tabs => {
                if (tabs[0]) {
                    sendResponse({ plain: decryptMessage(message.clientMessage, message.inversekey) });
                }
            });
        return true;
    }
    if (message.state === 'gen-key') {
        const key = Rubiks3Cube.generateRandomMoves(10);
        const inversekey = Rubiks3Cube.generateInverseMoves(key);
        try {
            (async () => {
                const data = await sendMessageToActiveTab({ state: 'get-num' });
                const num = data.num;

                await sendMessageToActiveTab({
                    state: 'store-key',
                    keycred: {
                        num: data.num,
                        key,
                        inversekey
                    }
                })

                sendResponse({ key, num });
            })()
        } catch (error) {
            sendResponse({ error: 'Failed to get num' });
        }
        return true;
    }
    if (message.state == 'submit-key') {
        const key = message.key;
        const inversekey = Rubiks3Cube.generateInverseMoves(message.key);
        try {
            (async () => {
                const data = await sendMessageToActiveTab({ state: 'get-num' });
                const num = data.num;

                await sendMessageToActiveTab({
                    state: 'store-key',
                    keycred: {
                        num: data.num,
                        key,
                        inversekey
                    }
                })

                sendResponse({ key, num });
            })()
        } catch (error) {
            sendResponse({ error: 'Failed to get num' });
        }
        return true;
    }
})

export function encryptMessage(plaintext, key) {
    let ciphertext = "ENC:";
    let j = 0;

    for (let i = 0; i < Math.ceil(plaintext.length / 54); i++) {
        let cube = new Rubiks3Cube();
        cube.writeTextToCube(plaintext.slice(j, j + 54));
        cube.executeMoves(key);
        j += 54;
        ciphertext += cube.readTextFromCube();
    }

    return ciphertext;
}

export function decryptMessage(ciphertext, inversekey) {
    let j = 0;
    let plaintext = "";
    for (let i = 0; i < Math.ceil(ciphertext.length / 54); i++) {
        let cube = new Rubiks3Cube();
        cube.writeTextToCube(ciphertext.slice(j, j + 54));
        cube.executeMoves(inversekey);
        j += 54;
        plaintext += cube.readTextFromCube()
    }
    return plaintext;
}