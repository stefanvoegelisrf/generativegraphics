import p5 from 'p5';

let sketch = function (p5Library: p5) {
    const density = 'Ñ@#W$9876543210?!abc;:+=-,._ '
    const invertedDensity = ' _.,-=+:;cba!?0123456789$W#@Ñ'
    let image: p5.Image;
    let canvasWidth: number;
    let canvasHeight: number;
    let pixelBrightness: number[][];
    const pixelSize = 8;

    p5Library.preload = function () {
        image = p5Library.loadImage('./images/logo_original_with_background_1000x600.png');
    }

    p5Library.setup = function () {
        const maxSide = 600;
        const ratio = Math.min(maxSide / image.width, maxSide / image.height);
        canvasWidth = Math.round(image.width * ratio);
        canvasHeight = Math.round(image.height * ratio);
        p5Library.createCanvas(canvasWidth, canvasHeight);
        p5Library.frameRate(1);
        pixelBrightness = new Array(canvasWidth).fill(0).map(() => new Array(canvasHeight).fill(0));
        image.loadPixels();
        const imagePixelsPerCanvasPixel = image.width / canvasWidth;
        p5Library.noStroke();
        p5Library.fill(255);
        p5Library.textSize(pixelSize);
        p5Library.textAlign(p5Library.CENTER, p5Library.CENTER);
        for (let x = 0; x < canvasWidth; x++) {
            for (let y = 0; y < canvasHeight; y++) {
                const pixel = image.get(x * imagePixelsPerCanvasPixel * pixelSize, y * imagePixelsPerCanvasPixel * pixelSize);
                let brightness = p5Library.brightness(pixel);
                pixelBrightness[x][y] = brightness;
            }
        }
    }



    p5Library.draw = function () {
        p5Library.background(0);
        for (let x = 0; x < canvasWidth; x++) {
            for (let y = 0; y < canvasHeight; y++) {
                let brightness = pixelBrightness[x][y];
                brightness += p5Library.noise((x + 1) * (y + 1) * p5Library.millis() * 0.001) * 50;
                let letterIndex = Math.floor(p5Library.map(brightness, 0, 255, invertedDensity.length - 1, 0));
                p5Library.text(invertedDensity[letterIndex], x * pixelSize, y * pixelSize)
            }
        }
    }

}
let instantiatedSketch = new p5(sketch);