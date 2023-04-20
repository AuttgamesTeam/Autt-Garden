const canvas = document.getElementById("drawing-canvas");
const ctx = canvas.getContext("2d");
const imageContainer = document.getElementById("image-container");
const divGrass = document.getElementById("grass");
const divWater = document.getElementById("water");
const divCliff = document.getElementById("cliff");
const divFlowers = document.getElementById("flower");
const sc = document.getElementsByClassName("s-container");
const fileInput = document.getElementById('gardenInput');

const tileSize = 40;
let currentImage = 0;
let hours = 0;
let filterValue = 'brightness(100%)';

let erase = false;
let noCycle = false;
let freezeTime = false;

let lastUndo = new Date();
let lastEdits = []
let hover = false;
let hoverX = 0;
let hoverY = 0;

const imageFolder = "/assets/tiles/";

const categories = {
                      'g': {name: "grass", number: 58, prefix: "g", container: divGrass},
                      'w': {name: "water", number: 56, prefix: "w", container: divWater},
                      'c': {name: "cliffs", number: 37, prefix: "c", container: divCliff},
                      'f': {name: "flowers", number: 8, prefix: "f", container: divFlowers}
};
let canvasArray = new Array(10).fill(0).map(() => new Array(10).fill("void"));

for (let prefix in categories) {
  let category = categories[prefix];
  category.images = new Array(category.number);
  for (let i = 0; i < category.number; i++) {
    const image = new Image();
    image.src = `${imageFolder}${category.name}/${prefix}${i}.png`;
    category.images[i] = image;

    image.addEventListener("click", () => {
      selectedImage = {img: image, tag: `${prefix}${i}`, category: category, number: i};
    });
    category.container.appendChild(image);
  }};

let selectedImage;
for (let i = 0; i < canvas.width; i += tileSize) {
  for (let j = 0; j < canvas.height; j += tileSize) {
    ctx.rect(i, j, tileSize, tileSize);
  }
}

canvas.addEventListener("click", (event) => {
  let i = Math.floor(event.offsetX / tileSize);
  let j = Math.floor(event.offsetY / tileSize);
  let x = i * tileSize;
  let y = j * tileSize;
  if (erase) { //on ne pose pas d'image, on efface
    lastEdits.push({i, j, prevImg: canvasArray[i][j]})
    canvasArray[i][j] = "void";
  } else if(selectedImage) {
    lastEdits.push({i, j, prevImg: canvasArray[i][j]})
    canvasArray[i][j] = selectedImage.tag;
  }
  console.dir(canvasArray)
});

canvas.addEventListener("mousemove", (event) => {
  hoverX = Math.floor(event.offsetX / tileSize);
  hoverY = Math.floor(event.offsetY / tileSize);

  hover = true;
});

canvas.addEventListener("mouseout", (event) => {
  hover = false;
});

function undo() {
  if ((new Date() - lastUndo) < 30) return;
  lastUndo = new Date();

  if (lastEdits.length == 0) return;
  console.dir(lastEdits)

  let lastEdit = lastEdits.pop();

  canvasArray[lastEdit.i][lastEdit.j] = lastEdit.prevImg;
}

//on met les fonctions des boutons ici
function clearButton() {
  //on demande confirmation
  if (confirm("Voulez-vous vraiment tout effacer ?")) {
  canvasArray = new Array(10).fill(0).map(() => new Array(10).fill("void"));
  }
}

function eraserButton() {
  if(erase) { //si on est déjà en mode gomme, on désactive
    erase = false;
    //on remet la couleur du bouton à la normale
    document.getElementById("eraser").style.backgroundColor = "white";
  } else { //sinon on active le mode gomme
    selectedImage = null;
    erase = true;
    document.getElementById("eraser").style.backgroundColor = "red";
  }
}

function saveButton() {
  setTimeout(() => {
    const dataURL = canvas.toDataURL('image/png')
    const downloadLink = document.createElement('a');
    //on demande le nom du fichier
    let filenamepng = prompt("Name of your creation :");
    filenamepng = filenamepng + ".png";
    downloadLink.href = dataURL;
    downloadLink.download = filenamepng;
    downloadLink.click();
  }, 800);
}

function gitButton() {
  window.open("https://github.com/Claquettes/garden");
}

function cycleButton() {
  if(noCycle) {
    noCycle = false;
  } else {
    noCycle = true;
  }
  console.log(noCycle)
}

function freezeTimeButton() {
  if(freezeTime) {
    freezeTime = false;
  } else {
    freezeTime = true;
  }
  console.log(freezeTime)
}

function exportButton(){ //we export the canvas as a json file
  console.dir(canvasArray)
    let data = [];
    //for each tile, we get the image source and the position

    canvasArray.forEach((row, i) => {
      row.forEach((tile, j) => {
        console.log(canvasArray[i][j])
        let imgTag = canvasArray[i][j];
        data.push({imgTag, i, j});
      })
    });

    //we create a json file
    let json = JSON.stringify(data);
    let blob = new Blob([json], {type: "application/json"});
    let url  = URL.createObjectURL(blob);
    //we download the file
    let a = document.createElement('a');
    //on met le nom du fichier, en ajoutant l'heure et la date
    var filename = prompt("Name of your creation :");
    filename = filename + ".json";
    a.download    = filename;
    a.href        = url;
    a.textContent = "Download file";
    a.click();
}

//we import a json file in the "gardenInput" input
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  console.log('Selected file:', file);
  //when we select a file, we read it, and then we draw the images on the canvas
  const reader = new FileReader();
  reader.onload = (event) => {
    const data = JSON.parse(event.target.result);
    data.forEach((tile) => {
      let imgTag = tile.imgTag;
      let i = tile.i;
      let j = tile.j;

      if (imgTag == "void") {
        canvasArray[i][j] = "void";
      } else {
        let category = categories[imgTag[0]];
        console.log(category)
        let number = parseInt(imgTag.slice(1));
        canvasArray[i][j] = imgTag;
      }
    });
  };
  reader.readAsText(file);
  fileInput.value = "";
});
    
function changeSize(){ //we use the form sizeOfGarden to change the size of the canvas
  let size = document.getElementById("sizeOfGarden").value;
  canvas.width = size;
  canvas.height = size;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < canvas.width; i += tileSize) {
    for (let j = 0; j < canvas.height; j += tileSize) {
      ctx.rect(i, j, tileSize, tileSize);
    }
  }
}

//on appelle la fonction cycle tous les 1000ms  
setInterval(cycle, 1000);

function cycle() {
  if (!freezeTime) {
    hours++;
    if (hours == 24) {
      hours = 0;}
  }
  const brightness = Math.sin(hours/10) * 50 + 50;
  switch (hours) {
      case 15:
          filterValue = `brightness(${brightness}%) sepia(10%)`;
          break;
      case 16:
          filterValue = `brightness(${brightness}%) sepia(20%)`;
          break;
      case 17:
          filterValue = `brightness(${brightness}%) sepia(25%)`;
          break;  
      case 18:
          filterValue = `brightness(${brightness}%) sepia(30%)`;
          break;
      case 19:
          filterValue = `brightness(${brightness}%) sepia(25%)`;
          break;
      case 20:
          filterValue = `brightness(${brightness}%) sepia(20%)`;
          break;
      case 21:
          filterValue = `brightness(${brightness}%) sepia(10%)`;
          break;
      default:
          filterValue = `brightness(${brightness}%)`;
  }
}

function keyDownHandler(e) {
  if(e.key == "Shift") {
    erase = true;
    document.getElementById("eraser").style.backgroundColor = "red";
  } else if (e.keyCode == 90 && e.ctrlKey) {
    undo();
  }
}

function keyUpHandler(e) {
  if(e.key == "Shift") {
    erase = false;
    document.getElementById("eraser").style.backgroundColor = "white";
  }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.filter = filterValue;
  if(noCycle) {
    ctx.filter = "brightness(100%)";
  }
  canvasArray.forEach((row, i) => {
    row.forEach((tile, j) => {
      let imgTag = canvasArray[i][j];
      if (imgTag == "void") {
        ctx.clearRect(i*tileSize, j*tileSize, tileSize, tileSize);
      } else {
        let category = categories[imgTag[0]];
        let number = parseInt(imgTag.slice(1));
        ctx.drawImage(category.images[number], i*tileSize, j*tileSize, tileSize, tileSize);
      }
    })
  });

  if (hover) {
    ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
    let rect = ctx.strokeRect(hoverX*tileSize, hoverY*tileSize, tileSize, tileSize);
    console.log(hoverX, hoverY)
  }


  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);
