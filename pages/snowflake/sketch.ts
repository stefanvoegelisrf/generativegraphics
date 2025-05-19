import p5 from 'p5';
import GUI from 'lil-gui';

let sketch = function (p5Library: p5) {
    let settings = {
        numberOfArms: 6,
        updateNoise: true,
        speed: 1,
        noiseSeed: 135,
        steps: 10,
        stepMultiplier: 0.2,
        length: 300
    }
    p5Library.setup = function () {
        p5Library.noiseSeed(settings.noiseSeed);
        p5Library.createCanvas(window.innerWidth, window.innerHeight);

        p5Library.stroke(255);
        p5Library.strokeWeight(2);

        initializeGui();
    }


    const updateNoiseSeed = function (seed: number) {
        p5Library.noiseSeed(seed);
    }

    p5Library.draw = function () {
        p5Library.background(0);
        p5Library.translate(p5Library.width * 0.5, p5Library.height * 0.5);
        drawSnowflake(settings.numberOfArms);
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
        p5Library.beginShape();
        for (let i = 0; i <= settings.steps; i++) {
            let l = settings.length / settings.steps * i;
            let angle = p5Library.map(p5Library.noise(i * settings.stepMultiplier, (settings.updateNoise ? p5Library.frameCount : 1) * settings.speed * 0.001), 0, 1, -p5Library.PI / 6, p5Library.PI / 6);
            let x = l * p5Library.cos(angle);
            let y = l * p5Library.sin(angle);
            p5Library.vertex(x, y);
        }
        p5Library.vertex(0, settings.length / (settings.steps + 1) * p5Library.sin(-1));
        p5Library.endShape();
    }

    p5Library.windowResized = function () {
        p5Library.resizeCanvas(p5Library.windowWidth, p5Library.windowHeight);
    }
    const initializeGui = function () {
        let gui = new GUI();
        gui.add(settings, "updateNoise");
        gui.add(settings, "speed").min(1).max(10).step(.1);
        gui.add(settings, "numberOfArms").min(2).max(32).step(1);
        gui.add(settings, "steps").min(2).max(100).step(1);
        gui.add(settings, "stepMultiplier").min(0.001).max(0.5).step(0.001);
        gui.add(settings, "length").min(50).max(500).step(1);
        gui.add(settings, "noiseSeed").options([38, 58, 78, 89, 94, 95, 98, 135]).onChange(updateNoiseSeed);
    }
}
let instantiatedSketch = new p5(sketch);