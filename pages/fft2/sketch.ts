import p5 from 'p5';
import 'p5/lib/addons/p5.sound';
import arpReverbUrl from './sound/arp-reverb.mp3';
import GUI from 'lil-gui';

let sketch = function (p5Library: p5) {
    let sound: p5.SoundFile;
    let fft: p5.FFT;
    let gui: GUI;

    let spectrumWidth = 32;
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
        amountOfBoxes: 10

    }

    p5Library.preload = function () {
        prepareSound(arpReverbUrl);
    }

    p5Library.setup = function () {
        p5Library.createCanvas(p5Library.windowWidth, p5Library.windowHeight, p5Library.WEBGL);
        fft = new p5.FFT(smoothing, spectrumWidth);
        addGui();
    }
    p5Library.draw = function () {
        p5Library.orbitControl();
        p5Library.background(255);
        p5Library.noFill();
        let spectrum = fft.analyze()

        let waveform = fft.waveform();

        let offset = settings.boxSize * 0.5 - settings.amountOfBoxes * 0.5 * settings.boxSize;
        p5Library.translate(offset, offset, offset);
        for (let x = 0; x < settings.amountOfBoxes; x++) {
            for (let y = 0; y < settings.amountOfBoxes; y++) {
                for (let z = 0; z < settings.amountOfBoxes; z++) {
                    p5Library.push();
                    p5Library.translate(x * settings.boxSize, y * settings.boxSize, z * settings.boxSize);
                    p5Library.box(settings.boxSize);
                    p5Library.pop();
                }
            }
        }
    }

    p5Library.windowResized = function () {
        p5Library.resizeCanvas(p5Library.windowWidth, p5Library.windowHeight);
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

    }
}
let instantiatedSketch = new p5(sketch);
