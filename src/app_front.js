const user = document.querySelector('#user-input');
const adjustableDivs = document.querySelectorAll('.text');
const envelope = document.querySelector('#envelope');
const canvas = document.querySelector('#canvas');
const addressReturn = document.querySelector('#address_return');
const addressDest = document.querySelector('#address_destination');
const ctx = canvas.getContext('2d');
const pdfDPI = 72;
let canvasX;
let canvasY;
let originX;
let originY;
let User = { height: "5", width: "9.5" };
let textLayout = [];

function center(parent, child) {
  // console.log({ parent, child });
  let marginX = (parent.offsetWidth - child.offsetWidth) / 2;
  let marginY = (parent.offsetHeight - child.offsetHeight) / 2;
  if (parent === canvas) {
    // console.log("parent = canvas");
    originX = marginX;
    originY = marginY;
    marginX += parent.offsetLeft;
    marginY += parent.offsetTop;
  }
  child.style.left = marginX + "px";
  child.style.top = marginY + "px";
  // console.log({ moveX, moveY });
}

function canvasInit(x = 1000, y = 500) {
  canvas.style.width = `${x}px`; // Set display size (css pixels).
  canvas.style.height = `${y}px`;
  canvasX = x;
  canvasY = y;
  let scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
  canvas.width = x * scale; // Set actual size in memory (scaled to account for extra pixel density).
  canvas.height = y * scale;
  ctx.scale(scale, scale); // Normalize coordinate system to use css pixels.
}

function displayGridLines(color = 'lightblue', width = 1, offsetX = originX, offsetY = originY, interval = pdfDPI) {
  while (offsetX > interval) offsetX -= interval;
  while (offsetY > interval) offsetY -= interval;
  if (!offsetX) offsetX = (canvasX % pdfDPI) / 2;
  if (!offsetY) offsetY = (canvasY % pdfDPI) / 2;
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  for (let i = offsetX; i < canvasX; i) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvasY);
    ctx.stroke();
    i += interval;
  }
  for (let i = offsetY; i < canvasY; i) {
    ctx.moveTo(0, i);
    ctx.lineTo(canvasX, i);
    ctx.stroke();
    i += interval;
  }
}

function setup() {
  canvasInit();
  if (User.width) {
    let pxX = User.width * pdfDPI;
    let pxY = User.height * pdfDPI;
    envelope.style.width = pxX + "px";
    envelope.style.height = pxY + "px";
  }
  if (User.name) document.querySelector('#r1').innerText = User.name;
  if (User.address) document.querySelector('#r2').innerText = User.address;
  if (User.city) document.querySelector('#r3').innerText = User.city;
  center(canvas, envelope);
  // center(envelope, addressDest);
  displayGridLines();
}

function handleResize() {
  center(canvas, envelope);
  displayGridLines();
}

function handleClick(e) {
  event.stopPropagation();
  getCoords(e.target);
}

function getCoords(origin) {
  // console.log(origin);
  let xCoord = addOffsets("x", origin);
  let yCoord = addOffsets("y", origin);

  function addOffsets(dir, target) {
    let offset = 0;
    for (let i = 0; i < 20; i++) {
      (dir === "x") ? offset += target.offsetLeft: offset += target.offsetTop;
      target = target.offsetParent;
      // console.log(offset);
      // console.log(target.id);
      if (target.id === "envelope") {
        i = 20;
      }
    }
    return offset;
  }
  // console.log([xCoord, yCoord]);
  return [xCoord, yCoord];

}

function handleUser(e) {
  e.preventDefault();
  for (let i = 0; i < e.target.length - 1; i++) {
    let name = e.target[i].name;
    let value = e.target[i].value;
    User[name] = value;
  }
  console.log(User);
  setup();
}

function getTextLayout() {
  let i = 0;
  textLayout = [];
  adjustableDivs.forEach(item => {
    let fontSize = window.getComputedStyle(item).getPropertyValue('font-size');
    fontSize = Number(fontSize.replace(/px/, ''));
    textLayout[i] = getCoords(item);
    textLayout[i].push(item.id);
    textLayout[i].push(item.innerText);
    textLayout[i].push(fontSize);
    i++;
  });
  console.log(textLayout); //and USER
}

user.addEventListener("submit", handleUser);
window.addEventListener("load", setup);
window.addEventListener("resize", handleResize)
adjustableDivs.forEach(adjustableDiv => adjustableDiv.addEventListener('click', handleClick));

//file loader begins---
let csvData = [];

document.querySelector("#file-input").addEventListener('change', function() {
  // files that user has chosen
  let all_files = this.files;
  if (all_files.length == 0) {
    alert('Error : No file selected');
    return;
  }
  // first file selected by user
  let file = all_files[0];

  // files types allowed
  let allowed_types = ['text/csv'];
  if (allowed_types.indexOf(file.type) == -1) {
    alert('Error : Incorrect file type');
    return;
  }

  // Max 2 MB allowed
  let max_size_allowed = 2 * 1024 * 1024
  if (file.size > max_size_allowed) {
    alert('Error : Exceeded size 2MB');
    return;
  }
  // file validation is successfull
  // we will now read the file
  let reader = new FileReader();

  // file reading started
  reader.addEventListener('loadstart', function() {
    // document.querySelector("#file-input-label").style.display = 'none'; 
  });

  // file reading finished successfully
  reader.addEventListener('load', function(e) {
    let text = e.target.result;
    processData(text);

    // document.querySelector("#file-input-label").style.display = 'block'; 
  });

  function processData(csv) {
    let allTextLines = csv.split(/\r\n|\r|\n/);
    csvData = [];
    for (let i = 0; i < allTextLines.length; i++) {
      let data = allTextLines[i].split(/,/);
      let tarr = [];
      for (let j = 0; j < data.length; j++) {
        let str = data[j];
        tarr.push(str);
      }
      csvData.push(tarr);
    }
    console.log(csvData);
  }
  // read as text file
  reader.readAsText(file);
});

function pdfMagic() {
  
}