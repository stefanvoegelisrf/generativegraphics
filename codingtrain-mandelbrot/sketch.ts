import p5 from 'p5';

let sketch = function (p: p5) {
    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.pixelDensity(1);
        p.loadPixels();
        let maxIterations = 100;
        for (let x = 0; x < p.width; x++) {
            for (let y = 0; y < p.height; y++) {
                // Get the current coordinates and map them to the complex plane
                let a = p.map(x, 0, p.width, -2.5, 2.5);
                let b = p.map(y, 0, p.height, -2.5, 2.5);

                let iterations = 0;
                let ca = a;
                let cb = b;

                while (iterations < maxIterations) {
                    let aa = a * a - b * b;
                    let bb = 2 * a * b;
                    a = aa + ca;
                    b = bb + cb;
                    if (a + b > 16) {
                        break;
                    }
                    iterations++;
                }

                var brightness = p.map(iterations, 0, maxIterations, 0, 255);

                if(iterations === maxIterations) {
                    brightness = 0;
                }

                let pix = (x + y * p.width) * 4;
                p.pixels[pix + 0] = brightness;
                p.pixels[pix + 1] = brightness;
                p.pixels[pix + 2] = brightness;
                p.pixels[pix + 3] = 255;
            }
        }
        p.updatePixels();
    }
}
let instantiatedSketch = new p5(sketch);