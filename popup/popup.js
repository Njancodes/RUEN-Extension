const inputEl = document.getElementById('userInput');
const outputEl = document.getElementById('output');
const runBtn = document.getElementById('runBtn');
const generateBtn = document.getElementById('generateKey');
const decryptBtn = document.getElementById('decrypt');
const clearBtn = document.getElementById('clearBtn');

runBtn.onclick = () => {
  if (inputEl.value != '') {
    outputEl.textContent = processInput('Key has been submitted');
  } else {
    outputEl.textContent = processInput('');
  }
};

generateBtn.onclick = () => {
  outputEl.textContent = processInput('Some Random Key Here');

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
