browser.runtime.onMessage.addListener((message) => {
    if (message.state === 'get-message') {
        const inputMessage = document.querySelectorAll('span.xkrh14z')[0].childNodes[0];
        let plain = inputMessage.textContent;
        browser.runtime.sendMessage({
            state: 'encrypt',
            clientMessage: plain
        })
        // let cipher = btoa(plain);
        // inputMessage.data = cipher;
    }
})

browser.runtime.onMessage.addListener((message)=>{
    if(message.state==='cipher-ready'){
        const inputMessage = document.querySelectorAll('span.xkrh14z')[0].childNodes[0];
        // let cipher = btoa(plain);
        inputMessage.data = message.cipher;
    }
})