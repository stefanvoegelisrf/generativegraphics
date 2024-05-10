import p5 from 'p5';
import Matter, { Engine, Runner, Bodies, Composite, World } from 'matter-js';


let sketch = function (p5Library: p5) {
    let engine: Engine;
    let world: World;
    let ground: Matter.Body;
    let boxes: CustomBox[] = [];
    p5Library.setup = function () {
        p5Library.createCanvas(400, 400);
        engine = Engine.create();
        world = engine.world;
        Runner.run(engine);
        ground = Bodies.rectangle(200, p5Library.height, p5Library.width, 20, { isStatic: true });
        Composite.add(world, ground);
    }

    p5Library.mousePressed = function () {
        boxes.push(new CustomBox(p5Library.mouseX, p5Library.mouseY, p5Library.random(20, 40), p5Library.random(20, 40)));
    }
    p5Library.draw = function () {
        p5Library.background(220);
        for (let customBox of boxes) {
            customBox.show();
        }
    }

    class CustomBox {
        body: Matter.Body;
        width: number;
        height: number;
        constructor(x, y, width, height) {
            this.body = Bodies.rectangle(x, y, width, height, { friction: 0.5, restitution: 1, frictionAir: 0 });
            this.width = width;
            this.height = height;
            Composite.add(world, this.body);
        }
        show = function () {
            var pos = this.body.position;
            var angle = this.body.angle;
            p5Library.push();
            p5Library.translate(pos.x, pos.y);
            p5Library.rotate(angle);
            p5Library.rectMode(p5Library.CENTER);
            p5Library.rect(0, 0, this.width, this.height);
            p5Library.pop();

        }
    }
}
let instantiatedSketch = new p5(sketch);