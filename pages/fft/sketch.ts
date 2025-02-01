import p5 from 'p5';
import 'p5/lib/addons/p5.sound';
import midnightShadowUrl from './sound/midnight-shadow.mp3';
import GUI from 'lil-gui';

let sketch = function (p5Library: p5) {
    let sound: p5.SoundFile;
    let fft: p5.FFT;
    let gui: GUI;
    let settings = {
        volume: 1,
        playPause: function () {
            if (!sound) return;
            console.log(sound)
            if (sound.isPlaying()) {
                sound.pause();
            }
            else {
                sound.play();
            }
        }
    }

    p5Library.preload = function () {
        prepareSound(midnightShadowUrl)
    }

    p5Library.setup = function () {
        p5Library.createCanvas(p5Library.windowWidth, p5Library.windowHeight);
        fft = new p5.FFT(.8, 256);
        addGui();
    }
    p5Library.draw = function () {
        p5Library.background(255);
        let spectrum = fft.analyze()
        p5Library.translate(p5Library.width * 0.5 - spectrum.length * 0.5, 0);
        for (let i = 0; i < spectrum.length; i++) {
            let amplitude = spectrum[i];
            let y = p5Library.map(amplitude, 0, 255, p5Library.height, 0);
            p5Library.line(i, p5Library.height, i, y);
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
