const emptyPlaceholder = document.getElementById("empty");
const wrapper = document.getElementById("wrapper");
const container = document.getElementById("container");
const input = document.getElementById("input");

const minOutputLength = 5;
const threshold = 80;

window.onload = () => {
  on_scanner(); // init function
  input.onpaste = (e) => e.preventDefault();
};
// input.addEventListener("keyup", (e) => console.log(e, "@"));

function on_scanner() {
  let lastKeypressTime = 0;
  let output = "";

  input.addEventListener("keyup", function (e) {
    console.log(e, "EEEE");
    // Check the time between keypresses
    const currentTime = Date.now();
    const timeDiff = currentTime - lastKeypressTime;
    lastKeypressTime = currentTime;

    // If diff is small it is likely from a scanner
    const scannerDetected = timeDiff < threshold;
    output += getLatinKey(e.key, e.code);

    const validLength = input.value.length > minOutputLength;
    // Scanner always sending Enter key at the end of the input
    if (e.key === "Enter") {
      // if (scannerDetected && validLength) handleScan(`${input.value}`);
      if (scannerDetected && validLength) handleScan(`${output}`);

      output = "";
      clearInput();
    }

    setTimeout(() => {
      output = "";
      clearInput();
    }, threshold);
  });
  document.addEventListener("keypress", function (e) {
    if (e.target.tagName !== "INPUT") input.focus();
  });
}

function clearInput() {
  input.value = "";
}

function handleScan(value) {
  clearPreviousCodes();
  attachCode(value);
  removePlaceholder();
}

function attachCode(code) {
  const li = document.createElement("li");
  container.appendChild(li);
  li.innerText = code;
}

function clearPreviousCodes() {
  const maxCodeItems = 4;

  if (container.getElementsByTagName("li").length >= maxCodeItems) {
    const firstElem = container.firstElementChild;
    firstElem.classList.add("deleting");

    setTimeout(() => {
      container.removeChild(container.firstElementChild);
    }, 200);
  }
}

function getLatinKey(key, code) {
  // i.e. 'Enter', 'DownKey', 'Shift'
  if (key.length !== 1) return "";

  const capitalHetaCode = 880;
  const isNonLatin = key.charCodeAt(0) >= capitalHetaCode;

  if (isNonLatin) {
    if (code.indexOf("Key") === 0 && code.length === 4) {
      // i.e. 'KeyW'
      return code.charAt(3);
    }
  }
  if (code.indexOf("Digit") === 0 && code.length === 6) {
    // i.e. 'Digit7'
    return code.charAt(5);
  }

  return key;
}

function removePlaceholder() {
  wrapper.removeChild(emptyPlaceholder);
}

function temp() {
  setInterval(() => {
    handleScan(`testCode-${Date.now().toString().substr(10)}`);
  }, 4000);
}
// temp();
