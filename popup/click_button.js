document.querySelector('button').addEventListener('click',async ()=>{
    browser.tabs.sendMessage(
        tabs[0],
        {
            command:'hello'
        }
    ).then((response) => {
        console.log("Message from the content script:");
        console.log(response.response);
      })
      .catch((err)=>{
        console.error(err);
      });
})