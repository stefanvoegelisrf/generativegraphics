import p5, { Vector } from 'p5';

let sketch = function (p5Library: p5) {
    let points: Vector[][] = [];
    let letters: string[] = [];
    let fontSize = 70;
    let phrase = "Generative Art";
    let noiseOffset = 0;

    p5Library.setup = function () {
        p5Library.createCanvas(p5Library.windowWidth, p5Library.windowHeight);
        p5Library.loop(); // Enable continuous drawing
        p5Library.textSize(fontSize);
        p5Library.textAlign(p5Library.CENTER, p5Library.CENTER);
        p5Library.frameRate(10);

        // Get the points for each letter
        for (let i = 0; i < phrase.length; i++) {
            points.push([]);
            letters.push(phrase[i]);
        }
        p5Library.noLoop();
    }


    p5Library.draw = function () {
        p5Library.background(255);
        p5Library.fill(0, 0, 0, 255);
        p5Library.noStroke();

        let x = p5Library.width / 2 - p5Library.textWidth(phrase) / 2;
        let y = p5Library.height / 2 - fontSize / 2;

        p5Library.text(phrase, p5Library.width / 2, p5Library.height / 2);

        for (let i = 0; i < letters.length; i++) {
            let pointsInLetter: Vector[] = [];
            for (let yOffset = -fontSize; yOffset < fontSize; yOffset += 5) {
                for (let xOffset = 0; xOffset < p5Library.textWidth(letters[i]); xOffset += 5) {
                    let isPartOfLetter = p5Library.get(x + xOffset, y + yOffset)[0] < 128;
                    if (isPartOfLetter) {
                        pointsInLetter.push(p5Library.createVector(x + xOffset, y + yOffset));
                    }
                }
            }

            x += p5Library.textWidth(letters[i]); // Move x to the next letter position

            // If there are points in the letter, add them to the points array
            if (pointsInLetter.length > 0) {
                points[i] = pointsInLetter;
            }
        }
        console.log(points);
        p5Library.background(255);

        p5Library.fill(0, 0, 0, 10);
        for (let letterPoints of points) {
            for (let pt of letterPoints) {
                // Connect each point to its nearby neighbors within the same letter
                for (let otherPt of letterPoints) {
                    if (p5Library.dist(pt.x, pt.y, otherPt.x, otherPt.y) < 10) {
                        //line(pt.x + noise(noiseOffset) * 7,pt.y + noise(noiseOffset) * 7,otherPt.x +noise(noiseOffset) * 7,otherPt.y + noise(noiseOffset) * 7);
                        p5Library.circle(
                            pt.x + p5Library.noise(noiseOffset + 10) * 15,
                            pt.y + p5Library.noise(noiseOffset + 20) * 15,
                            p5Library.noise(noiseOffset + 30) * 30
                        );
                    }
                }
            }
        }
        noiseOffset += 0.01; // Adjust to modify speed of the noise change
    }

    p5Library.windowResized = function () {
        p5Library.resizeCanvas(p5Library.windowWidth, p5Library.windowHeight);
    }

}
let instantiatedSketch = new p5(sketch);