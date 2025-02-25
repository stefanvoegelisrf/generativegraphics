import p5 from 'p5';
import GUI from 'lil-gui';

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
        movementNoiseMultiplier: 2.7,
        fillOrStroke: "stroke",
        fillOpacity: 20,
        strokeOpacity: 100,
        enableRotation: false,
        backgroundColor: [0, 0, 0],
        backgroundOpacity: 5,
    }
    let img: p5.Image;
    let brightnessValues = [];

    p5Library.preload = function () {
        img = p5Library.loadImage('./stef.jpg');
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
        calculateBrightness();
    }
    p5Library.draw = function () {
        p5Library.background(
            settings.backgroundColor[0],
            settings.backgroundColor[1],
            settings.backgroundColor[2],
            settings.backgroundOpacity * 0.01 * 255
          );
        
          // Calculate aspect ratio
          let imgAspectRatio = img.width / img.height;
          let canvasAspectRatio = p5Library.width / p5Library.height;
        
          let gridWidth, gridHeight;
          if (canvasAspectRatio > imgAspectRatio) {
            gridHeight = p5Library.height;
            gridWidth = p5Library.height * imgAspectRatio;
          } else {
            gridWidth = p5Library.width;
            gridHeight = p5Library.width / imgAspectRatio;
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
                brightnessValues[i][j] *
                p5Library.min(cellWidth, cellHeight) *
                settings.cellSizeMultiplier;
        
              // Get the color from the image
              let imgX = p5Library.floor(i * (img.width / settings.columns));
              let imgY = p5Library.floor(j * (img.height / settings.rows));
              let imgIndex = 4 * (imgY * img.width + imgX);
              let r = img.pixels[imgIndex];
              let g = img.pixels[imgIndex + 1];
              let b = img.pixels[imgIndex + 2];
              let col = p5Library.color(r, g, b, settings.fillOpacity * 0.01 * 255);
              let strokeCol = p5Library.color(r, g, b, settings.strokeOpacity * 0.01 * 255);
        
              if (settings.fillOrStroke === "fill") {
                p5Library.fill(col);
              } else {
                p5Library.stroke(strokeCol);
              }
        
              p5Library.push();
              p5Library.translate(x, y);
              if (settings.enableRotation) {
                p5Library.rotate(p5Library.noise(i * 0.1, j * 0.1, p5Library.frameCount * 0.01) * p5Library.TWO_PI);
              }
              if (settings.shapeType === "square") {
                p5Library.rectMode(p5Library.CENTER);
                p5Library.rect(0, 0, cellSize, cellSize);
              } else {
                p5Library.ellipse(0, 0, cellSize, cellSize);
              }
              p5Library.pop();
            }
          }
    }

    function calculateBrightness() {
        img.loadPixels();
        let imgWidth = img.width;
        let imgHeight = img.height;
        let cellWidth = imgWidth / settings.columns;
        let cellHeight = imgHeight / settings.rows;
        brightnessValues = [];
        for (let i = 0; i < settings.columns; i++) {
          let col = [];
          for (let j = 0; j < settings.rows; j++) {
            let sumBrightness = 0;
            for (let x = 0; x < cellWidth; x++) {
              for (let y = 0; y < cellHeight; y++) {
                let index = 4 * ((j * cellHeight + y) * imgWidth + (i * cellWidth + x));
                let r = img.pixels[index];
                let g = img.pixels[index + 1];
                let b = img.pixels[index + 2];
                let brightness = (r + g + b) / 3;
                sumBrightness += brightness;
              }
            }
            let avgBrightness = sumBrightness / (cellWidth * cellHeight);
            if (isNaN(avgBrightness)) {
              avgBrightness = 0.01; // Handle NaN values
            }
            col.push(p5Library.map(avgBrightness, 0, 255, 0, 1)); // Map brightness to range 0-1
          }
          brightnessValues.push(col);
        }
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
        gui.add(settings, "columns").name("Columns").min(1).max(200).step(1).onChange(calculateBrightness);
        gui.add(settings, "rows").name("Rows").min(1).max(200).step(1).onChange(calculateBrightness);
        gui.add(settings, "cellSizeMultiplier").name("Cell size multiplier").min(0.5).max(5).step(0.1);
        gui.add(settings, "movementIntensity").name("Movement intensity").min(0.5).max(5).step(0.1);
        gui.add(settings, "sizeNoiseMultiplier").name("Size noise multiplier").min(0.5).max(5).step(0.1);
        gui.add(settings, "movementNoiseMultiplier").name("Movement noise multiplier").min(0.5).max(5).step(0.1);
        gui.add(settings, "fillOrStroke").name("Fill or stroke").options(["fill", "stroke"])
            .onChange(() => {
                setFillOrStroke();
            });
        gui.add(settings, "fillOpacity").name("Fill opacity").min(0).max(100).step(1);
        gui.add(settings, "strokeOpacity").name("Stroke opacity").min(0).max(100).step(1);
        gui.add(settings, "enableRotation").name("Enable rotation");
        gui.add(settings, "shapeType").name("Shape type").options(["square", "sphere"]);
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
    }
}
let instantiatedSketch = new p5(sketch);
