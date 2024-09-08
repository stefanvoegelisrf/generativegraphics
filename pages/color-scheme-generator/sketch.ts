import p5 from 'p5';
import { GUI } from 'lil-gui';

const settings = {
    baseColor: "#ff00ff",
    rectangleSize: 50,
    verticalGap: 10,
    horizontalGap: 10,
    analogousStep: 30,
    splitComplementaryStep: 30
}
let sketch = function (p5Library: p5) {

    p5Library.setup = function () {
        p5Library.colorMode(p5Library.HSL);
        p5Library.createCanvas(p5Library.windowWidth, p5Library.windowHeight);
        let gui = new GUI();
        gui.addColor(settings, "baseColor");
        gui.add(settings, "rectangleSize", 0, 100);
        gui.add(settings, "verticalGap", 0, 100);
        gui.add(settings, "horizontalGap", 0, 100);
        gui.add(settings, "splitComplementaryStep", 10, 60);
        gui.add(settings, "analogousStep", 10, 60);
    }

    p5Library.draw = function () {

        p5Library.background(0)
        p5Library.noStroke();

        const baseHue = p5Library.hue(settings.baseColor);
        const baseSaturation = p5Library.saturation(settings.baseColor);
        const baseLightness = p5Library.lightness(settings.baseColor);
        const complementaryHue = (baseHue + 180) % 360;
        //complementary
        // base color
        drawColorRectangles([
            p5Library.color(settings.baseColor)
            , p5Library.color([complementaryHue, baseSaturation, baseLightness])
        ]);

        p5Library.translate(0, settings.rectangleSize + settings.verticalGap);

        // split complementary
        drawColorRectangles(
            [
                p5Library.color(settings.baseColor)
                , p5Library.color(complementaryHue - settings.splitComplementaryStep, baseSaturation, baseLightness)
                , p5Library.color(p5Library.color(complementaryHue + settings.splitComplementaryStep, baseSaturation, baseLightness))
            ]
        );

        p5Library.translate(0, settings.rectangleSize + settings.verticalGap);

        // analoguous
        drawColorRectangles(
            [
                p5Library.color(settings.baseColor)
                , p5Library.color(baseHue - settings.analogousStep, baseSaturation, baseLightness)
                , p5Library.color(baseHue + settings.analogousStep, baseSaturation, baseLightness)
            ]
        );

        p5Library.translate(0, settings.rectangleSize + settings.verticalGap);

        // triadic
        drawColorRectangles(
            [
                p5Library.color(settings.baseColor)
                , p5Library.color(baseHue + 120, baseSaturation, baseLightness)
                , p5Library.color(baseHue + -120, baseSaturation, baseLightness)
            ]
        );
    }

    function drawColorRectangles(colors: p5.Color[]) {
        let x = 0;
        for (let color of colors) {
            p5Library.fill(color);
            p5Library.rect(x, 0, settings.rectangleSize, settings.rectangleSize)
            x += settings.rectangleSize + settings.horizontalGap;
        }
    }

    p5Library.windowResized = function () {
        p5Library.resizeCanvas(p5Library.windowWidth, p5Library.windowHeight);
    }

}
let instantiatedSketch = new p5(sketch);