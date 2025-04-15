let input = document.querySelector("input")
let button = document.querySelector("button")
let output = document.querySelector(".output")
let copy = document.querySelector(".copy")
let alert = document.querySelector(".alert")
let clear = document.querySelector(".clear")
let Child1 = document.querySelector(".Child1")
let Child2 = document.querySelector(".Child2")
let heading = document.querySelector(".heading")


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
    function MtoT(){
        button.addEventListener("click", function(){
           
            if(input.value==="." || input.value==="-"){
              
                outputStr +=""
                output.innerHTML = outputStr.trim();
            }
            else{
                // outputStr += '<span class="invalid">Please enter any input to convert it into Morse</span> '  
                output.innerHTML = outputStr.trim();
            }
         })
    }
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
 let flag = 1;

 Child2.addEventListener("click", function() {

     if (flag == 1) {
       let arr= str.split(' ')

         heading.innerHTML = "Morse Code to Text Converter";
         Child2.style.border = "1px solid #39ff14";
         Child2.style.backgroundColor = "#112b11";
         Child2.style.color = "#39ff14";
         Child1.style.color = "#d9d9d9";
         Child1.style.border = "1px solid #d9d9d9";
         Child1.style.backgroundColor = "transparent";
         Child1.style.transition = "0.5s";
         flag = 0;
         button.addEventListener("click",  MtoT)
       
     
        console.log(arr)
     } else {
         heading.innerHTML = "Text to Morse Code Converter";
         Child1.style.color = "#39ff14";
         Child1.style.border = "1px solid #39ff14";
         Child1.style.backgroundColor = "#112b11";
         Child2.style.color = "#d9d9d9";
         Child2.style.border = "1px solid #d9d9d9";
         Child2.style.backgroundColor = "transparent";
         Child2.style.transition = "0.5s";
         flag = 1;
         button.addEventListener("click",  convert)
         console.log("convert called")
     }
 });
 
 Child1.addEventListener("click", function() {
     if (flag == 0) {
        
         heading.innerHTML = "Text to Morse Code Converter";
         Child1.style.color = "#39ff14";
         Child1.style.border = "1px solid #39ff14";
         Child1.style.backgroundColor = "#112b11";
         Child2.style.color = "#d9d9d9";
         Child2.style.border = "1px solid #d9d9d9";
         Child2.style.backgroundColor = "transparent";
         Child2.style.transition = "0.5s";
         flag = 1;
         button.addEventListener("click",  convert)
     } else {
         heading.innerHTML = "Morse Code to Text Converter";
         Child2.style.border = "1px solid #39ff14";
         Child2.style.backgroundColor = "#112b11";
         Child2.style.color = "#39ff14";
         Child1.style.color = "#d9d9d9";
         Child1.style.border = "1px solid #d9d9d9";
         Child1.style.backgroundColor = "transparent";
         Child1.style.transition = "0.5s";
         flag = 0;
         button.addEventListener("click",  MtoT)
     }
 });
 