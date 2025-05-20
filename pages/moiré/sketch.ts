import p5 from 'p5';
import GUI from 'lil-gui';

let sketch = function (p5Library: p5) {

    let coordinatesX: number[] = [];
    let coordinatesY: number[] = [];
    let lineAlternationDirection = 1;
    let pointAlternationDirection = 1;
    let settings = {
        amountOfLines: 20,
        alternateLines: true,
        linesMin: 10,
        linesMax: 30,
        lineAlternationSpeed: 5,
        amountOfPoints: 15,
        alternatePoints: true,
        pointsMin: 10,
        pointsMax: 30,
        pointAlternationSpeed: 5,
        backgroundColor: { r: 0, g: 0, b: 0 },
        backgroundOpacity: 255,
        speed: 1,
        movementIntensity: 15,
        strokeWeight: 15
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
                const redValue = p5Library.map(xI, 0, coordinatesX.length, 170, 255);
                const greenValue = p5Library.map(yI, 0, coordinatesY.length, 100, 255);
                const blueValue = p5Library.map(xI * yI, 0, coordinatesX.length * coordinatesY.length, 150, 255);
                p5Library.stroke(redValue, greenValue, blueValue, 255);
                // Upper left corner
                p5Library.point(p5Library.width * 0.5 - (coordinatesX[xI] + additionalX), p5Library.height * 0.5 - coordinatesY[yI]);
                // Upper right corner
                p5Library.point(p5Library.windowWidth * 0.5 + (coordinatesX[xI] - additionalX), p5Library.height * 0.5 - coordinatesY[yI]);
                // Lower left corner
                p5Library.point(p5Library.width * .5 - (coordinatesX[xI] + additionalX), p5Library.height * .5 + coordinatesY[yI]);
                // Lower right corner
                p5Library.point(
                    p5Library.windowWidth * 0.5 + (coordinatesX[xI] - additionalX),
                    p5Library.height * .5 + coordinatesY[yI]
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
        pointsFolder.add(settings, "amountOfPoints").min(1).max(100).step(1).onChange(calculateCoordinates).listen();
        pointsFolder.add(settings, "alternatePoints").listen();
        pointsFolder.add(settings, "pointsMin").min(1).max(100).step(1).listen();
        pointsFolder.add(settings, "pointsMax").min(1).max(100).step(1).listen();
        pointsFolder.add(settings, "pointAlternationSpeed").min(.1).max(50).step(.1).listen();
        let animationFolder = gui.addFolder("Animation");
        animationFolder.add(settings, "speed").min(0.1).max(5).step(.1).listen();
        animationFolder.add(settings, "movementIntensity").min(1).max(50).step(1).listen();
        gui.addColor(settings, "backgroundColor", 255).listen();
        gui.add(settings, "backgroundOpacity").min(1).max(255).step(1).listen();
        gui.add(settings, "strokeWeight").min(1).max(100).step(1).listen();
    }
}
let instantiatedSketch = new p5(sketch);