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
        let cube = new Rubiks3Cube();
        cube.writeTextToCube(message.clientMessage);
        cube.executeMoves(message.key);

        let cipher = "ENC:" + cube.readTextFromCube();
        console.log(cipher);
        sendResponse({ cipher });
    }
    if (message.state === 'decrypt') {
        let cube = new Rubiks3Cube();
        browser.tabs.query({ active: true, currentWindow: true })
            .then(tabs => {
                if (tabs[0]) {
                    cube.writeTextToCube(message.clientMessage);
                    cube.executeMoves(message.inversekey);

                    let plain = cube.readTextFromCube();
                    sendResponse({ plain });
                }
            });
        return true;
    }
    if (message.state === 'gen-key') {
        const key = Rubiks3Cube.generateRandomMoves(10);
        const inversekey = Rubiks3Cube.generateInverseRandomMoves(key);
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
        const inversekey = Rubiks3Cube.generateInverseRandomMoves(message.key);
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