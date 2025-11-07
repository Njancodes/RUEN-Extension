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