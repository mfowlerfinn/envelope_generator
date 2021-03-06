var PDFDocument = require('pdfkit').default;
var blobStream = require('blob-stream');
import './register-files';

let h;
let w;
let docDefinition = {};

const runButton = document.querySelector('#run');
let downloadButton = document.querySelector('#download');
let downloadUrl = "";
runButton.addEventListener('click', run);

function run() {
  // console.log('clicked to run...');
  getTextLayout();
  //ALL DIMENSIONS IN PDF POINTS (72 per inch)
  w = Number(User.width) * 72;
  h = Number(User.height) * 72;
  docDefinition = {
    // a string or [width, height]
    size: [w, h],
    // by default we use portrait, you can change it to landscape if you wish
    pageOrientation: 'landscape',
    // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
    margin: 10,
  };
  if (csvData.length === 0) {
    alert('Please import csv data...');
  } else {
    makePDF();
  }
}

function makePDF() {
  // create a document and pipe to a blob
  var doc = new PDFDocument(docDefinition);
  var stream = doc.pipe(blobStream());

  doc.registerFont('Roboto', 'fonts/Roboto-Regular.ttf')

  function getString(item, card) {
    if (item === 0) return User.name;
    if (item === 1) return User.address;
    if (item === 2) return User.city;
    if (item === 3) return (`${csvData[card][0]} ${csvData[card][1]}`);
    if (item === 4) return (csvData[card][2]);
    if (item === 5) return (`${csvData[card][3]}, ${csvData[card][4]} ${csvData[card][5]}`);
  }

  for (let i = 0; i < csvData.length; i++) {
    let row = i % (textLayout.length);
    if (i > 0) {
      let progress = `working on ${i} of ${csvData.length-1}`;
      console.log(progress);
      for (let j = 0; j < textLayout.length; j++) {
        let textInfo = textLayout[j];
        let size = textInfo[4];
        let x = textInfo[0];
        let y = textInfo[1];
        let str = getString(j, i);
        doc.fontSize(size);
        doc.text(`${str}`, x, y);
      }
      if (i + 1 < csvData.length) doc.addPage();
    }
  }
  doc.end();

  function onStartedDownload(id) {
    console.log(`Started downloading: ${id}`);
  }

  function onFailed(error) {
    console.log(`Download failed: ${error}`);
  }

  stream.on('finish', function() {
    const blob = stream.toBlob('application/pdf');
    downloadUrl = URL.createObjectURL( blob );
    downloadButton.setAttribute( "href", downloadUrl );
    downloadButton.innerText = "Download PDF";
  });
}