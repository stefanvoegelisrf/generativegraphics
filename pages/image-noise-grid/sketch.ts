import p5 from 'p5';
import GUI from 'lil-gui';

class DisplayImage {
  width: number;
  height: number;
  brightnessValues: Array<Array<number>>;
  private imageReference: p5.Image;
  constructor(width: number, height: number, imageReference: p5.Image) {
    this.width = width;
    this.height = height;
    this.imageReference = imageReference;
  }
  loadPixels() {
    this.imageReference.loadPixels();
    return this.imageReference.pixels;
  }
}

let sketch = function (p5Library: p5) {
  let gui: GUI;
  let settings = {
    columns: 100,
    rows: 100,
    shapeType: "square",
    blendModeType: p5Library.BLEND,
    cellSizeMultiplier: 3,
    movementIntensity: 0.5,
    sizeNoiseMultiplier: 1,
    movementNoiseMultiplier: 7,
    fillOrStroke: "stroke",
    fillOpacity: 20,
    strokeOpacity: 100,
    enableRotation: true,
    backgroundColor: [255, 255, 255],
    backgroundOpacity: 5,
    toggleImageChangeInterval: toggleImageChangeInterval,
    imageChangeIntervalInMs: 3000,
    frameRate: 30
  }

  const luminanceOrderedArrays = {
    asciiPaulBourke: ["$", "@", "B", "%", "8", "&", "W", "M", "#", "*", "o", "a", "h", "k", "b", "d", "p", "q", "w", "m", "Z", "O", "0", "Q", "L", "C", "J", "U", "Y", "X", "z", "c", "v", "u", "n", "x", "r", "j", "f", "t", "/", "|", "(", ")", "1", "{", "}", "[", "]", "?", "-", "_", "+", "~", "<", ">", "i", "!", "l", "I", ";", ":", "^", "`", "'", ".", " "],
    asciiCodepage437: ["█", "▓", "▒", "░"],
    asciiNumerical: ["0", "8", "9", "6", "4", "5", "2", "3", "1", "7"],
    emoji: ["🍒", "🐞", "🍅", "🦞", "🍁", "🏵️", "🦐", "🍊", "🐅", "🥐", "🐆", "🌞", "🌽", "✨", "🔑", "📀", "🥑", "🌱", "🍀", "🧩", "🦎", "🌿", "🌲", "🪴", "🦠", "♂️", "🩱", "🫂", "🐟", "👟", "🧵", "🫐", "🌌", "🔮", "🪻", "👾", "🍇", "🌆", "⚗️", "🍠", "🧶", "🌺", "🍧", "💒", "🦩", "🌷", "🧼", "🪷", "🌸", "🍥", "💮", "🦷", "🍽️", "☁️"]
  }

  let images: Array<DisplayImage> = [];
  let currentImage: DisplayImage;
  let currentImageIndex = 0;
  let isCalculatingBrightness = false;
  let imageChangeInterval: number | null = null;

  const imagePaths = [
    "./Ankol.png",
    "./Sagom.png",
    "./Chiakla.png",
    "./Sukrup.png",
    "./Kruxeo.png",
    "./Jixul.png",
    "./Povon.png",
    "./Tesu.png",
    "./Noarkog.png",
    "./Mohoy.png",
  ]

  p5Library.preload = function () {
    for (let imagePath of imagePaths) {
      p5Library.loadImage(imagePath, (loadedImage) => {
        images.push(new DisplayImage(loadedImage.width, loadedImage.height, loadedImage));
      });
    }
  }

  p5Library.setup = function () {
    p5Library.createCanvas(p5Library.windowWidth, p5Library.windowHeight);
    addGui();
    document.addEventListener("keypress", (event: KeyboardEvent) => {
      if (event.key === "g") {
        hideGui();
      }
    })
    p5Library.rectMode(p5Library.CENTER);
    setFillOrStroke();
    processImages();
    setFrameRate();
  }
  p5Library.draw = function () {
    p5Library.background(
      settings.backgroundColor[0],
      settings.backgroundColor[1],
      settings.backgroundColor[2],
      settings.backgroundOpacity * 0.01 * 255
    );
    if (isCalculatingBrightness) return;

    // Calculate aspect ratio
    let imageAspectRatio = currentImage.width / currentImage.height;
    let canvasAspectRatio = p5Library.width / p5Library.height;

    let gridWidth: number = p5Library.width;
    let gridHeight: number = p5Library.width / imageAspectRatio;
    if (canvasAspectRatio > imageAspectRatio) {
      gridHeight = p5Library.height;
      gridWidth = p5Library.height * imageAspectRatio;
    }

    let offsetX = (p5Library.width - gridWidth) / 2;
    let offsetY = (p5Library.height - gridHeight) / 2;

    let cellWidth = gridWidth / settings.columns;
    let cellHeight = gridHeight / settings.rows;

    for (let i = 0; i < settings.columns; i++) {
      for (let j = 0; j < settings.rows; j++) {
        let x =
          offsetX +
          i * cellWidth +
          (p5Library.noise(
            i * 0.1,
            j * 0.1,
            p5Library.frameCount * 0.01 * settings.movementNoiseMultiplier
          ) -
            0.5) *
          cellWidth *
          settings.movementIntensity;
        let y =
          offsetY +
          j * cellHeight +
          (p5Library.noise(i * 0.1 + 100, j * 0.1 + 100, p5Library.frameCount * 0.01) - 0.5) *
          cellHeight *
          settings.movementIntensity *
          settings.movementNoiseMultiplier;
        let cellSize =
          currentImage.brightnessValues[i][j] *
          p5Library.min(cellWidth, cellHeight) *
          settings.cellSizeMultiplier;

        let opacity = (settings.fillOrStroke === "fill" ? settings.fillOpacity : settings.strokeOpacity);
        let color = p5Library.color(currentImage.brightnessValues[i][j] * 255, opacity);

        if (settings.fillOrStroke === "fill") {
          p5Library.fill(color);
        } else {
          p5Library.stroke(color);
        }

        p5Library.push();
        p5Library.translate(x, y);
        if (settings.enableRotation) {
          p5Library.rotate(p5Library.noise(i * 0.1, j * 0.1, p5Library.frameCount * 0.01) * p5Library.TWO_PI);
        }
        switch (settings.shapeType) {
          case "square":
            p5Library.rectMode(p5Library.CENTER);
            p5Library.rect(0, 0, cellSize, cellSize);
            break;
          case "sphere":
            p5Library.ellipse(0, 0, cellSize, cellSize);
            break;
          case "asciiPaulBourke":
            let indexFromPaulBourkeArray = Math.floor(p5Library.map(currentImage.brightnessValues[i][j], 0, 1, 0, luminanceOrderedArrays.asciiPaulBourke.length));
            p5Library.text(luminanceOrderedArrays.asciiPaulBourke[indexFromPaulBourkeArray], 0, 0)
            break;
          case "asciiCodepage437":
            let indexFromCodepage437Array = Math.floor(p5Library.map(currentImage.brightnessValues[i][j], 0, 1, 0, luminanceOrderedArrays.asciiCodepage437.length));
            p5Library.text(luminanceOrderedArrays.asciiCodepage437[indexFromCodepage437Array], 0, 0);
            break;
          case "asciiNumerical":
            let indexFromAsciiNumericalArray = Math.floor(p5Library.map(currentImage.brightnessValues[i][j], 0, 1, 0, luminanceOrderedArrays.asciiNumerical.length));
            p5Library.text(luminanceOrderedArrays.asciiNumerical[indexFromAsciiNumericalArray], 0, 0);
            break;
          case "emoji":
            let indexFromEmojiArray = Math.floor(p5Library.map(currentImage.brightnessValues[i][j], 0, 1, 0, luminanceOrderedArrays.emoji.length));
            p5Library.text(luminanceOrderedArrays.emoji[indexFromEmojiArray], 0, 0);
            break;
        }
        p5Library.pop();
      }
    }
  }

  function setFrameRate() {
    p5Library.frameRate(settings.frameRate);
  }

  function processImages() {
    isCalculatingBrightness = true;
    for (let image of images) {
      image.brightnessValues = calculateBrightness(image);
    }
    currentImage = images[currentImageIndex];
    isCalculatingBrightness = false;
  }

  function calculateBrightness(image: DisplayImage) {
    let pixels = image.loadPixels();
    let imgWidth = image.width;
    let imgHeight = image.height;
    let cellWidth = imgWidth / settings.columns;
    let cellHeight = imgHeight / settings.rows;
    let brightnessValues: Array<Array<number>> = [];
    let uniqueBrightnessValues = [];
    for (let i = 0; i < settings.columns; i++) {
      let column: Array<number> = [];
      for (let j = 0; j < settings.rows; j++) {
        let sumBrightness = 0;
        for (let x = 0; x < cellWidth; x++) {
          for (let y = 0; y < cellHeight; y++) {
            let index = 4 * ((j * cellHeight + y) * imgWidth + (i * cellWidth + x));
            let r = pixels[index];
            let g = pixels[index + 1];
            let b = pixels[index + 2];
            let brightness = (r + g + b) / 3;
            sumBrightness += brightness;
          }
        }
        let avgBrightness = sumBrightness / (cellWidth * cellHeight);
        if (isNaN(avgBrightness)) {
          avgBrightness = 0.01; // Handle NaN values
        }
        let normalizedBrightness = p5Library.map(avgBrightness, 0, 255, 0, 1)
        column.push(normalizedBrightness);
        if (uniqueBrightnessValues.find(b => b === normalizedBrightness) === undefined) {
          uniqueBrightnessValues.push(normalizedBrightness);
        }
      }
      brightnessValues.push(column);
    }
    return brightnessValues;
  }

  function imageChangeIntervalChanged() {
    if (imageChangeInterval === null) return;
    clearInterval(imageChangeInterval);
    imageChangeInterval = null;
    toggleImageChangeInterval();
  }

  function toggleImageChangeInterval() {
    if (imageChangeInterval === null) {
      imageChangeInterval = setInterval(() => {
        transitionToNextImage();
      }, settings.imageChangeIntervalInMs);
    }
    else {
      clearInterval(imageChangeInterval);
      imageChangeInterval = null;
    }
  }
  let isTransitioning = false;

  function transitionToNextImage() {
    if (isTransitioning) return;
    isTransitioning = true;
    currentImageIndex = (currentImageIndex + 1) % images.length;
    prepareBrightnessTransition();
  }

  let nextBrightnessValues: number[][] = [];
  let valuesToReplace: { i: number; j: number }[] = [];

  let previousMillis = 0;
  function prepareBrightnessTransition() {
    nextBrightnessValues = images[currentImageIndex].brightnessValues.map(row => [...row]);
    valuesToReplace = [];

    for (let i = 0; i < settings.columns; i++) {
      for (let j = 0; j < settings.rows; j++) {
        if (nextBrightnessValues[i][j] !== undefined) {
          valuesToReplace.push({ i, j });
        }
      }
    }
    replaceNextBatchOfPixels();
  }


  function replaceNextBatchOfPixels() {
    if (!isTransitioning) return;
    let batchSize = settings.columns * settings.rows * 0.05;
    for (let i = 0; i < batchSize; i++) {
      replaceNextBrightnessValue();
    }
    setTimeout(replaceNextBatchOfPixels, 10)
  }

  let valuesReplaced = 0;

  function replaceNextBrightnessValue() {
    if (valuesToReplace.length === 0) {
      replaceCurrentImage();
      return;
    }

    // Pick a random position from available list
    const randomIndex = Math.floor(p5Library.random(0, valuesToReplace.length));
    const { i, j } = valuesToReplace[randomIndex];

    // Apply brightness and remove from the list
    currentImage.brightnessValues[i][j] = nextBrightnessValues[i][j];
    nextBrightnessValues[i][j] = undefined;
    valuesToReplace.splice(randomIndex, 1);
    valuesReplaced++;
    console.log(valuesReplaced)
  }


  function replaceCurrentImage() {
    imageChangeIntervalChanged();
    currentImage = images[currentImageIndex]
    isTransitioning = false;
    nextBrightnessValues = [];
    console.log("Image replaced")
  }

  p5Library.windowResized = function () {
    p5Library.resizeCanvas(p5Library.windowWidth, p5Library.windowHeight);
  }

  function hideGui() {
    gui.show(gui._hidden)
  }

  function setFillOrStroke() {
    if (settings.fillOrStroke === "fill") {
      p5Library.noStroke();
    } else {
      p5Library.noFill();
    }
  }

  let addGui = function () {
    gui = new GUI();
    gui.add(settings, "columns").name("Columns").min(1).max(200).step(1).onChange(processImages);
    gui.add(settings, "rows").name("Rows").min(1).max(200).step(1).onChange(processImages);
    gui.add(settings, "cellSizeMultiplier").name("Cell size multiplier").min(0.5).max(20).step(0.1);
    gui.add(settings, "movementIntensity").name("Movement intensity").min(0.5).max(20).step(0.1);
    gui.add(settings, "sizeNoiseMultiplier").name("Size noise multiplier").min(0.5).max(20).step(0.1);
    gui.add(settings, "movementNoiseMultiplier").name("Movement noise multiplier").min(0.5).max(20).step(0.1);
    gui.add(settings, "fillOrStroke").name("Fill or stroke").options(["fill", "stroke"])
      .onChange(() => {
        setFillOrStroke();
      });
    gui.add(settings, "fillOpacity").name("Fill opacity").min(0).max(255).step(1);
    gui.add(settings, "strokeOpacity").name("Stroke opacity").min(0).max(255).step(1);
    gui.add(settings, "enableRotation").name("Enable rotation");
    gui.add(settings, "shapeType").name("Shape type").options(["square", "sphere", "asciiPaulBourke", "asciiCodepage437", "asciiNumerical", "emoji"]);
    gui.add(settings, "blendModeType").name("Blend mode").options([
      p5Library.BLEND,
      p5Library.ADD,
      p5Library.DARKEST,
      p5Library.LIGHTEST,
      p5Library.DIFFERENCE,
      p5Library.EXCLUSION,
      p5Library.MULTIPLY,
      p5Library.SCREEN,
      p5Library.REPLACE,
      p5Library.REMOVE,
    ]).onChange((blendMode: p5.BLEND_MODE) => {
      p5Library.blendMode(blendMode)
    });
    gui.addColor(settings, "backgroundColor", 100).name("Background color");
    gui.add(settings, "backgroundOpacity").name("Background opacity").min(0).max(100).step(1);
    gui.add(settings, "toggleImageChangeInterval").name("Toggle automatic image change");
    gui.add(settings, "imageChangeIntervalInMs").name("Image change interval in milliseconds").min(500).max(50000).step(100).onChange(imageChangeIntervalChanged);
    gui.add(settings, "frameRate").name("Frame rate").min(1).max(60).step(1).onChange(setFrameRate);
  }
}
let instantiatedSketch = new p5(sketch);
