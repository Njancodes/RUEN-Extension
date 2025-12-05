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

browser.runtime.onMessage.addListener((message, _, sendResponse) => {
    if (message.state === 'encrypt') {
        console.log('BG RECIEVED');
        let cube = new Rubiks3Cube();

        cube.writeTextToCube(message.clientMessage);
        cube.executeMoves('U R U R');

        let cipher = cube.readTextFromCube();
        sendResponse({cipher});
    }
    if(message.command === 'decrypt-all-messages'){
        browser.tabs.sendMessage(
            currTab.id,
            {
                state: 'decrypt-all',
            });
    }
    if (message.state === 'decrypt') {
        let cube = new Rubiks3Cube();

        cube.writeTextToCube(message.clientMessage);
        cube.executeMoves("R' U' R' U'");

        let plain = cube.readTextFromCube();
        browser.tabs.sendMessage(
            currTab.id,
            {
                state: 'plain-ready',
                plain: plain
            });
    }
})