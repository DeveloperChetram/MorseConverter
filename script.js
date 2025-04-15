let input = document.querySelector("input")
let button = document.querySelector("button")
let output = document.querySelector(".output")
let copy = document.querySelector(".copy")
let alert = document.querySelector(".alert")
let clear = document.querySelector(".clear")


let morse=
    {
        a: ".-",
        b: "-...",
        c: "-.-.",
        d: "-..",
        e: ".",
        f: "..-.",
        g: "--.",
        h: "....",
        i: "..",
        j: ".---",
        k: "-.-",
        l: ".-..",
        m: "--",
        n: "-.",
        o: "---",
        p: ".--.",
        q: "--.-",
        r: ".-.",
        s: "...",
        t: "-",
        u: "..-",
        v: "...-",
        w: ".--",
        x: "-..-",
        y: "-.--",
        z: "--..",
        " ":"   ",
        "0": "-----",
        "1": ".----",
        "2": "..---",
        "3": "...--",
        "4": "....-",
        "5": ".....",
        "6": "-....",
        "7": "--...",
        "8": "---..",
        "9": "----.",
        

    }
    let str =''
    let outputStr = ''
    button.addEventListener("click", function(){
        if(input.value==="" || input.value===" "){
            outputStr += '<span class="invalid">Please enter any input to convert it into Morse</span> '
            console.log("Invalid Input")
            output.innerHTML = outputStr.trim();
        }
  
        if(input.value==''|| input.value===" "){
            copy.style.opacity = 0
         
        }
        else{
            copy.style.opacity = 1
        }
    str=input.value.toLowerCase() 
           convert()

    })
 function convert(){
    for (let char of str) {
        if (char === ' ') {
            outputStr += '   ';
        } else if (morse[char]) {
            outputStr += morse[char] + ' '; 
        } else {
            outputStr += '<span class="invalid">Invalid Input</span> '; // for unknown characters
        }
    }
    output.innerHTML = outputStr.trim(); 

    outputStr = ''; 

 }
 copy.addEventListener("click", function(){
    navigator.clipboard.writeText(output.textContent).then(function() {
  
        setTimeout(() => {
            
            alert.style.opacity = 1;
          
           
            setTimeout(() => {
              alert.style.opacity = 0;
            }, 3000);
          
          }, 60);
    }, function(err) {
        console.error('Could not copy text: ', err);
    });
    })

 clear.addEventListener("click", function(){
    input.value = ''
    output.innerHTML = ''
    copy.style.opacity = 0
    alert.style.opacity = 0;
    outputStr = ''; 
    str = ''
 })