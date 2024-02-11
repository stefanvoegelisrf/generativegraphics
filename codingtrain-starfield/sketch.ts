import p5 from 'p5';

class Star {
    x: number;
    y: number;
    z: number;
    speed: number = 10;

    constructor(p: p5) {
        this.setRandomXY(p);
        this.z = p.random(p.width);
    }

    update(p: p5) {
        this.z = this.z - this.speed;
        if (this.z < 1) {
            this.z = p.width;
            this.setRandomXY(p);
        }
    }

    setRandomXY(p: p5) {
        this.x = p.random(-p.width * 0.5, p.width * 0.5);
        this.y = p.random(-p.height * 0.5, p.height * 0.5);
    }

    show(p: p5) {
        p.fill(255);
        p.noStroke();
        let sx = p.map(this.x / this.z, 0, 1, 0, p.width);
        let sy = p.map(this.y / this.z, 0, 1, 0, p.height);
        let size = p.map(this.z, 0, p.width, 16, 0);
        p.ellipse(sx, sy, size, size);
    }
}

let sketch = function (p: p5) {
    let stars: Star[] = [];
    const setCanvasSize = function () {
        let factorSize = 0.9;
        let squareLength = (p.windowWidth < p.windowHeight ? p.windowWidth : p.windowHeight) * factorSize;
        squareLength = Math.floor(squareLength);
        p.resizeCanvas(squareLength, squareLength);
    }

    p.setup = function () {
        p.createCanvas(500, 500);
        setCanvasSize();
        for (let i = 0; i < 400; i++) {
            stars.push(new Star(p));
        }
    }
    p.draw = function () {
        p.background(0, 0, 0, 33);
        p.translate(p.width * 0.5, p.height * 0.5);
        for (let i = 0; i < stars.length; i++) {
            stars[i].update(p);
            stars[i].show(p);
        }
    }
    p.windowResized = function () {
        setCanvasSize();
    }
}
let instantiatedSketch = new p5(sketch);