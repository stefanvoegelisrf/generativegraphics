import p5 from 'p5';

let sketch = function (p5Library: p5) {
    const density = 'Ñ@#W$9876543210?!abc;:+=-,._ '
    let image: p5.Image;
    let canvasWidth: number;
    let canvasHeight: number;

    p5Library.preload = function () {
        image = p5Library.loadImage('./images/Aefru.JPG');
    }

    p5Library.setup = function () {
        const maxSide = 600;
        const ratio = Math.min(maxSide / image.width, maxSide / image.height);
        canvasWidth = Math.round(image.width * ratio);
        canvasHeight = Math.round(image.height * ratio);
        const imagePixelsPerCanvasPixel = image.width / canvasWidth;
        console.log(canvasWidth, canvasHeight);
        console.log(image.width / canvasWidth, image.height / canvasHeight);
        console.log(ratio);
        p5Library.createCanvas(canvasWidth, canvasHeight);
        image.loadPixels();
        p5Library.background(0);
        p5Library.noStroke();
        const pixelSize = 8;
        for (let x = 0; x < canvasWidth; x++) {
            for (let y = 0; y < canvasHeight; y++) {
                const pixel = image.get(x * imagePixelsPerCanvasPixel * pixelSize, y * imagePixelsPerCanvasPixel * pixelSize);
                const brightness = p5Library.brightness(pixel);
                p5Library.fill(brightness);
                p5Library.textSize(pixelSize);
                p5Library.textAlign(p5Library.CENTER, p5Library.CENTER);
                p5Library.text('a', x * pixelSize, y * pixelSize)
            }
        }
    }


    p5Library.draw = function () {

    }

}
let instantiatedSketch = new p5(sketch);