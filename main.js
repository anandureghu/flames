const flameBtn = document.getElementById("flame-btn");
const firstPerson = document.getElementById("firstPerson");
const secondPerson = document.getElementById("secondPerson");

const flamesContainer = document.querySelector(".app__flames")
const resultContainer = document.querySelector(".result")

const sleepTime = 300;

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

  const flameNumber = getFlamesNumber()
  await flameIt(flameNumber)
});

firstPerson.addEventListener("change",()=>{
  clear()
})


secondPerson.addEventListener("change",()=>{
  clear()
})

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

const getFlamesNumber = () => {
  const firstSum = firstPersonValues.reduce((total, value) => total + (!value.found ? 1 : 0), 0);  
  const secondSum = secondPersonValues.reduce((total, value) => total + (!value.found ? 1 : 0), 0);  
  return firstSum + secondSum
}

const flameIt = async (flameNumber) => {
  const flames = [{
    letter: 'F', 
    value: 'Friendship', 
    cut: false}, {letter: 'L', value: 'Love', cut: false}, {letter: 'A', value: 'Affection', cut: false}, {letter: 'M', value: 'Marriage', cut: false}, {letter: 'E', value: 'Enemy', cut: false}, {letter: 'S', value: 'Sibling', cut: false}];
    flamesContainer.innerHTML = "";

    flames.forEach(flame => {
      flamesContainer.innerHTML += `<div class="flame" id="flame-${flame.letter}">${flame.letter}</div>`;
      flame.id=`flame-${flame.letter}`;
    })

    let totalCut = 0;
    let count = 0;

    while(totalCut < flames.length-1){
      for(let idx=0; idx<flames.length; idx++){

        const flame = flames[idx];
        const flameElement = document.getElementById(flame.id)
        
        if(!flame.cut){
          count += 1;
          console.log(flame.letter, count)
          flameElement.classList.add("current");
          await sleep(sleepTime);
          if(count === flameNumber){
            console.log("cut ", flame.letter, count)
            totalCut += 1;
            count = 0;
            flame.cut= true;
            flameElement.classList.add("cut");
            flameElement.classList.remove("current");
          }
          flameElement.classList.remove("current");
        }
      }
    }

    const resultFlame = flames.filter(flame=>!flame.cut)
    showResult(resultFlame[0].value)
}

const showResult = (result) => {
  resultContainer.innerHTML = result;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));


const clear = () => {
  flamesContainer.innerHTML= "";
  resultContainer.innerHTML = "";
  firstPersonDisplayArea.innerHTML = "";
  secondPersonDisplayArea.innerHTML = "";
}