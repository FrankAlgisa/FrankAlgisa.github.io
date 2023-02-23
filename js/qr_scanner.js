let contentMax;
function docReady(fn) {
  // see if DOM is already available
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    // call on next available tick
    setTimeout(fn, 1);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}
/** Ugly function to write the results to a table dynamically. */
function printScanResultPretty(codeId, decodedText, decodedResult) {
  let resultSection = document.querySelector("#display");
  let tableBodyId = "scanned-result-table-body";
  if (!document.getElementById(tableBodyId)) {
    let table = document.createElement("table");
    table.className = "styled-table";
    table.style.width = "100%";
    resultSection.appendChild(table);
    let theader = document.createElement("thead");
    let trow = document.createElement("tr");
    let th1 = document.createElement("td");
    th1.innerText = "Count";
    let th2 = document.createElement("td");
    th2.innerText = "Format";
    let th3 = document.createElement("td");
    th3.innerText = "Result";
    trow.appendChild(th1);
    trow.appendChild(th2);
    trow.appendChild(th3);
    theader.appendChild(trow);
    table.appendChild(theader);
    let tbody = document.createElement("tbody");
    tbody.id = tableBodyId;
    table.appendChild(tbody);
  }
  let tbody = document.getElementById(tableBodyId);
  let trow = document.createElement("tr");
  let td1 = document.createElement("td");
  td1.innerText = `${codeId}`;
  let td2 = document.createElement("td");
  td2.innerText = `${decodedResult.result.format.formatName}`;
  let td3 = document.createElement("td");
  td3.innerText = `${decodedText}`;
  trow.appendChild(td1);
  trow.appendChild(td2);
  trow.appendChild(td3);
  tbody.appendChild(trow);
}
docReady(function () {
  var lastMessage;
  var codeId = 0;
  function onScanSuccess(decodedText, decodedResult) {
    /**
     * If you following the code example of this page by looking at the
     * source code of the demo page - good job!!
     *
     * Tip: update this function with a success callback of your choise.
     */
    if (lastMessage !== decodedText) {
      dispaly.innerHTML = "";
      lastMessage = decodedText;
      printScanResultPretty(codeId, decodedText, decodedResult);
      contentMax = document.querySelectorAll("#scanned-result-table-body td")[2]
        .innerHTML;
      display.innerHTML = "";
      display.innerHTML = contentMax;

      document.querySelectorAll("video")[0].classList.add("border_colored");
      setTimeout(() => {
        document
          .querySelectorAll("video")[0]
          .classList.remove("border_colored");
      }, 2000);
      ++codeId;
    }
  }
  var qrboxFunction = function (viewfinderWidth, viewfinderHeight) {
    // Square QR Box, with size = 80% of the min edge.
    var minEdgeSizeThreshold = 400;
    var edgeSizePercentage = 0.75;
    var minEdgeSize =
      viewfinderWidth > viewfinderHeight ? viewfinderHeight : viewfinderWidth;
    var qrboxEdgeSize = Math.floor(minEdgeSize * edgeSizePercentage);
    if (qrboxEdgeSize < minEdgeSizeThreshold) {
      if (minEdgeSize < minEdgeSizeThreshold) {
        return { width: minEdgeSize, height: minEdgeSize };
      } else {
        return {
          width: minEdgeSizeThreshold,
          height: minEdgeSizeThreshold,
        };
      }
    }
    return { width: qrboxEdgeSize, height: qrboxEdgeSize };
  };
  let html5QrcodeScanner = new Html5QrcodeScanner("uno", {
    fps: 10,
    qrbox: qrboxFunction,
    experimentalFeatures: {
      useBarCodeDetectorIfSupported: true,
    },
    rememberLastUsedCamera: true,
    showTorchButtonIfSupported: true,
  });
  html5QrcodeScanner.render(onScanSuccess);
});

/*TASTI*/
const btnTrue = document.querySelector("#true");
const btnFalse = document.querySelector("#false");
const submit = document.querySelector("#submit");
const input = document.querySelector("input");
const dispaly = document.querySelector("#display");
const container = document.querySelector("#main_container");
const due = document.querySelector("#due");
let Ip;

/*BOTTONE TRUE*/
btnTrue.addEventListener("click", () => {
  btnTrue.classList.toggle("border_button_colored");

  if (Ip == undefined || Ip.length <= 0) {
    alert("Fornisci un Ip (2)");
  } else {
    /*OPZIONI*/
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://" + Ip + "/" + contentMax + "/");
    xhr.setRequestHeader("Content-Type", "text/plain");
    xhr.onreadystatechange = function () {
      const beep = new Audio("./js/beep.mp3");
      const beep2 = new Audio("./js/beep2.mp3");
      const beep3 = new Audio("./js/beep3.mp3");

      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          beep.play();
          dispaly.innerHTML = xhr.response;
          due.setAttribute("style", "background-color: green !important");
          setTimeout(() => {
            due.setAttribute("style", "background-color: inherit");
          }, 1000);
        } else if (xhr.status === 13) {
          beep2.play();
          dispaly.innerHTML = xhr.response;
          due.setAttribute("style", "background-color: yellow !important");
          setTimeout(() => {
            due.setAttribute("style", "background-color: inherit");
          }, 1000);
        } else {
          beep3.play();
          dispaly.innerHTML = "Errore: " + xhr.response;
          due.setAttribute("style", "background-color: red !important");
          setTimeout(() => {
            due.setAttribute("style", "background-color: inherit");
          }, 1000);
        }
      }
    };
    xhr.send();
  }
  setTimeout(() => {
    btnTrue.classList.remove("border_button_colored");
  }, 100);
});

submit.addEventListener("click", () => {
  if (input.value.length <= 0) {
    alert("Fornisci un Ip (1)");
  } else {
    Ip = input.value;
    input.setAttribute("placeholder", Ip);
    input.value = "";
  }
});

btnFalse.addEventListener("click", () => {
  btnFalse.classList.toggle("border_button_colored");
  setTimeout(() => {
    btnFalse.classList.remove("border_button_colored");
  }, 100);
  display.innerHTML = "";
  contentMax = "";
  lastMessage = "";
});
