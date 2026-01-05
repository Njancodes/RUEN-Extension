browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.state === 'get-message') {
        const inputMessage = document.querySelectorAll('span.xkrh14z')[0].childNodes[0];
        const chatMessages = document.querySelectorAll('span._ao3e.selectable-text.copyable-text');

        let plain = inputMessage.textContent;
        //Assume the text is encrypted
        let cipher = chatMessages[chatMessages.length - 1].textContent;
        browser.runtime.sendMessage({
            state: 'encrypt',
            clientMessage: plain
        })
        browser.runtime.sendMessage({
            state: 'decrypt',
            clientMessage: cipher
        })
    }
    if (message.state === 'decrypt-all') {
        console.log('CS DA RECIEVED');
        const chatMessages = document.querySelectorAll('span._ao3e.selectable-text.copyable-text');
        chatMessages.forEach((chatMessage) => {
            let cipher = chatMessage.textContent;
            browser.runtime.sendMessage({
                state: 'decrypt',
                clientMessage: cipher
            }).then((data) => {
                console.log(data.plain);
                chatMessage.textContent = data.plain;
            })
        })
    }
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
            sendResponse({keys:"Nelson"})
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
        // browser.storage.local.getKeys().then((data) => {
        //     console.log(data);
        // });
        // browser.storage.local.get(message.keycred.num).then((data) => {
        //     console.log("This is the data");
        //     console.log(data);
        // }).catch((err) => {
        //     console.log(err.message);
        // })
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
            callback(element);
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
    console.log("Got the button ");
    console.log(ele);
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

    overlayButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Get the message text from WhatsApp's input
        const messageInput = document.querySelector('div[contenteditable="true"][data-tab="10"]');
        const messageText = messageInput?.textContent || '';

        browser.runtime.sendMessage({
            state: 'encrypt',
            clientMessage: messageText
        }).then((data) => {
            console.log(data);
            const inputMessage = document.querySelectorAll('span.xkrh14z')[0].childNodes[0];
            inputMessage.data = data.cipher;
            setTimeout(() => {
                ele.click();
            }, 0);
        })

        console.log('🚫 Message intercepted!');
        console.log('Message text:', messageText);

    });

    parent.appendChild(overlayButton);

    console.log('✅ Overlay button created in parent element!');


});

browser.runtime.onMessage.addListener((message) => {
    console.log(message)
    if (message.state === 'cipher-ready') {
        const inputMessage = document.querySelectorAll('span.xkrh14z')[0].childNodes[0];
        // let cipher = btoa(plain);
        inputMessage.data = message.cipher;
    }
    if (message.state === 'plain-ready') {
        const chatMessages = document.querySelectorAll('span._ao3e.selectable-text.copyable-text');
        console.log(message.plain);
        chatMessages[chatMessages.length - 1].textContent = message.plain;

    }
})