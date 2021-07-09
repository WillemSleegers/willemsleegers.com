// Function to add code visibility toggle buttons and copy buttons to code
// sections
function addCodeButtons() {
  // Find all pre tags
  const preTags = document.querySelectorAll("pre")

  // Loop over the pre tags and add a show/hide code button and a copy button
  let div, toggleButton, copyButton

  for (let pre of preTags) {
    // Create elements
    div = document.createElement("div")
    toggleButton = document.createElement("button")
    copyButton = document.createElement("button")

    // Set the text of the toggle button, which depends on whether the code is
    // already visible or not
    if (pre.classList.contains("active-code")) {
      toggleButton.textContent = "Hide"
    } else {
      toggleButton.textContent = "Show"
    }

    // Set copy button text
    copyButton.textContent = "Copy"

    // Add classes
    toggleButton.className = "code-button toggle-code-button"
    copyButton.className = "code-button copy-code-button"
    div.className = "code-buttons"

    // Add functions
    toggleButton.onclick = toggleCodeVisibility
    copyButton.onclick = copyCodeToClipboard

    // Add buttons to a div and add the div to the pre element
    // Note that the order in which they are added to the div is important for
    // the functions to find the code element
    div.appendChild(copyButton)
    div.appendChild(toggleButton)
    pre.appendChild(div)
  }
}

// Function to toggle the visibility of a code section
function toggleCodeVisibility() {
  console.log("Toggling code visibility.")
  const button = this

  // Find the pre element and toggle the code visibility class
  const pre = button.parentElement.parentElement
  pre.classList.toggle("active-code")

  // Update the button's text
  if (button.textContent == "Show") {
    button.textContent = "Hide"
  } else {
    button.textContent = "Show"
  }
}

function toggleAllCodeVisibility() {
  const button = this

  // Find all pre tags
  const preTags = document.querySelectorAll("pre")

  // Check whether to show or hide all code
  if (button.classList.contains("active-code")) {
    // Update button text and class
    button.textContent = "Hide All Code"
    button.classList.toggle("active-code")

    // Loop over the pre elements and show the code
    for (let pre of preTags) {
      if (!pre.classList.contains("active-code")) {
        // Set the code is visible class
        pre.classList.add("active-code")

        // Find the toggle code button and update the text
        var toggleButton = pre.getElementsByClassName("toggle-code-button")[0]
        toggleButton.textContent = "Hide"
      }
    }
  } else {
    // Update button text and class
    button.textContent = "Show All Code"
    button.classList.toggle("active-code")

    // Loop over the pre elements and hide the code
    for (let pre of preTags) {
      if (pre.classList.contains("active-code")) {
        // Remove the code is visible class
        pre.classList.remove("active-code")

        // Find the toggle code button and update the text
        var toggleButton = pre.getElementsByClassName("toggle-code-button")[0]
        toggleButton.textContent = "Show"
      }
    }
  }
}

function copyCodeToClipboard() {
  const button = this

  // Find the code's text
  const text = button.parentElement.parentElement.firstElementChild.textContent

  // Copy the text to the clipboard
  navigator.clipboard.writeText(text).then(function() {
    console.log("Succesfully copied code to clipboard.")

    // Temporarily show that the text was copied
    button.innerHTML = "Copied!"
    setTimeout(function () { button.innerHTML = "Copy" }, 2000)
  }, function() {
    console.log("Failed to copy code to clipboard.")

    // Temporarily show that the copy failed
    button.innerHTML = "Copy failed"
    setTimeout(function () { button.innerHTML = "Copy" }, 2000)
  });
}

// ToC function
function createTOC() {
  // Get ToC div
  toc = document.getElementById("toc");

  // Add a header
  tocHeader = document.createElement("h2");
  tocHeader.innerText = "Contents:";
  toc.appendChild(tocHeader);

  // Create a list for the ToC entries
  tocList = document.createElement("ul");

  // Get the h3 tags — ToC entries
  article = document.getElementsByClassName("article-content")[0];
  headers = article.getElementsByTagName("h2");

  // For each h3
  for (i = 0; i < headers.length; i++){

    // Create an id
    name = "h"+i;
    headers[i].id = name;

    // a list item for the entry
    tocListItem = document.createElement("li");

    // a link for the h2
    tocEntry = document.createElement("a");
    tocEntry.setAttribute("href","#"+name);
    tocEntry.innerText=headers[i].innerText;
    tocListItem.appendChild(tocEntry);
    tocList.appendChild(tocListItem);
  }

  toc.appendChild(tocList);
}

function addSalutes() {
  console.log("Adding salutes")
  
  // Find all p elements and loop over them
  for (const p of document.querySelectorAll("p")) {
    
    // Check if the content of the p element contains a salute-related word
    if (p.textContent.includes("general") || p.textContent.includes("major")) {
      
      // Extract the words
      const words = p.innerHTML.split(' ')
      
      // Create an empty text array to store the words back into
      let text = []
      
      // Loop over each word
      for (let i = 0; i < words.length; i++) {
        
        // Create a variable to store the word into, together with HTML-elements
        // in case the word is a salute-related words
        let word = words[i]
        
        // Check which salute-related word it is
        if (word === "general" | word === "major") {
          
          // Extract the next word and check if it ends with punctuation; if so,
          // remove it
          let nextWord = words[i + 1]
      
          if (!/[a-z]$/.test(nextWord)) {
            nextWord = nextWord.slice(0, -1)
          }
          
          // Create the new content consisting of HTML elements, the current
          // word and the next word
      	  word = '<span class="salute">' + word + '<div class="salute-text">' +
      	    '<img src="/img/saluting-face.png"/>' + 
      	    (word.charAt(0).toUpperCase() + word.slice(1)) + ' ' + nextWord + 
      	    '</div></span>'
      	}
      	text.push(word)  
      }
      
      // Combine the different words into a single value and replace the p
      // element's HTML with this value
      text = text.join(' ')
      p.innerHTML = text
    }
  }
}

window.onload = function() {
  // Find the Show/Hide All Code button and attach the toggle function
  const toggleButton = document.getElementById("toggle-all-code-button")
  if (toggleButton) toggleButton.onclick = toggleAllCodeVisibility

  // Add the code buttons to each pre tag
  addCodeButtons()

  // Create the TOC
  //createTOC()
  
  // Add salutes
  addSalutes()
}
