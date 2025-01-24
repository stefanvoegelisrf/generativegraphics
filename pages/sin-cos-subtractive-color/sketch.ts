import p5 from 'p5';
import GUI from 'lil-gui';

let sketch = function (p5Library: p5) {
    let gui: GUI;

    let settings = {
        backgroundColor: { r: 250, g: 250, b: 250 },
        backgroundOpacity: 255,
        amountOfPoints: 500,
        baseDiameter: 50,
        instances: 1
    }

    let side: number;

    p5Library.setup = function () {
        side = getCanvasSize(p5Library.windowWidth, p5Library.windowHeight);
        setBackgroundColor(settings.backgroundColor);
        p5Library.createCanvas(side, side);
        p5Library.noStroke();
        p5Library.blendMode(p5Library.BLEND);
        addGui();
        document.addEventListener("keypress", (event: KeyboardEvent) => {
            if (event.key === "g") {
                hideGui();
            }
        })
    }


    p5Library.draw = function () {
        p5Library.background(settings.backgroundColor.r, settings.backgroundColor.g, settings.backgroundColor.b, settings.backgroundOpacity);

        for (let instance = 0; instance < settings.instances; instance++) {
            let time = (p5Library.millis() + instance * 1000) * 0.001;
            for (let circle = 0; circle < settings.amountOfPoints; circle++) {
                let angle = (p5Library.TWO_PI * circle) / 100;

                let diameter = settings.baseDiameter + 50 * Math.sin(angle);

                let x = side * 0.5 + side * 0.45 * Math.sin(angle - time);
                let y = side * 0.5 + side * 0.45 * Math.cos(angle);

                let r = Math.sin(angle * 2 + time) * 127 + 128 + 200;
                let g = Math.cos(angle * 4 - time) * 127 + 128;
                let b = Math.sin(angle * 5 + time * 2) * 127 + 128 + 200;

                if (r < 127) r += 200 - r;
                p5Library.fill(r, g, b, 10);

                p5Library.ellipse(x, y, diameter, diameter);
            }
        }

    }

    function hideGui() {
        gui.show(gui._hidden)
    }

    p5Library.windowResized = function () {
        side = getCanvasSize(p5Library.windowWidth, p5Library.windowHeight);
        p5Library.resizeCanvas(side, side);
    }

    function setBackgroundColor(color: { r: number, g: number, b: number }) {
        document.querySelector("body")!.style.backgroundColor = `rgb(${color.r},${color.g},${color.b})`;
    }

    function getCanvasSize(width: number, height: number) {
        if (width >= height) {
            return height;
        } else {
            return width;
        }
    }

    function addGui() {
        gui = new GUI();

        gui.addColor(settings, "backgroundColor", 255)
            .name("Background")
            .onChange(setBackgroundColor);


        gui.add(settings, "backgroundOpacity")
            .name("Background opacity")
            .min(0)
            .max(255)
            .step(1);

        gui.add(settings, "amountOfPoints")
            .name("Points")
            .min(20)
            .max(1000)
            .step(1);

        gui.add(settings, "baseDiameter")
            .name("Base diameter")
            .min(10)
            .max(200)
            .step(1);

        gui.add(settings, "instances")
            .min(1)
            .max(20)
            .step(1);
    }

}
let instantiatedSketch = new p5(sketch);