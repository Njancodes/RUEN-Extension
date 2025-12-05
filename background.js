import Rubiks3Cube from "./src/RubiksCube.js";

console.log("Background Hello")

let currTab = null

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
        cube.executeMoves('U R U R');

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
    if (message.state === 'decrypt') {
        let cube = new Rubiks3Cube();

        cube.writeTextToCube(message.clientMessage);
        cube.executeMoves("R' U' R' U'");

        let plain = cube.readTextFromCube();
        sendResponse({plain});
    }
})