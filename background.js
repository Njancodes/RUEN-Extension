import Rubiks3Cube from "./src/RubiksCube.js";

console.log("Background Hello")

let currTab = null

function onTabs(currentTab) {
    console.log(currentTab)
}


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

browser.runtime.onMessage.addListener((message) => {
    if (message.state === 'encrypt') {
        let cube = new Rubiks3Cube();

        cube.writeTextToCube(message.clientMessage);
        cube.executeMoves('U R U R');

        let cipher = cube.readTextFromCube();
        browser.tabs.sendMessage(
            currTab.id,
            {
                state: 'cipher-ready',
                cipher: cipher
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