// module aliases
var Engine = Matter.Engine,
    // Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

var engine;
var world;
var boxes = [];
var ground;

class CustomBox {
    constructor(x, y, width, height) {
        this.body = Bodies.rectangle(x, y, width, height, { friction: 0.5, restitution: 1, airFriction: 0 });
        this.width = width;
        this.height = height;
        Composite.add(world, this.body);
    }
    show = function () {
        var pos = this.body.position;
        var angle = this.body.angle;
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        rect(0, 0, this.width, this.height);
        pop();

    }
}

function setup() {
    createCanvas(400, 400);
    engine = Engine.create();
    world = engine.world;
    Runner.run(engine);
    ground = Bodies.rectangle(200, height, width, 10, { isStatic: true });
    Composite.add(world, ground);
}

function mousePressed() {
    let newBox = new CustomBox(mouseX, mouseY, 20, 20);
    boxes.push(newBox);
}

function draw() {
    background(220);
    for (let customBox of boxes) {
        customBox.show();
    }
}