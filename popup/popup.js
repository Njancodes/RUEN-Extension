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

      const keyCred = (await browser.storage.local.get(number))[number];

      const key = keyCred.key;
      console.log(key);


      const toggleSwitch = document.createElement("input");
      toggleSwitch.type = "checkbox";
      toggleSwitch.className = "toggle-switch";
      toggleSwitch.addEventListener('change', async function () {
        const li = this.closest('li');

        const strongTag = li.children[1];
        const number = strongTag.textContent.trim();
        const data = await browser.storage.local.get(number);
        const inversekey = data[number].inversekey;
        if (this.checked) {
          const tabs = await browser.tabs.query({ active: true, currentWindow: true })
          if (tabs[0]) {
            browser.tabs.sendMessage(tabs[0].id, {
              state: 'check',
              num: number,
            }).then(async ({isAcc}) => {
              console.log('The value of isAcc is: ', isAcc);
              if (isAcc) {
                console.log('Enabled');
                li.classList.remove("disabled");
                li.classList.add("enabled");
                const error = document.body.getElementsByClassName('error')[0];
                error.textContent = "";
              } else {
                this.checked = false;
                const error = document.body.getElementsByClassName('error')[0];
                error.textContent = "The account you tried to decrypt is not open";
              }
            })
          }
        } else {
          console.log('Disabled');
          li.classList.remove("enabled");
          li.classList.add("disabled");
        }
      })
      const boldNumber = document.createElement("strong");
      boldNumber.textContent = number;
      const codeKey = document.createElement("code");
      codeKey.textContent = key;


      const liTag = document.createElement("li");
      liTag.className = "li-tag";
      liTag.classList.add("disabled");
      liTag.id = "num" + number;
      liTag.appendChild(toggleSwitch);
      liTag.appendChild(boldNumber);
      liTag.appendChild(codeKey);


      nkList.appendChild(liTag);
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
