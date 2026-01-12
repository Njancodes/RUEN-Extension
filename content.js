const processedMessages = new WeakSet();

async function sendRuntimeMessage(message) {
    try {
        return await browser.runtime.sendMessage(message);
    } catch (err) {
        console.error('Runtime message error:', err);
        throw err;
    }
}

function isEncryptedMessage(chatMessage) {
    return chatMessage.textContent.startsWith('ENC:');
}

async function decryptMessage(chatMessage, inversekey) {
    try {
        const cipher = chatMessage.textContent.slice(4); // Remove 'ENC:' prefix

        const data = await sendRuntimeMessage({
            state: 'decrypt',
            clientMessage: cipher,
            inversekey
        });

        chatMessage.textContent = data.plain;
    } catch (err) {
        console.error('Failed to decrypt message:', err);
    }
}

async function decryptChatMessages(inversekey) {
    const chatMessages = document.querySelectorAll(
        '#main [data-scrolltracepolicy="wa.web.conversation.messages"] [data-testid="selectable-text"]'
    );

    const decryptPromises = Array.from(chatMessages)
        .filter(isEncryptedMessage)
        .map(chatMessage => decryptMessage(chatMessage, inversekey));

    await Promise.all(decryptPromises);
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.state === 'get-num') {
        console.log('GET NUM EVENT RECIEVED');
        const elementsWithDataId = document.body.querySelectorAll('[data-id]');
        let num;
        if (elementsWithDataId.length > 0) {
            num = elementsWithDataId[0].getAttribute('data-id').match(/_(\d+)/);
        }
        sendResponse({ num: num[1] });
    }
    if (message.state === 'get-key') {
        const elementsWithDataId = document.body.querySelectorAll('[data-id]');
        let num;
        if (elementsWithDataId.length > 0) {
            num = elementsWithDataId[0].getAttribute('data-id').match(/_(\d+)/);
        }

        console.log(num[1]);
        browser.storage.local.get(num).then((data) => {
            console.log("This is the data");
            console.log(Object.values(data));
            sendResponse({ keys: "Nelson" })
        }).catch((err) => {
            console.log(err.message);
        })
    }
    if (message.state === 'store-key') {
        console.log("KEY RECIEVED");
        browser.storage.local.set({
            [message.keycred.num]: {
                key: message.keycred.key,
                inversekey: message.keycred.inversekey
            },
        })
    }
    //Check is misleading
    //It checks and also decrypts the chat messages
    if (message.state === "check") {
        console.log('Checked if the acc');

        const elementsWithDataId = document.body.querySelectorAll('[data-id]');
        let isAcc = false;
        if (elementsWithDataId.length > 0) {
            let num = elementsWithDataId[0].getAttribute('data-id').match(/_(\d+)/);
            if (message.num === num[1]) {
                isAcc = true
            }
        }

        if (isAcc) {
            // Wrap the observer setup in an async function
            (async () => {
                let inversekey = message.inversekey;
                await decryptChatMessages(inversekey);
                sendResponse({ isAcc });
            })();
            return true; // Keep the message channel open for async sendResponse
        } else {
            sendResponse({ isAcc });
        }

    }
})

// Source - https://stackoverflow.com/a/61511955
// Posted by Yong Wang, modified by community. See post 'Timeline' for change history
// Retrieved 2025-12-02, License - CC BY-SA 4.0

function waitForElm(selector, callback) {

    const existing = document.querySelector(selector);
    if (existing) {
        callback(existing);
    }

    let lastSeen = existing !== null;

    if (document.querySelector(selector)) {
        return callback(document.querySelector(selector));
    }

    const observer = new MutationObserver(mutations => {
        const element = document.querySelector(selector);
        const exists = element !== null;

        // Only fire when it goes from NOT existing -> existing
        if (exists && !lastSeen) {
            callback(element, mutations);
        }

        lastSeen = exists; // ← YOU FORGOT THIS!
    });

    // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

waitForElm('button[aria-label="Send"]', (ele) => {
    const parent = ele.parentElement;

    let overlayButton = document.createElement('button');
    overlayButton.textContent = ''; // Empty text to be invisible
    overlayButton.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    background-color: rgba(255, 0, 0, 0.3);
    border: 2px solid red;
    cursor: pointer;
  `;

    const parentStyle = window.getComputedStyle(parent);
    if (parentStyle.position === 'static') {
        parent.style.position = 'relative';
    }

    overlayButton.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();


        // Get the message text from WhatsApp's input
        const messageInput = document.querySelector('div[contenteditable="true"][data-tab="10"]');
        const messageText = messageInput?.textContent || '';
        const elementsWithDataId = document.body.querySelectorAll('[data-id]');
        let num;
        if (elementsWithDataId.length > 0) {
            num = elementsWithDataId[0].getAttribute('data-id').match(/_(\d+)/);
        }
        const keyData = await browser.storage.local.get(num);
        const key = Object.values(keyData)[0].key;
        browser.runtime.sendMessage({
            state: 'encrypt',
            clientMessage: messageText,
            key
        }).then((data) => {
            const inputMessage = document.querySelectorAll('span.xkrh14z')[0].childNodes[0];
            inputMessage.data = data.cipher;
            setTimeout(async () => {
                ele.click();
            }, 0);
        })

        setTimeout(async () => {
            const keyCred = await browser.storage.local.get(num[1]);
            let inversekey = keyCred[num[1]].inversekey;
            await decryptChatMessages(inversekey);
        }, 1000)
    });

    parent.appendChild(overlayButton);
});