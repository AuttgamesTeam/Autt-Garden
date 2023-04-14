const canvas = document.getElementById("drawing-canvas");
const ctx = canvas.getContext("2d");
const imageContainer = document.getElementById("image-container");
const tileSize = 50;

const images = [
    "/assets/tile001.png",
    "/assets/tile002.png",
    "/assets/tile003.png",
    "/assets/tile004.png",
    "/assets/tile005.png",
    "/assets/tile006.png",
    "/assets/tile007.png",
    "/assets/tile008.png",
    "/assets/tile009.png",
    "/assets/tile010.png",
    "/assets/tile011.png",
    "/assets/tile012.png",
    "/assets/tile013.png",
    "/assets/tile014.png",
    "/assets/tile015.png",
    "/assets/tile016.png",
    "/assets/tile017.png",
    "/assets/tile018.png",
    "/assets/tile019.png",
    "/assets/tile020.png",
    "/assets/tile021.png",
    "/assets/tile022.png",
    "/assets/tile023.png",
    "/assets/tile024.png",
    "/assets/tile025.png",
    "/assets/tile026.png",
    "/assets/tile027.png",
    "/assets/tile028.png",
    "/assets/tile029.png",
    "/assets/tile030.png",
    "/assets/tile031.png",
    "/assets/tile032.png",
    "/assets/tile033.png",
    "/assets/tile034.png",
    "/assets/tile035.png",
    "/assets/tile036.png",
    "/assets/tile037.png",
    "/assets/tile038.png",
    "/assets/tile039.png",
    "/assets/tile040.png",
    "/assets/tile041.png",
    "/assets/tile042.png",
    "/assets/tile043.png",
    "/assets/tile044.png",
    "/assets/tile045.png",
    "/assets/tile046.png",
    "/assets/tile047.png",
    "/assets/tile048.png",
    "/assets/tile049.png",
    "/assets/tile050.png",
    "/assets/tile051.png",
    "/assets/tile057.png",
    "/assets/tile058.png",
    "/assets/tile059.png",
    "/assets/tile060.png",
    "/assets/tile061.png",
    "/assets/tile062.png",
    "/assets/tile063.png",
    "/assets/tile064.png",
    "/assets/tile065.png",
    "/assets/tile066.png",
    "/assets/tile067.png",
    "/assets/tile068.png",
    "/assets/tile069.png",
    "/assets/tile070.png",
    "/assets/tile071.png",
    "/assets/tile072.png",
    "/assets/tile073.png",
    "/assets/tile074.png",
    "/assets/tile075.png",
    "/assets/tile076.png",
    "/assets/tile077.png",
    "/assets/tile078.png",
    "/assets/tile079.png",
    "/assets/tile080.png",
    "/assets/tile081.png",
    "/assets/tile082.png",
    "/assets/tile083.png",
    "/assets/tile084.png",
    "/assets/tile085.png",
    "/assets/tile086.png",
    "/assets/tile087.png",
    "/assets/tile088.png",
    "/assets/tile089.png",
    "/assets/tile090.png",
    "/assets/tile091.png",
    "/assets/tile092.png",
    "/assets/tile093.png",
    "/assets/tile094.png",
    "/assets/tile095.png",
    "/assets/tile096.png",
    "/assets/tile097.png",
    "/assets/tile098.png",
    "/assets/tile099.png",
    "/assets/tile100.png",
    "/assets/tile101.png",
    "/assets/tile102.png",
    "/assets/tile103.png",
    "/assets/tile104.png",
    "/assets/tile112.png",
    "/assets/tile113.png",
    "/assets/tile114.png",
    "/assets/tile115.png",
    "/assets/tile116.png",
    "/assets/tile117.png",
    "/assets/tile118.png",
    "/assets/tile120.png",
    "/assets/tile122.png",
    "/assets/tile123.png",
    "/assets/tile124.png",
    "/assets/tile126.png",
    "/assets/tile127.png",
    "/assets/tile128.png",
    "/assets/tile129.png",
    "/assets/tile130.png",
    "/assets/tile131.png",
    "/assets/tile132.png",
    "/assets/tile134.png",
    "/assets/tile135.png",
    "/assets/tile136.png",
    "/assets/tile137.png",
    "/assets/tile138.png",
    "/assets/tile139.png",
    "/assets/tile140.png",
    "/assets/tile142.png",
    "/assets/tile143.png",
    "/assets/tile144.png",
    "/assets/tile145.png",
    "/assets/tile146.png",
    "/assets/tile147.png",
    "/assets/tile148.png",

];

let selectedImage;

for (let i = 0; i < canvas.width; i += tileSize) {
  for (let j = 0; j < canvas.height; j += tileSize) {
    ctx.rect(i, j, tileSize, tileSize);
  }
}

images.forEach((image) => {
  const img = new Image();
  img.src = image;
  img.addEventListener("click", () => {
    selectedImage = image;
  });
  imageContainer.appendChild(img);
});

canvas.addEventListener("click", (event) => {
  const x = Math.floor(event.offsetX / tileSize) * tileSize;
  const y = Math.floor(event.offsetY / tileSize) * tileSize;
  if (selectedImage) {
    const image = new Image();
    image.src = selectedImage;
    image.onload = () => {
      ctx.drawImage(image, x, y, tileSize, tileSize);
    };
  }
  window.oncontextmenu = (e) => {
    e.preventDefault()
    console.log('right clicked')
  }
});


