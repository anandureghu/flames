const flameBtn = document.getElementById("flame-btn");
const firstPerson = document.getElementById("firstPerson");
const secondPerson = document.getElementById("secondPerson");

const firstPersonDisplayArea = document.querySelector(
  ".app__display-firstPerson"
);
const secondPersonDisplayArea = document.querySelector(
  ".app__display-secondPerson"
);

let firstPersonValues;
let secondPersonValues;

flameBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  getValues();
  display();
  await match(); // wait for match to complete
  
});

const getValues = () => {
  firstPersonValues = firstPerson.value.split("").map((letter, i) => {
    return {
      letter,
      found: false,
      id: `fp-${letter}-${i}`,
    };
  });

  secondPersonValues = secondPerson.value.split("").map((letter, i) => {
    return {
      letter,
      found: false,
      id: `sp-${letter}-${i}`,
    };
  });
};

const display = () => {
  firstPersonDisplayArea.innerHTML = "";
  secondPersonDisplayArea.innerHTML = "";
  firstPersonValues.forEach((value, i) => {
    firstPersonDisplayArea.innerHTML += `<div class="firstPerson__letter letter" id="${value.id}">${value.letter}</div>`;
  });
  secondPersonValues.forEach((value) => {
    secondPersonDisplayArea.innerHTML += `<div class="secondPerson__letter letter" id="${value.id}">${value.letter}</div>`;
  });
};

const match = async () => {
  const sleepTime = 500;
  for (let idx = 0; idx < firstPersonValues.length; idx++) {
    await sleep(sleepTime);
    let fValue = firstPersonValues[idx];
    const fElement = document.getElementById(fValue.id);
    let found = false;
    fElement.classList.add("current");

    for (let jdx = 0; jdx < secondPersonValues.length; jdx++) {
      let sValue = secondPersonValues[jdx];
      const sElement = document.getElementById(sValue.id);

      if (sValue.found || fValue.found) continue; // already matched skipped
      else sElement.classList.add("current"); // if not matched select as current

      await sleep(sleepTime);

      if (fValue.letter.toLowerCase() === sValue.letter.toLowerCase()) {
        fValue.found = true;
        sValue.found = true;
        fElement.classList.add("found");
        sElement.classList.add("found");
        found = true;
        sElement.classList.remove("current");
        continue;
      }
      sElement.classList.remove("current");
    }

    fElement.classList.remove("current");
    if (found) {
      continue;
    }
  }
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
