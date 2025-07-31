// >>>>> Draw on Canvas >>>>>

const mainCanvas = document.getElementById("canvas");
const context = mainCanvas.getContext("2d");
const viewport = window.visualViewport;
var offsetX;
var offsetY;

function startup() {
  canvas.addEventListener("touchstart", handleStart);
  canvas.addEventListener("touchend", handleEnd);
  canvas.addEventListener("touchcancel", handleCancel);
  canvas.addEventListener("touchmove", handleMove);
}

document.addEventListener("DOMContentLoaded", startup);

const ongoingTouches = [];

function handleStart(evt) {
  evt.preventDefault();
  const touches = evt.changedTouches;
  offsetX = mainCanvas.getBoundingClientRect().left;
  offsetY = mainCanvas.getBoundingClientRect().top;
  console.log(offsetX, offsetY);
  for (let i = 0; i < touches.length; i++) {
    ongoingTouches.push(copyTouch(touches[i]));
  }
}

function handleMove(evt) {
  evt.preventDefault();
  const touches = evt.changedTouches;
  for (let i = 0; i < touches.length; i++) {
    const idx = ongoingTouchIndexById(touches[i].identifier);
    if (idx >= 0) {
      context.beginPath();
      context.moveTo(
        ongoingTouches[idx].clientX - offsetX,
        ongoingTouches[idx].clientY - offsetY,
      );
      context.lineTo(
        touches[i].clientX - offsetX,
        touches[i].clientY - offsetY,
      );
      context.lineWidth = 10;
      context.strokeStyle = "#000";
      context.lineJoin = "round";
      context.closePath();
      context.stroke();
      ongoingTouches.splice(idx, 1, copyTouch(touches[i])); // swap in the new touch record
    }
  }
}

function handleEnd(evt) {
  evt.preventDefault();
  const touches = evt.changedTouches;
  for (let i = 0; i < touches.length; i++) {
    let idx = ongoingTouchIndexById(touches[i].identifier);
    if (idx >= 0) {
      context.lineWidth = 10;
      context.fillStyle = "#000";
      ongoingTouches.splice(idx, 1);
    }
  }
}

function handleCancel(evt) {
  evt.preventDefault();
  const touches = evt.changedTouches;
  for (let i = 0; i < touches.length; i++) {
    let idx = ongoingTouchIndexById(touches[i].identifier);
    ongoingTouches.splice(idx, 1);
  }
}

function copyTouch({ identifier, clientX, clientY }) {
  return { identifier, clientX, clientY };
}

function ongoingTouchIndexById(idToFind) {
  for (let i = 0; i < ongoingTouches.length; i++) {
    const id = ongoingTouches[i].identifier;
    if (id === idToFind) {
      return i;
    }
  }
  return -1; // not found
}

let X;
let y;

const draw = (X_m, y_m) => {
  context.beginPath();
  context.moveTo(X, y);
  context.lineWidth = 10;
  context.strokesStyle = "#000";
  context.lineCap = "round";
  context.lineJoin = "round";
  context.lineTo(X_m, y_m);
  context.stroke();

  X = X_m;
  y = y_m;
};

const mouseClick = (evt) => {
  X = evt.offsetX;
  y = evt.offsetY;
  draw(X, y);
  mainCanvas.addEventListener("mousemove", mouseMoving);
};

const mouseMoving = (evt) => {
  draw(evt.offsetX, evt.offsetY);
};

const mouseUp = () => {
  mainCanvas.removeEventListener("mousemove", mouseMoving);
};

// <<<<< Draw on Canvas <<<<<

// submit

document.getElementById("btn").addEventListener("click", () => {
  var numbers = document.getElementById("numbers");
  numbers.style.display = "flex";
  var canvasData = Array.from(context.getImageData(0, 0, 200, 200).data);
  var data = JSON.stringify({ image: canvasData });
  console.log(data);

  fetch("http://localhost:8000/numai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  })
    .then((res) => res.json())
    .then((res) => {
      predicts = res["predict"];
      console.log(predicts);
      document.getElementById("number").innerHTML = "" + predicts[0];
      document.getElementById("number2").innerHTML = "" + predicts[1];
      document.getElementById("number3").innerHTML = "" + predicts[2];
    });
});

// Clean canvas
document.getElementById("clear").addEventListener("click", () => {
  context.clearRect(0, 0, 200, 200);
});

mainCanvas.addEventListener("mousedown", mouseClick);
mainCanvas.addEventListener("mouseup", mouseUp);
