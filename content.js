browser.runtime.onMessage.addListener((message) => {
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

        console.log('🚫 Message intercepted!');
        console.log('Message text:', messageText);
        ele.click();
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