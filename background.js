import Rubiks3Cube from "./src/RubiksCube.js";

console.log("Background Hello")

let currTab = null
let key = "";
let inversekey = "";

browser.action.onClicked.addListener((tab) => {
    console.log("Clicked the browser action");
    currTab = tab;
    browser.tabs.sendMessage(
        currTab.id,
        {
            state: 'get-message',
        }
    )
})

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
    if (message.state === 'decrypt-all-messages') {
        console.log('BG DAG RECIEVED');
        browser.tabs.query({ active: true, currentWindow: true })
            .then(tabs => {
                if (tabs[0]) {
                    browser.tabs.sendMessage(tabs[0].id, {
                        state: 'decrypt-all'
                    });
                }
            });
    }
    if (message.state === 'gen-key') {
        key = Rubiks3Cube.generateRandomMoves(10);
        inversekey = Rubiks3Cube.generateInverseRandomMoves(key);
        browser.tabs.query({ active: true, currentWindow: true })
            .then(tabs => {
                if (tabs[0]) {
                    browser.tabs.sendMessage(tabs[0].id, {
                        state: 'get-num'
                    }).then(async (data) => {
                        const num = data.num;

                        browser.tabs.sendMessage(tabs[0].id, {
                            state: 'store-key',
                            keycred: {
                                num: data.num,
                                key,
                                inversekey
                            }
                        })

                        sendResponse({ key, num })
                    });
                }
            }).catch(err => {
                console.error('Error: ', err);
                sendResponse({ error: 'Failed to get num' });
            })
        return true;
    }
    if (message.state == 'key') {
        key = message.key;
        console.log(key);
        inversekey = Rubiks3Cube.generateInverseRandomMoves(message.key);
        console.log(inversekey);
        browser.tabs.query({ active: true, currentWindow: true })
            .then(tabs => {
                if (tabs[0]) {
                    browser.tabs.sendMessage(tabs[0].id, {
                        state: 'get-num'
                    }).then(async (data) => {
                        const num = data.num;

                        browser.tabs.sendMessage(tabs[0].id, {
                            state: 'store-key',
                            keycred: {
                                num: data.num,
                                key,
                                inversekey
                            }
                        })

                        sendResponse({ key, num })
                    });
                }
            }).catch(err => {
                console.error('Error: ', err);
                sendResponse({ error: 'Failed to get num' });
            })
        return true;
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
})