const inputEl = document.getElementById('userInput');
const outputEl = document.getElementById('output');
const runBtn = document.getElementById('runBtn');
const generateBtn = document.getElementById('generateKey');
const decryptBtn = document.getElementById('decrypt');
const clearBtn = document.getElementById('clearBtn');

const createID = (name) => name.toLowerCase().replace(/\s+/g, '-');

document.addEventListener('DOMContentLoaded', () => {
  setInterval(async () => {
    const names = await browser.storage.local.getKeys();
    console.log(document.body.querySelector(`li`));
    for (const name of names) {
      if (document.body.querySelector(`li#${createID(name)}`)) {
        continue;
      }
      const nkList = document.getElementById('number-key-list');

      const keyCred = (await browser.storage.local.get(name))[name];
      console.log("keyCred", keyCred);
      const key = keyCred.key;

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
              inversekey
            }).then(async ({ isAcc }) => {
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
      boldNumber.textContent = name;
      const codeKey = document.createElement("code");
      codeKey.textContent = key;


      const liTag = document.createElement("li");
      liTag.className = "li-tag";
      liTag.classList.add("disabled");
      liTag.id = createID(name);
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
        state: 'submit-key',
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
    outputEl.textContent = "The key is : " + processInput(data.key) + " For the name: " + data.name;
  })
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
