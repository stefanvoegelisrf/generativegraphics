import p5 from 'p5';

class Grid {
    width: number;
    height: number;
    grid: p5.Color[];
    initialize(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.grid = new Array(width * height).fill(null);
    }

    // Allow us to clear the canvas
    clear() {
        this.grid = new Array(this.width * this.height).fill(null);
    }

    // Allow us to set a specific particle
    set(x: number, y: number, color: p5.Color) {
        this.grid[y * this.width + x] = color;
    }

    // Allow us to swap two particles (or space)
    swap(a: number, b: number) {
        const temp = this.grid[a];
        this.grid[a] = this.grid[b];
        this.grid[b] = temp;
    }

    updatePixel(i) {
        // Get the indices of the pixels directly below
        const below = i + this.width;
        const belowLeft = below - 1;
        const belowRight = below + 1;

        // If there are no pixels below, including diagonals, move it accordingly.
        if (this.isEmpty(below)) {
            this.swap(i, below);
        } else if (this.isEmpty(belowLeft)) {
            this.swap(i, belowLeft);
        } else if (this.isEmpty(belowRight)) {
            this.swap(i, belowRight);
        }
    }

    update() {
        // Draw from the end of the list to the beginning
        for (let i = this.grid.length - this.width - 1; i > 0; i--) {
            this.updatePixel(i);
        }
    }

    // Check if a particle exists in a space
    isEmpty(index: number) {
        return this.grid[index] === null;
    }
}

function varyColor(p: p5, color: p5.Color) {
    let hue = p.floor(p.hue(color));
    let saturation = p.saturation(color) + p.floor(p.random(-20, 0));
    saturation = p.constrain(saturation, 0, 100);
    let lightness = p.lightness(color) + p.floor(p.random(-10, 10));
    lightness = p.constrain(lightness, 0, 100);
    return p.color(hue, saturation, lightness, 255);
}

let sketch = function (p: p5) {
    let background = p.color(0, 0, 0);
    let SAND_COLOR = p.color(34, 35, 100);
    let grid = new Grid();
    let blockSize = 10;
    const setCanvasSize = function () {
        let factorSize = 0.9;
        let squareLength = (p.windowWidth < p.windowHeight ? p.windowWidth : p.windowHeight) * factorSize;
        let rest = squareLength % 10;
        squareLength = squareLength - rest;
        console.log(`Setting canvas size to ${squareLength}`)
        p.resizeCanvas(squareLength, squareLength);
        let gridLength = squareLength / blockSize;
        console.log(`Setting grid length to ${gridLength}`)
        grid.initialize(gridLength, gridLength)
    }

    p.mouseDragged = function () {
        if (p.mouseX < 0 || p.mouseY < 0 || p.mouseX > p.width || p.mouseY > p.height)
            return;
        let color = varyColor(p, SAND_COLOR);
        let x = Math.floor(p.mouseX / blockSize);
        let y = Math.floor(p.mouseY / blockSize);
        console.log(`Setting color ${p.hue(color)},${p.saturation(color)},${p.lightness(color)} at ${x}, ${y}`);
        grid.set(x, y, color);
    }

    p.setup = function () {
        p.pixelDensity(1);
        p.colorMode(p.HSL, 100);
        p.createCanvas(500, 500);
        setCanvasSize();
        p.noStroke();
    }
    p.draw = function () {
        p.background(0);
        // This happens every frame
        // p.loadPixels();
        for (let index = 0; index < grid.grid.length; index++) {
            let colorToSet = grid.grid[index] != null ? grid.grid[index] : background;
            // p.pixels[index * 4] = p.hue(colorToSet);
            // p.pixels[index * 4 + 1] = p.saturation(colorToSet);
            // p.pixels[index * 4 + 2] = p.lightness(colorToSet);
            // p.pixels[index * 4 + 3] = p.alpha(colorToSet);
            p.fill(colorToSet);
            let y = Math.floor(index / grid.width) * blockSize;
            let x = index % grid.width * blockSize;
            p.square(x, y, blockSize);
        }
        // p.updatePixels();
        grid.update();
    }
    p.windowResized = function () {
        setCanvasSize();
    }
}
let instantiatedSketch = new p5(sketch);