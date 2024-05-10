import p5 from 'p5';

let sketch = function (p5Library: p5) {
    let x = 0;
    let y = 0;
    let noiseX = 0;
    let noiseY = 0;
    p5Library.setup = function () {
        p5Library.createCanvas(p5Library.windowWidth, p5Library.windowHeight);
        x = p5Library.random(0, p5Library.width);
        y = p5Library.random(0, p5Library.height);
    }

    p5Library.draw = function () {
        // Get noise values for both x and y coordinates
        noiseX += 0.01;
        noiseY += 0.02;

        // Convert noise values to pixel values
        let nx = p5Library.floor(p5Library.noise(noiseX) * p5Library.width);
        let ny = p5Library.floor(p5Library.noise(noiseY) * p5Library.height);

        // Move the circle using the pixel values
        x += (nx - x) / 10;
        y += (ny - y) / 10;

        // Draw the circle
        p5Library.fill(255);
        p5Library.ellipse(x, y, 50, 50);
    }

    p5Library.windowResized = function () {
    }
}
let instantiatedSketch = new p5(sketch);