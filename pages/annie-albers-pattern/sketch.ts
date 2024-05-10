import p5 from 'p5';

let sketch = function (p5Library: p5) {


    p5Library.setup = function () {
        p5Library.createCanvas(p5Library.windowWidth, p5Library.windowHeight);
        p5Library.frameRate(1);
    }


    p5Library.draw = function () {
        p5Library.noStroke();
        let cellSize: number;

        if (p5Library.width < p5Library.height) {
            cellSize = p5Library.width / 10;
        } else {
            cellSize = p5Library.height / 10;
        }

        for (let x = 0; x < p5Library.width; x += cellSize) {
            for (let y = 0; y < p5Library.height; y += cellSize) {
                let randomSplit = p5Library.random() < 0.5;
                if (randomSplit) {
                    p5Library.fill(255, 0, 0); // Red
                    p5Library.triangle(x, y, x + cellSize, y, x, y + cellSize);
                    p5Library.fill(169); // Gray
                    p5Library.triangle(x + cellSize, y, x + cellSize, y + cellSize, x, y + cellSize);
                } else {
                    p5Library.fill(255, 0, 0); // Red
                    p5Library.triangle(x, y, x + cellSize, y, x + cellSize, y + cellSize);
                    p5Library.fill(169); // Gray
                    p5Library.triangle(x, y, x, y + cellSize, x + cellSize, y + cellSize);
                }
            }
        }

        p5Library.windowResized = function () {
            p5Library.resizeCanvas(p5Library.windowWidth, p5Library.windowHeight);
        }

    }
}
let instantiatedSketch = new p5(sketch);