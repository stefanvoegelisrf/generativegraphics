import p5, { Vector } from 'p5';

let sketch = function (p5Library: p5) {
    const imageWidth = 600;
    const imageHeight = 800;

    p5Library.setup = function () {
        p5Library.createCanvas(imageWidth, imageHeight)
        // Create random background color that is a shade of beige
        const backgroundColor = p5Library.color(p5Library.random(230, 245), p5Library.random(218, 245), p5Library.random(166, 220));
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
        const noiseScale = 0.01;
        const mountainBase = imageHeight;
        const mountainTop = imageHeight / 3;
        const mountainHeight = mountainBase - mountainTop;
        const peakVariation = imageWidth / 3;
        const startX = p5Library.random(imageWidth / 3 - peakVariation / 2, imageWidth / 3 * 2 - peakVariation / 2);
        for (let i = 0; i < mountainHeight; i++) {
            const y = i + mountainTop;
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

        // draw mountains left and right of the middle line
        // Start at the top point of the middleline and draw a mountain to the left and one to the right
        // Then move down the middle line for about 1/10th of the line with a random offset
        // Repeat until you reach the bottom of the middle line



        const getNextPosition = function () {
            let randomMin = 50;
            let randomMax = 200;
            return Math.floor(p5Library.random(randomMin, randomMax));
        }
        let currentPosition = 0;
        while (currentPosition < mountainMiddleLine.length) {
            console.log(currentPosition)
            drawMountainHalf(currentPosition, mountainMiddleLine, "left");
            drawMountainHalf(currentPosition, mountainMiddleLine, "right");
            currentPosition += getNextPosition();
        }
    }


    const getRandomMountainColor = function () {
        const randomColor1 = p5Library.random(55, 220);
        const randomColor2 = p5Library.random(55, 170);
        const randomColor3 = p5Library.random(70, 150);
        return [randomColor1, randomColor2, randomColor3];
    }

    const drawMountainHalf = function (startPosition: number, middleline: p5.Vector[], mountainDirection: "left" | "right") {
        const noiseScale = 0.02;
        const mountainColor = p5Library.color(getRandomMountainColor());
        p5Library.push();
        p5Library.stroke(mountainColor);
        let position = startPosition;
        let additionalXDistance = 0;
        let endX = middleline[position].x;
        let startX = middleline[position].x;
        let y = middleline[position].y;
        while (position < middleline.length) {
            startX = middleline[position].x;
            y = middleline[position].y;
            const addDistance = p5Library.noise(y * noiseScale) * 5;
            mountainDirection === "left" ? additionalXDistance -= addDistance : additionalXDistance += addDistance;
            endX = startX + additionalXDistance;
            p5Library.line(startX, y, endX, y);
            position++;
        }
        p5Library.pop();
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