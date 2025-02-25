import p5, { FFT } from 'p5';
import 'p5/lib/addons/p5.sound';
import arpReverbUrl from '../../sound/arp-reverb.mp3';
import midnightShadowUrl from '../../sound/midnight-shadow.mp3';
import GUI from 'lil-gui';

let sketch = function (p5Library: p5) {
    let sound: p5.SoundFile;
    let fft: p5.FFT;
    let gui: GUI;
    let grid: Array<Array<Array<number>>>;
    let distanceFromCenter: Array<{ x: number, y: number, z: number, distance: number }>;
    let isInitializingGrid = false;
    let smoothing = .8;

    let settings = {
        volume: 1,
        playPause: function () {
            if (!sound) return;
            if (sound.isPlaying()) {
                sound.pause();
            }
            else {
                sound.play();
            }
        },
        boxSize: 50,
        amountOfBoxes: 10,
        spacingMultiplier: .2,
        min: 0,
        strokeColor: { r: 0, g: 0, b: 0 },
        strokeOpacity: 30,
        useSpheres: false,
        noStroke: true,
        boxSizeMultiplierMin: 1,
        boxSizeMultiplierMax: 2
    }

    p5Library.preload = function () {
        prepareSound(midnightShadowUrl);
    }

    p5Library.setup = function () {
        p5Library.createCanvas(p5Library.windowWidth, p5Library.windowHeight, p5Library.WEBGL);
        addGui();
        initializeGrid();
    }
    p5Library.draw = function () {
        p5Library.orbitControl();
        p5Library.background(0);
        if (settings.noStroke) {
            p5Library.noStroke();
        }
        else {
            p5Library.stroke(settings.strokeColor.r, settings.strokeColor.g, settings.strokeColor.b, settings.strokeOpacity);
        }
        p5Library.noFill();
        if (isInitializingGrid) return;
        let spectrum = fft.analyze()

        let totalCubes = settings.amountOfBoxes * settings.amountOfBoxes * settings.amountOfBoxes;
        for (let i = 0; i < totalCubes; i++) {
            let position = distanceFromCenter[i];
            grid[position.x][position.y][position.z] = spectrum[i];
        }

        let offset = settings.boxSize * 0.5 - settings.amountOfBoxes * 0.5 * settings.boxSize;
        p5Library.translate(offset, offset, offset);
        for (let x = 0; x < settings.amountOfBoxes; x++) {
            for (let y = 0; y < settings.amountOfBoxes; y++) {
                for (let z = 0; z < settings.amountOfBoxes; z++) {
                    if (grid[x][y][z] > settings.min) {
                        p5Library.fill(grid[x][y][z], 0, 200, p5Library.map(grid[x][y][z], 0, 255, 20, 70));
                    }
                    else {
                        p5Library.noFill();
                    }
                    p5Library.push();
                    p5Library.translate(x * settings.boxSize, y * settings.boxSize, z * settings.boxSize);
                    if (settings.useSpheres) {
                        p5Library.sphere((settings.boxSize * 0.5 - settings.boxSize * settings.spacingMultiplier) * p5Library.map(grid[x][y][z], 0, 255, settings.boxSizeMultiplierMin, settings.boxSizeMultiplierMax));
                    }
                    else {
                        p5Library.box((settings.boxSize - settings.boxSize * settings.spacingMultiplier) * p5Library.map(grid[x][y][z], 0, 255, settings.boxSizeMultiplierMin, settings.boxSizeMultiplierMax));
                    }
                    p5Library.pop();
                }
            }
        }
    }

    p5Library.windowResized = function () {
        p5Library.resizeCanvas(p5Library.windowWidth, p5Library.windowHeight);
    }

    let initializeGrid = function () {
        isInitializingGrid = true;
        // Adjust the spectrum width to match the amount of boxes
        let spectrumWidth = getNearestPowerOf2(settings.amountOfBoxes * settings.amountOfBoxes * settings.amountOfBoxes);
        fft = new FFT(smoothing, spectrumWidth);
        grid = [];
        distanceFromCenter = [];
        for (let x = 0; x < settings.amountOfBoxes; x++) {
            grid[x] = [];
            for (let y = 0; y < settings.amountOfBoxes; y++) {
                grid[x][y] = [];
                for (let z = 0; z < settings.amountOfBoxes; z++) {
                    grid[x][y][z] = 0;
                    let offset = settings.boxSize * 0.5 - settings.amountOfBoxes * 0.5 * settings.boxSize;
                    let xPosition = x * settings.boxSize + offset;
                    let yPosition = y * settings.boxSize + offset;
                    let zPosition = z * settings.boxSize + offset;
                    // Calculate how much distance this box has from the center
                    let distance = p5Library.dist(xPosition, yPosition, zPosition, 0, 0, 0);
                    distanceFromCenter.push({ x: x, y: y, z: z, distance: distance });
                }
            }
        }
        distanceFromCenter.sort(compareDistance);
        isInitializingGrid = false;
    }

    let compareDistance = function (a: { distance: number }, b: { distance: number }) {
        return a.distance - b.distance;
    }

    let getNearestPowerOf2 = function (gridSize: number) {
        let power = Math.round(Math.log2(gridSize));
        let nearestPower = Math.pow(2, power);

        return Math.min(1024, Math.max(32, nearestPower));
    }

    let prepareSound = function (path: string) {
        sound = p5Library.loadSound(path)
        sound.disconnect();
        sound.connect(fft);
        sound.connect();
    }

    let changeVolume = function (volume: number) {
        if (!sound) return;
        sound.setVolume(volume);
    }


    let addGui = function () {
        gui = new GUI();
        gui.add(settings, "volume")
            .name("volume")
            .min(0)
            .max(1)
            .step(0.01)
            .onChange(changeVolume);

        gui.add(settings, "playPause")
            .name("Toggle sound");

        gui.add(settings, "amountOfBoxes")
            .name("Amount of boxes")
            .min(3)
            .max(20)
            .step(1)
            .onChange(initializeGrid);

        gui.add(settings, "boxSize")
            .name("Box size")
            .min(10)
            .max(200)
            .step(1);

        gui.add(settings, "spacingMultiplier")
            .name("Spacing multiplier")
            .min(.1)
            .max(.8)
            .step(.01);

        gui.add(settings, "min")
            .name("Min")
            .min(0)
            .max(255)
            .step(1);

        gui.addColor(settings, "strokeColor", 255)
            .name("Stroke color");

        gui.add(settings, "strokeOpacity")
            .name("Stroke opacity")
            .min(0)
            .max(255)
            .step(1);

        gui.add(settings, "useSpheres")
            .name("Use spheres");

        gui.add(settings, "noStroke")
            .name("No strokes");

        gui.add(settings, "boxSizeMultiplierMin")
            .name("Box size multiplier min")
            .min(1)
            .max(5)
            .step(1);

        gui.add(settings, "boxSizeMultiplierMax")
            .name("Box size multiplier max")
            .min(1)
            .max(10)
            .step(1);
    }
}
let instantiatedSketch = new p5(sketch);
