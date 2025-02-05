import p5 from 'p5';
import 'p5/lib/addons/p5.sound';
import midnightShadowUrl from '../../sound/midnight-shadow.mp3';
import arpReverUrl from '../../sound/arp-reverb.mp3';
import GUI from 'lil-gui';

let sketch = function (p5Library: p5) {
    let sound: p5.SoundFile;
    let fft: p5.FFT;
    let gui: GUI;

    let spectrumWidth = 32;

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
        rectangleWidth: 10
    }

    p5Library.preload = function () {
        prepareSound(midnightShadowUrl)
        // prepareSound(arpReverUrl);
    }

    p5Library.setup = function () {
        p5Library.createCanvas(p5Library.windowWidth, p5Library.windowHeight);
        fft = new p5.FFT(.9, spectrumWidth);
        addGui();
    }
    p5Library.draw = function () {
        p5Library.background(0, 30);
        let spectrum = fft.analyze()
        p5Library.noStroke();

        const bassEnergy = fft.getEnergy("bass");
        p5Library.fill(200, 0, 100, 10);
        p5Library.circle(p5Library.width * 0.5, p5Library.height * 0.5, p5Library.map(bassEnergy, 0, 255, 0, p5Library.width * 0.5));

        const midEnergy = fft.getEnergy("mid");
        p5Library.fill(100, 0, 0, 10);
        p5Library.circle(p5Library.width * 0.5, p5Library.height * 0.5, p5Library.map(midEnergy, 0, 255, 0, p5Library.width * 0.5));

        const trebleEnergy = fft.getEnergy("treble")
        p5Library.fill(100, 0, 200, 10);
        p5Library.circle(p5Library.width * 0.5, p5Library.height * 0.5, p5Library.map(trebleEnergy, 0, 255, 0, p5Library.width * 0.5));

        p5Library.translate(p5Library.width * 0.5 - spectrum.length * settings.rectangleWidth * 0.5, 0);
        for (let i = 0; i < spectrum.length; i++) {
            let amplitude = spectrum[i];
            p5Library.fill(amplitude, 30);
            let y = p5Library.map(amplitude, 0, 255, p5Library.height, 0);
            p5Library.rect(i * settings.rectangleWidth, y, settings.rectangleWidth, p5Library.windowHeight - y);
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

        gui.add(settings, "rectangleWidth")
            .name("Rectangle width")
            .min(1)
            .max(30)
            .step(1);
    }
}
let instantiatedSketch = new p5(sketch);
