import p5 from 'p5';
import GUI from 'lil-gui';

let sketch = function (p5Library: p5) {
    let gui: GUI;
    let settings = {
        columns: 50,
        rows: 50,
        shapeType: "square",
        blendModeType: p5Library.BLEND,
        cellSizeMultiplier: 2.5,
        movementIntensity: 3,
        sizeNoiseMultiplier: 2,
        movementNoiseMultiplier: 2.7,
        fillOrStroke: "stroke",
        fillOpacity: 50,
        strokeOpacity: 40,
        enableRotation: true,
        backgroundColor: [0, 0, 0],
        backgroundColorHSB: [0, 0, 0],
        backgroundOpacity: 5,
    }


    p5Library.setup = function () {
        p5Library.createCanvas(p5Library.windowWidth, p5Library.windowHeight);
        p5Library.colorMode(p5Library.HSB, 360, 100, 100);
        addGui();
        document.addEventListener("keypress", (event: KeyboardEvent) => {
            if (event.key === "g") {
                hideGui();
            }
        })
        p5Library.rectMode(p5Library.CENTER);
        setFillOrStroke();
    }
    p5Library.draw = function () {
        p5Library.background(
            settings.backgroundColorHSB[0],
            settings.backgroundColorHSB[1],
            settings.backgroundColorHSB[2],
            settings.backgroundOpacity * 0.01
        );
        let cellWidth = p5Library.width / settings.columns;
        let cellHeight = p5Library.height / settings.rows;
        for (let i = 0; i < settings.columns; i++) {
            for (let j = 0; j < settings.rows; j++) {
                let x =
                    i * cellWidth +
                    (p5Library.noise(
                        i * 0.1,
                        j * 0.1,
                        p5Library.frameCount * 0.01 * settings.movementNoiseMultiplier
                    ) -
                        0.5) *
                    cellWidth *
                    settings.movementIntensity;
                let y =
                    j * cellHeight +
                    (p5Library.noise(i * 0.1 + 100, j * 0.1 + 100, p5Library.frameCount * 0.01) - 0.5) *
                    cellHeight *
                    settings.movementIntensity *
                    settings.movementNoiseMultiplier;
                let cellSize =
                    p5Library.noise(
                        i * 0.1,
                        j * 0.1,
                        p5Library.frameCount * 0.01 * settings.sizeNoiseMultiplier
                    ) *
                    p5Library.min(cellWidth, cellHeight) *
                    settings.cellSizeMultiplier;
                let hue = p5Library.map(p5Library.noise(i * 0.1, j * 0.1, p5Library.frameCount * 0.01), 0, 1, 270, 360); // Adjusted hue range for pink, purple, orange, and red
                let col = p5Library.color(hue, 100, 100, settings.fillOpacity * 0.01);
                let strokeCol = p5Library.color(hue, 100, 100, settings.strokeOpacity * 0.01);

                if (settings.fillOrStroke === "fill") {
                    p5Library.fill(col);
                } else {
                    p5Library.stroke(strokeCol);
                }

                p5Library.push();
                p5Library.translate(x, y);
                if (settings.enableRotation) {
                    p5Library.rotate(p5Library.noise(i * 0.1, j * 0.1, p5Library.frameCount * 0.01) * p5Library.TWO_PI);
                }
                if (settings.shapeType === "square") {
                    p5Library.rect(0, 0, cellSize, cellSize);
                } else {
                    p5Library.ellipse(0, 0, cellSize, cellSize);
                }
                p5Library.pop();
            }
        }
    }

    p5Library.windowResized = function () {
        p5Library.resizeCanvas(p5Library.windowWidth, p5Library.windowHeight);
    }

    function hideGui() {
        gui.show(gui._hidden)
    }

    function setFillOrStroke() {
        if (settings.fillOrStroke === "fill") {
            p5Library.noStroke();
        } else {
            p5Library.noFill();
        }
    }

    let addGui = function () {
        gui = new GUI();
        gui.add(settings, "columns").name("Columns").min(1).max(50).step(1);
        gui.add(settings, "rows").name("Rows").min(1).max(50).step(1);
        gui.add(settings, "cellSizeMultiplier").name("Cell size multiplier").min(0.5).max(20).step(0.1);
        gui.add(settings, "movementIntensity").name("Movement intensity").min(0.5).max(20).step(0.1);
        gui.add(settings, "sizeNoiseMultiplier").name("Size noise multiplier").min(0.5).max(20).step(0.1);
        gui.add(settings, "movementNoiseMultiplier").name("Movement noise multiplier").min(0.5).max(5).step(0.1);
        gui.add(settings, "fillOrStroke").name("Fill or stroke").options(["fill", "stroke"])
            .onChange(() => {
                setFillOrStroke();
            });
        gui.add(settings, "fillOpacity").name("Fill opacity").min(0).max(100).step(1);
        gui.add(settings, "strokeOpacity").name("Stroke opacity").min(0).max(100).step(1);
        gui.add(settings, "enableRotation").name("Enable rotation");
        gui.add(settings, "shapeType").name("Shape type").options(["square", "sphere"]);
        gui.add(settings, "blendModeType").name("Blend mode").options([
            p5Library.BLEND,
            p5Library.ADD,
            p5Library.DARKEST,
            p5Library.LIGHTEST,
            p5Library.DIFFERENCE,
            p5Library.EXCLUSION,
            p5Library.MULTIPLY,
            p5Library.SCREEN,
            p5Library.REPLACE,
            p5Library.REMOVE,
        ]).onChange((blendMode: p5.BLEND_MODE) => {
            p5Library.blendMode(blendMode)
        });
        gui.addColor(settings, "backgroundColor", 100).name("Background color").onChange((changedColor) => {
            settings.backgroundColorHSB = rgbToHsb(changedColor);
        });
        gui.add(settings, "backgroundOpacity").name("Background opacity").min(0).max(100).step(1);
    }
    function rgbToHsb(rgb: []) {
        let [r, g, b] = rgb.map((v) => v / 255);
        let max = Math.max(r, g, b),
            min = Math.min(r, g, b),
            delta = max - min;
        let hue =
            delta === 0
                ? 0
                : max === r
                    ? (g - b) / delta + (g < b ? 6 : 0)
                    : max === g
                        ? (b - r) / delta + 2
                        : (r - g) / delta + 4;
        hue = Math.round(hue * 60) % 360;
        let saturation = max === 0 ? 0 : delta / max;
        let brightness = max;
        return [
            Math.round(hue),
            Math.round(saturation * 100),
            Math.round(brightness * 100),
        ];
    }
}
let instantiatedSketch = new p5(sketch);
