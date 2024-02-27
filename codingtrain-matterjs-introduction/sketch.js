// module aliases
var Engine = Matter.Engine,
    // Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

var engine;
var world;
var testBox;

class CustomBox {
    constructor(x, y, width, height) {
        this.body = Bodies.rectangle(x, y, width, height);
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
        rect(0, 0, this.width, this.height);
        pop();

    }
}

function setup() {
    createCanvas(400, 400);
    engine = Engine.create();
    world = engine.world;
    testBox = new CustomBox(200, 200, 80, 80);
    Composite.add(world, testBox);
    Runner.run(engine);
}

function draw() {
    background(220);
    testBox.show();
}