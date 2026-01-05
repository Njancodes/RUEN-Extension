const inputEl = document.getElementById('userInput');
const outputEl = document.getElementById('output');
const runBtn = document.getElementById('runBtn');
const generateBtn = document.getElementById('generateKey');
const decryptBtn = document.getElementById('decrypt');
const clearBtn = document.getElementById('clearBtn');

document.addEventListener('DOMContentLoaded', () => {
  setInterval(async () => {
    const numbers = await browser.storage.local.getKeys();
    for (const number of numbers) {
      if (document.body.querySelector(`li#num${number}`)) {
        continue;
      }
      const nkList = document.getElementById('number-key-list');
      const nkLi = document.createElement('li');
      nkLi.id = "num" + number;
      const key = (await browser.storage.local.get(number))[number].key;
      console.log(key);
      nkLi.innerHTML = `<strong>${number}:</strong> <code>${key}</code>`
      nkList.appendChild(nkLi);
    }

  }, 500);
})

runBtn.onclick = () => {
  if (inputEl.value != '') {
    browser.runtime.sendMessage(
      {
        state: 'key',
        key: inputEl.value
      }
    ).then(({ message }) => {
      console.log(message);
      outputEl.textContent = processInput('Key has been submitted');
    })
  } else {
    outputEl.textContent = processInput('');
  }
};

generateBtn.onclick = () => {

  browser.runtime.sendMessage(
    {
      state: 'gen-key'
    }
  ).then(async (data) => {
    console.log(data);
    outputEl.textContent = "The key is : " + processInput(data.key) + " For the number: " + data.num;
  })
}

decryptBtn.onclick = () => {
  console.log('decrypt button clicked');
  browser.runtime.sendMessage(
    {
      state: 'decrypt-all-messages'
    }
  )
}

clearBtn.onclick = () => {
  inputEl.value = '';
  outputEl.textContent = '—';
  inputEl.focus();
};

function processInput(text) {
  if (!text.trim()) return 'Please enter something.';
  return `${text}`;
}
