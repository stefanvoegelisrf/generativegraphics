import p5, { Vector } from 'p5';

let sketch = function (p5Library: p5) {
    const imageWidth = 600;
    const imageHeight = 800;
    p5Library.preload = function () {

    }

    p5Library.setup = function () {
        p5Library.createCanvas(imageWidth, imageHeight)
        // Create random background color that is a shade of beige
        const backgroundColor= p5Library.color(p5Library.random(230, 245), p5Library.random(218, 245), p5Library.random(166, 220));
        p5Library.background(backgroundColor);
        drawSun();
        drawBackgroundMountains();
        drawForegroundMountains();
        p5Library.randomSeed(0);
    }

    const drawBackgroundMountains = function () {

    }

    const drawForegroundMountains = function () {
        // draw a line in the center with noise
        // line starts at the center and then moves left and right with noise
        // line is made up of points
        // line starts at 1 third of the canvas height and ends at 9/10 of the canvas height
        const mountainMiddleLine: p5.Vector[] = [];
        const noiseScale = 0.02;
        const mountainBase = imageHeight / 10 * 9.5;
        const mountainTop = imageHeight / 3;
        const mountainHeight = mountainBase - mountainTop;
        const mountainPoints = 100;
        const peakVariation = imageWidth / 3;
        const startX = p5Library.random(imageWidth / 3 - peakVariation / 2, imageWidth / 3 * 2 - peakVariation / 2);
        for (let i = 0; i < mountainPoints; i++) {
            const y = i / mountainPoints * mountainHeight + mountainTop;
            const x = p5Library.map(p5Library.noise(i * noiseScale), 0, 1, startX, startX + peakVariation);
            mountainMiddleLine.push(p5Library.createVector(x, y));
        }

        const drawMiddleLine = function () {
            p5Library.push();
            p5Library.noFill();
            p5Library.stroke('black');
            p5Library.beginShape();
            for (let i = 0; i < mountainMiddleLine.length; i++) {
                p5Library.vertex(mountainMiddleLine[i].x, mountainMiddleLine[i].y);
            }
            p5Library.endShape();
            p5Library.pop();
        }
        drawMiddleLine();
    }

    const drawSun = function () {
        // Sun position is in the upper third of the canvas
        // Sun always has at least 10 percent of the image width margin to the left and right(e.g. image width is 600, sun is between 60 and 540)
        const sunPosition = p5Library.createVector(p5Library.random(imageWidth / 10, imageWidth - imageWidth / 10), p5Library.random(imageHeight / 10, imageHeight / 3 - imageHeight / 10));
        // Sun is a circle with a radius of approximately 1/20 of the image width
        const sunRadius = imageWidth / 20;
        // Sun color is either a shade of yellow, red or orange
        const sunColor = p5Library.color(255, p5Library.random(50, 200), 0);
        p5Library.push();
        p5Library.fill(sunColor);
        p5Library.noStroke();
        p5Library.ellipse(sunPosition.x, sunPosition.y, sunRadius, sunRadius);
        p5Library.pop();
    }

    p5Library.draw = function () {
    }

    p5Library.windowResized = function () {
    }
}
let instantiatedSketch = new p5(sketch);