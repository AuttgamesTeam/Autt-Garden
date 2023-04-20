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

let erase = false;

const imageFolder = "/assets/tiles/";

const categories = [
                      {name: "grass", number: 53, prefix: "g", container: divGrass},
                      {name: "water", number: 56, prefix: "w", container: divWater},
                      {name: "cliffs", number: 34, prefix: "c", container: divCliff},
                      {name: "flowers", number: 8, prefix: "f", container: divFlowers}
                    ];

categories.forEach((category) => {
  for (let i = 0; i < category.number; i++) {
    const image = new Image();
    image.src = `${imageFolder}${category.name}/${category.prefix}${i}.png`;
    category.container.appendChild(image);
  }
});

let selectedImage;
for (let i = 0; i < canvas.width; i += tileSize) {
  for (let j = 0; j < canvas.height; j += tileSize) {
    ctx.rect(i, j, tileSize, tileSize);
  }
}

canvas.addEventListener("click", (event) => {
  const x = Math.floor(event.offsetX / tileSize) * tileSize;
  const y = Math.floor(event.offsetY / tileSize) * tileSize;
  if (erase) { //on ne pose pas d'image, on efface
    ctx.clearRect(x, y, tileSize, tileSize);
  }

  if(selectedImage) {
    const image = new Image();
    image.src = selectedImage;
    image.onload = () => {
      ctx.drawImage(image, x, y, tileSize, tileSize);
    };
  }
});

//on met les fonctions des boutons ici
function clearButton() {
  //on demande confirmation
  if (confirm("Voulez-vous vraiment tout effacer ?")) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
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
  //onn demande le nom du fichier
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

function exportButton(){ //we export the canvas as a json file
    let data = [];
    //for each tile, we get the image source and the position
    for (let i = 0; i < canvas.width; i += tileSize) {
      for (let j = 0; j < canvas.height; j += tileSize) {
        let imgData = ctx.getImageData(i, j, tileSize, tileSize);
        let dataURL = canvas.toDataURL();
        let src = dataURL;
        data.push({src, i, j});
      }
    }
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
      const image = new Image();
      image.src = tile.src;
      image.onload = () => {
        ctx.drawImage(image, tile.i*tileSize, tile.j*tileSize, tileSize*10, tileSize*10);
      };
    });
  };
  reader.readAsText(file);
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
