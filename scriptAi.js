const input = document.querySelector("input");
const button = document.querySelector("button");
const output = document.querySelector(".output");
const copy = document.querySelector(".copy");
const alertElem = document.querySelector(".alert");
const clear = document.querySelector(".clear");
const Child1 = document.querySelector(".Child1");
const Child2 = document.querySelector(".Child2");
const heading = document.querySelector(".heading");

// Morse code mapping for text -> morse conversion
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

// Create reverse mapping for morse -> text conversion
const textFromMorse = {};
for (const key in morse) {
  if (morse.hasOwnProperty(key)) {
    textFromMorse[morse[key]] = key;
  }
}

// Mode flag: "textToMorse" or "morseToText"
let mode = "textToMorse";

// UI update functions for switching between modes
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
      outputStr += "   ";
    } else if (morse[char]) {
      outputStr += morse[char] + " ";
    } else {
      outputStr += '<span class="invalid">Invalid Input</span> ';
    }
  }
  output.innerHTML = outputStr.trim();
}

// Conversion function for morse-to-text
function morseToText() {
  const str = input.value.trim();
  let outputStr = "";
  if (!str) {
    output.innerHTML = '<span class="invalid">Please enter some input</span>';
    copy.style.opacity = 0;
    return;
  }
  // Split by 3 spaces to determine words
  const words = str.split("   ");
  for (let word of words) {
    const letters = word.split(" ");
    for (let letter of letters) {
      if (textFromMorse[letter]) {
        outputStr += textFromMorse[letter];
      } else {
        outputStr += '<span class="invalid">?</span>';
      }
    }
    outputStr += " ";
  }
  output.innerHTML = outputStr.trim();
}

// Main convert button event
button.addEventListener("click", function() {
  // Validate non-empty input
  if (input.value.trim() === "") {
    output.innerHTML = '<span class="invalid">Please enter some input</span>';
    copy.style.opacity = 0;
    return;
  }
  // Show copy button when input is valid
  copy.style.opacity = 1;

  if (mode === "textToMorse") {
    textToMorse();
  } else {
    morseToText();
  }
});

// Mode switching event listeners
Child1.addEventListener("click", function() {
  mode = "textToMorse";
  updateUIForTextToMorse();
});

Child2.addEventListener("click", function() {
  mode = "morseToText";
  updateUIForMorseToText();
});

// Copy the conversion result to the clipboard
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

// Clear input and output fields
clear.addEventListener("click", function() {
  input.value = "";
  output.innerHTML = "";
  copy.style.opacity = 0;
  alertElem.style.opacity = 0;
});