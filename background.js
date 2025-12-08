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
        cube.executeMoves(key);
        console.log(key);

        let cipher = cube.readTextFromCube();
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
                        state: 'get-name'
                    }).then((data) => {
                        browser.tabs.sendMessage(tabs[0].id, {
                            state: 'store-key',
                            keycred: {
                                name:data.name,
                                key,
                                inversekey
                            }
                        })
                    });
                }
            });
        browser.storage.local.get("keycred").then((data)=>{
            console.log(data);
        })
        sendResponse({ key });
    }
    if (message.state == 'key') {
        key = message.key;
        console.log(key);
        inversekey = Rubiks3Cube.generateInverseRandomMoves(message.key);
        console.log(inversekey);
        sendResponse({ message: 'Received' });
    }
    if (message.state === 'decrypt') {
        let cube = new Rubiks3Cube();

        cube.writeTextToCube(message.clientMessage);
        console.log(inversekey);
        cube.executeMoves(inversekey);

        let plain = cube.readTextFromCube();
        sendResponse({ plain });
    }
})