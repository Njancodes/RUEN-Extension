const inputEl = document.getElementById('userInput');
const outputEl = document.getElementById('output');
const runBtn = document.getElementById('runBtn');
const generateBtn = document.getElementById('generateKey');
const decryptBtn = document.getElementById('decrypt');
const clearBtn = document.getElementById('clearBtn');

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

generateBtn.onclick =  () => {

  browser.runtime.sendMessage(
    {
      state: 'gen-key'
    }
  ).then(async (data) => {
    console.log(data);
    const nkList = document.getElementById('number-key-list');
    const nkLi = document.createElement('li');
    nkLi.textContent = `${data.num}:${data.key}`;
    nkList.appendChild(nkLi);
    outputEl.textContent = "The key is : " + processInput(data.key) + " For the number: ";
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
