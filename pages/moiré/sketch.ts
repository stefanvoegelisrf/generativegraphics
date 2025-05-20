import p5 from 'p5';
import GUI from 'lil-gui';

let sketch = function (p5Library: p5) {

    let coordinatesX: number[] = [];
    let coordinatesY: number[] = [];
    let lineAlternationDirection = 1;
    let pointAlternationDirection = 1;
    let settings = {
        amountOfLines: 2,
        alternateLines: true,
        linesMin: 1,
        linesMax: 22,
        lineAlternationSpeed: 50,
        amountOfPoints: 2,
        alternatePoints: true,
        pointsMin: 1,
        pointsMax: 8,
        pointAlternationSpeed: 50,
        backgroundColor: { r: 0, g: 0, b: 0 },
        backgroundOpacity: 30,
        speed: 1,
        movementIntensity: 25,
        strokeWeight: 25,
        redMin: 215,
        redMax: 255,
        greenMin: 100,
        greenMax: 255,
        blueMin: 150,
        blueMax: 255,
        scale: .5
    }

    function calculateCoordinates() {
        coordinatesX = [];
        const distanceX = p5Library.windowWidth / settings.amountOfLines;
        for (let i = 0; i < settings.amountOfLines; i++) {
            coordinatesX.push(distanceX * 0.5 * (i + 1));
        }
        coordinatesX = [...coordinatesX, ...([...coordinatesX].reverse())];
        coordinatesY = [];
        const distanceY = p5Library.windowHeight / settings.amountOfPoints;
        for (let i = 0; i < settings.amountOfPoints; i++) {
            coordinatesY.push(distanceY * 0.5 * (i + 1));
        }
        coordinatesY = [...coordinatesY, ...([...coordinatesY].reverse())];
    }

    p5Library.setup = function () {
        p5Library.createCanvas(p5Library.windowWidth, p5Library.windowHeight);
        initializeGui();
        calculateCoordinates();
    }


    p5Library.draw = function () {
        p5Library.background(settings.backgroundColor.r, settings.backgroundColor.g, settings.backgroundColor.b, settings.backgroundOpacity);
        p5Library.translate(p5Library.width * (1 - settings.scale) * .5, p5Library.height * (1 - settings.scale) * .5);
        p5Library.scale(settings.scale);
        p5Library.strokeWeight(settings.strokeWeight);
        if (settings.alternateLines) {
            if (settings.amountOfLines <= settings.linesMin || settings.amountOfLines >= settings.linesMax) {
                lineAlternationDirection *= -1;
            }
            settings.amountOfLines += lineAlternationDirection * settings.lineAlternationSpeed * 0.01;
        }
        if (settings.alternatePoints) {
            if (settings.amountOfPoints <= settings.pointsMin || settings.amountOfPoints >= settings.pointsMax) {
                pointAlternationDirection *= -1;
            }
            settings.amountOfPoints += pointAlternationDirection * settings.pointAlternationSpeed * 0.01;
        }
        if (settings.alternateLines || settings.alternatePoints) calculateCoordinates();
        for (let xI = 0; xI < coordinatesX.length; xI++) {
            for (let yI = 0; yI < coordinatesY.length - xI; yI++) {
                let additionalX = Math.sin(p5Library.millis() * settings.speed * 0.01 - xI) * settings.movementIntensity;
                const redValue = p5Library.map(xI, 0, coordinatesX.length, settings.redMin, settings.redMax);
                const greenValue = p5Library.map(yI, 0, coordinatesY.length, settings.greenMin, settings.greenMax);
                const blueValue = p5Library.map(xI * yI, 0, coordinatesX.length * coordinatesY.length, settings.blueMin, settings.blueMax);
                p5Library.stroke(redValue, greenValue, blueValue, 255);
                // Upper left corner
                p5Library.point(p5Library.width * 0.5 - (coordinatesX[xI] + additionalX), p5Library.height * 0.5 + settings.strokeWeight * .5 - coordinatesY[yI]);
                // Upper right corner
                p5Library.point(p5Library.windowWidth * 0.5 + (coordinatesX[xI] - additionalX), p5Library.height * 0.5 + settings.strokeWeight * .5 - coordinatesY[yI]);
                // Lower left corner
                p5Library.point(p5Library.width * .5 - (coordinatesX[xI] + additionalX), p5Library.height * .5 - settings.strokeWeight * .5 + coordinatesY[yI]);
                // Lower right corner
                p5Library.point(
                    p5Library.windowWidth * 0.5 + (coordinatesX[xI] - additionalX),
                    p5Library.height * .5 + coordinatesY[yI] - settings.strokeWeight * .5
                );
            }
        }
    }

    p5Library.windowResized = function () {
        p5Library.resizeCanvas(p5Library.windowWidth, p5Library.windowHeight);
        calculateCoordinates()
    }
    const initializeGui = function () {
        let gui = new GUI();
        let lineFolder = gui.addFolder("Lines");
        lineFolder.add(settings, "amountOfLines").min(1).max(100).step(1).onChange(calculateCoordinates).listen();
        lineFolder.add(settings, "alternateLines").listen();
        lineFolder.add(settings, "linesMin").min(1).max(100).step(1).listen();
        lineFolder.add(settings, "linesMax").min(1).max(100).step(1).listen();
        lineFolder.add(settings, "lineAlternationSpeed").min(.1).max(50).step(.1).listen();
        let pointsFolder = gui.addFolder("Points");
        pointsFolder.add(settings, "strokeWeight").min(1).max(100).step(1).listen();
        pointsFolder.add(settings, "amountOfPoints").min(1).max(100).step(1).onChange(calculateCoordinates).listen();
        pointsFolder.add(settings, "alternatePoints").listen();
        pointsFolder.add(settings, "pointsMin").min(1).max(100).step(1).listen();
        pointsFolder.add(settings, "pointsMax").min(1).max(100).step(1).listen();
        pointsFolder.add(settings, "pointAlternationSpeed").min(.1).max(50).step(.1).listen();
        let animationFolder = gui.addFolder("Animation");
        animationFolder.add(settings, "speed").min(0.1).max(5).step(.1).listen();
        animationFolder.add(settings, "movementIntensity").min(1).max(50).step(1).listen();
        let backgroundFolder = gui.addFolder("Background")
        backgroundFolder.addColor(settings, "backgroundColor", 255).listen();
        backgroundFolder.add(settings, "backgroundOpacity").min(1).max(255).step(1).listen();
        let colorFolder = gui.addFolder("Color");
        colorFolder.add(settings, "redMin").min(0).max(255).step(1);
        colorFolder.add(settings, "redMax").min(0).max(255).step(1);
        colorFolder.add(settings, "greenMin").min(0).max(255).step(1);
        colorFolder.add(settings, "greenMax").min(0).max(255).step(1);
        colorFolder.add(settings, "blueMin").min(0).max(255).step(1);
        colorFolder.add(settings, "blueMax").min(0).max(255).step(1);
        gui.add(settings, "scale").min(.1).max(1).step(.1).listen();
    }
}
let instantiatedSketch = new p5(sketch);