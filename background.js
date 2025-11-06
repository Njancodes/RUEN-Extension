import Rubiks3Cube from "./src/RubiksCube.js";

console.log("Background Hello")

let currTab = null

function onTabs(currentTab) {
    console.log(currentTab)
}


browser.action.onClicked.addListener((tab) => {
    console.log("Clicked the browser action");
    console.log(tab);
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
        cube.executeMoves(Rubiks3Cube.generateRandomMoves(10));

        let cipher = cube.readTextFromCube();
        browser.tabs.sendMessage(
            currTab.id,
            {
                state: 'cipher-ready',
                cipher: cipher
            });
    }
})