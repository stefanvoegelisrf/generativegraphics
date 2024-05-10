import p5 from 'p5';

let sketch = function (p5Library: p5) {
    let noiseSeeds = [38, 58, 78, 89, 94, 95, 98, 135];
    p5Library.setup = function () {
        p5Library.frameRate(1);
        p5Library.noiseSeed(135);
        p5Library.createCanvas(window.innerWidth, window.innerHeight);
        p5Library.background(0);

        p5Library.translate(p5Library.width / 2, p5Library.height / 2);
        p5Library.stroke(255);
        p5Library.strokeWeight(2);

        drawSnowflake(6);
    }

    const drawSnowflake = (arms: number) => {
        // Number of arms
        for (let i = 0; i < arms; i++) {
            p5Library.push();
            p5Library.rotate(p5Library.TWO_PI / arms * i);
            drawSnowflakeArm();
            p5Library.pop();

            p5Library.push();
            p5Library.rotate(p5Library.TWO_PI / arms * i + p5Library.PI / arms);
            p5Library.scale(-1, 1);
            drawSnowflakeArm();
            p5Library.pop();
        }
    }

    const drawSnowflakeArm = () => {
        const steps = 10;
        const length = 100;

        p5Library.beginShape();
        for (let i = 0; i <= steps; i++) {
            let l = length / steps * i;
            let angle = p5Library.map(p5Library.noise(i * 0.2, p5Library.frameCount * 0.01), 0, 1, -p5Library.PI / 6, p5Library.PI / 6);
            let x = l * p5Library.cos(angle);
            let y = l * p5Library.sin(angle);
            p5Library.vertex(x, y);
        }
        p5Library.endShape();
    }


    p5Library.draw = function () {
    }

    p5Library.windowResized = function () {
    }
}
let instantiatedSketch = new p5(sketch);