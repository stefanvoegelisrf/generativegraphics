import p5 from 'p5';
import GUI from 'lil-gui';

interface StarfieldSettings {
    shape: "circle" | "square";
    speed: number;
    backgroundOpacity: number,
    amount: number,
    minSize: number,
    maxSize: number,
    enableRotation: boolean
    rotationSpeed: number
}

class Star {
    x: number;
    y: number;
    z: number;
    rotation: number;
    rotationDirection: number;
    constructor(p: p5) {
        this.setRandomXY(p);
        this.z = p.random(p.width);
        this.rotation = p.random(0, 360);
        const directions = [-1, 1];
        this.rotationDirection = directions[Math.ceil(p.random(-.5, .5))];
    }

    update(p: p5, speed: number) {
        this.z = this.z - speed;
        if (this.z < 1) {
            this.z = p.width;
            this.setRandomXY(p);
        }
    }

    setRandomXY(p: p5) {
        this.x = p.random(-p.width * 0.5, p.width * 0.5);
        this.y = p.random(-p.height * 0.5, p.height * 0.5);
    }

    show(p: p5, shape: "square" | "circle", minSize: number, maxSize: number, rotationEnabled: boolean, rotationSpeed: number) {
        p.fill(255);
        p.noStroke();
        let sx = p.map(this.x / this.z, 0, 1, 0, p.width);
        let sy = p.map(this.y / this.z, 0, 1, 0, p.height);
        let size = p.map(this.z, 0, p.width, maxSize, minSize);
        if (rotationEnabled) {
            this.rotation += rotationSpeed * this.rotationDirection;
            p.rotate(this.rotation);
        }
        shape === "square" ? p.rect(sx, sy, size, size) : p.ellipse(sx, sy, size, size);
    }
}

let sketch = function (p5Library: p5) {
    let stars: Star[] = [];
    let settings: StarfieldSettings = {
        shape: "square",
        speed: 10,
        backgroundOpacity: 33,
        amount: 400,
        minSize: 0,
        maxSize: 16,
        enableRotation: true,
        rotationSpeed: 10
    }
    const setCanvasSize = function () {
        p5Library.resizeCanvas(p5Library.windowWidth, p5Library.windowHeight);
    }

    p5Library.setup = function () {
        p5Library.createCanvas(p5Library.windowWidth, p5Library.windowHeight);
        initializeStars();
        initializeGui();
    }
    p5Library.draw = function () {
        p5Library.background(0, 0, 0, settings.backgroundOpacity);
        p5Library.translate(p5Library.width * 0.5, p5Library.height * 0.5);
        for (let i = 0; i < stars.length; i++) {
            p5Library.push();
            stars[i].update(p5Library, settings.speed);
            stars[i].show(p5Library, settings.shape, settings.minSize, settings.maxSize, settings.enableRotation, settings.rotationSpeed * 0.01);
            p5Library.pop();
        }
    }
    p5Library.windowResized = function () {
        setCanvasSize();
    }
    const initializeGui = function () {
        let gui = new GUI();
        gui.add(settings, "shape").options(["circle", "square"]);
        gui.add(settings, "speed").min(1).max(100).step(1);
        gui.add(settings, "backgroundOpacity").min(1).max(255).step(1);
        gui.add(settings, "amount").min(1).max(2000).step(1).onChange(initializeStars);
        gui.add(settings, "minSize").min(0).max(50).step(1);
        gui.add(settings, "maxSize").min(1).max(300).step(1);
        gui.add(settings, "enableRotation");
        gui.add(settings, "rotationSpeed").min(1).max(20).step(1);
    }
    const initializeStars = function () {
        stars.splice(0, stars.length);
        for (let i = 0; i < settings.amount; i++) {
            stars.push(new Star(p5Library));
        }
    }
}
let instantiatedSketch = new p5(sketch);