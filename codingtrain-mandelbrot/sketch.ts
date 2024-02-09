import p5 from 'p5';
import { GUI } from 'lil-gui';

let sketch = function (p: p5) {
    let settings = {
        maxIterations: 100,
        min: -1.5,
        max: 1.5
    }

    p.setup = function () {
        let gui = new GUI();
        p.createCanvas(500, 500);
        p.pixelDensity(1);
        gui.add(settings, 'maxIterations', 0, 1000);
        gui.add(settings, 'min', -10, 10);
        gui.add(settings, 'max', -10, 10);

    }
    p.draw = function () {
        p.loadPixels();

        for (let x = 0; x < p.width; x++) {
            for (let y = 0; y < p.height; y++) {
                // Get the current coordinates and map them to the complex plane
                let a = p.map(x, 0, p.width, settings.min, settings.max);
                let b = p.map(y, 0, p.height, settings.min, settings.max);

                let iterations = 0;
                let ca = a;
                let cb = b;

                while (iterations < settings.maxIterations) {
                    let aa = a * a - b * b;
                    let bb = 2 * a * b;
                    a = aa + ca;
                    b = bb + cb;
                    if (Math.abs(a + b) > 16) {
                        break;
                    }
                    iterations++;
                }

                var brightness = p.map(iterations, 0, settings.maxIterations, 0, 1);
                brightness = p.map(Math.sqrt(brightness), 0, 1, 0, 255);
                if (iterations === settings.maxIterations) {
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