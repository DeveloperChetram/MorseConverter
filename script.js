const input = document.querySelector("input");
const button = document.querySelector("button");
const output = document.querySelector(".output");
const copy = document.querySelector(".copy");
const alertElem = document.querySelector(".alert");
const clear = document.querySelector(".clear");
const Child1 = document.querySelector(".Child1");
const Child2 = document.querySelector(".Child2");
const heading = document.querySelector(".heading");
const helpButton = document.querySelector(".help-button");
const helpModal = document.querySelector(".help-modal");
const closeModal = document.querySelector(".close-modal");

const morse = {
  a: ".-",    b: "-...",  c: "-.-.",  d: "-..",
  e: ".",     f: "..-.",  g: "--.",   h: "....",
  i: "..",    j: ".---",  k: "-.-",   l: ".-..",
  m: "--",    n: "-.",    o: "---",   p: ".--.",
  q: "--.-",  r: ".-.",   s: "...",   t: "-",
  u: "..-",   v: "...-",  w: ".--",   x: "-..-",
  y: "-.--",  z: "--..",
  " ": "   ",
  "0": "-----", "1": ".----", "2": "..---",
  "3": "...--", "4": "....-", "5": ".....",
  "6": "-....", "7": "--...", "8": "---..",
  "9": "----."
};

const textFromMorse = {};
for (const key in morse) {
  if (morse.hasOwnProperty(key)) {
    textFromMorse[morse[key]] = key;
  }
}

let mode = "textToMorse";

function updateUIForTextToMorse() {
  heading.textContent = "Text to Morse Code Converter";
  Child1.style.cssText = "color:#39ff14; border:1px solid #39ff14; background-color:#112b11;";
  Child2.style.cssText = "color:#d9d9d9; border:1px solid #d9d9d9; background-color:transparent; transition:0.5s;";
}

function updateUIForMorseToText() {
  heading.textContent = "Morse Code to Text Converter";
  Child2.style.cssText = "color:#39ff14; border:1px solid #39ff14; background-color:#112b11;";
  Child1.style.cssText = "color:#d9d9d9; border:1px solid #d9d9d9; background-color:transparent; transition:0.5s;";
}

// Conversion function for text-to-morse
function textToMorse() {
  const str = input.value.toLowerCase();
  let outputStr = "";
  if (!str.trim()) {
    output.innerHTML = '<span class="invalid">Please enter some input</span>';
    copy.style.opacity = 0;
    return;
  }
  for (let char of str) {
    if (char === " ") {
      outputStr += "  ";
    } else if (morse[char]) {
      outputStr += morse[char] + " ";
    } else {
      outputStr += '<span class="invalid">Invalid Input</span> ';
    }
  }
  output.innerHTML = outputStr.trim();
}

function morseToText() {
  const str = input.value.trim();
  let outputStr = "";
  if (!str) {
    output.innerHTML = '<span class="invalid">Please enter some input</span>';
    copy.style.opacity = 0;
    return;
  }
  const words = str.split("   ");
  for (let word of words) {
    const letters = word.split(" ");
    for (let letter of letters) {
      if (textFromMorse[letter]) {
        outputStr += textFromMorse[letter];
      } else {
        outputStr += '<span class="invalid"> Invalid</span>';
      }
    }
    outputStr += " ";
  }
  output.innerHTML = outputStr.trim();
}

input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    if (input.value.trim() === "") {
      output.innerHTML = '<span class="invalid">Please enter some input</span>';
      copy.style.opacity = 0;
      return;
    }
  
    copy.style.opacity = 1;
  
    if (mode === "textToMorse") {
      textToMorse();
    } else {
      morseToText();
    }
  }
});
button.addEventListener("click", function() {

  if (input.value.trim() === "") {
    output.innerHTML = '<span class="invalid">Please enter some input</span>';
    copy.style.opacity = 0;
    return;
  }

  copy.style.opacity = 1;

  if (mode === "textToMorse") {
    textToMorse();
  } else {
    morseToText();
  }
});

Child1.addEventListener("click", function() {
  mode = "textToMorse";
  updateUIForTextToMorse();
});

Child2.addEventListener("click", function() {
  mode = "morseToText";
  updateUIForMorseToText();
});

copy.addEventListener("click", function() {
  navigator.clipboard.writeText(output.textContent).then(function() {
    alertElem.style.opacity = 1;
    setTimeout(function() {
      alertElem.style.opacity = 0;
    }, 3000);
  }, function(err) {
    console.error('Could not copy text:', err);
  });
});

clear.addEventListener("click", function() {
  input.value = "";
  output.innerHTML = "";
  copy.style.opacity = 0;
  alertElem.style.opacity = 0;
});

helpButton.addEventListener("click", function() {
    helpModal.classList.add("active");
});

closeModal.addEventListener("click", function() {
    helpModal.classList.remove("active");
});

// Close modal when clicking outside
helpModal.addEventListener("click", function(e) {
    if (e.target === helpModal) {
        helpModal.classList.remove("active");
    }
});

// Close modal with Escape key
document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" && helpModal.classList.contains("active")) {
        helpModal.classList.remove("active");
    }
});