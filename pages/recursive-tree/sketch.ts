import p5 from 'p5';

let sketch = function (p5Library: p5) {
    const initialBranchLength = 100;
    const minBranchLength = 10;

    p5Library.setup = function () {
        p5Library.createCanvas(p5Library.windowWidth, p5Library.windowHeight);
        p5Library.angleMode(p5Library.DEGREES);
        p5Library.frameRate(12);
        p5Library.noLoop()
    }


    p5Library.draw = function () {
        p5Library.background(200, 0, 120, 120);

        p5Library.translate(p5Library.width * 0.5, p5Library.height + 10);
        // Start with a branch of the length of 100
        branch(100);
    }

    p5Library.windowResized = function () {
        p5Library.resizeCanvas(p5Library.windowWidth, p5Library.windowHeight);
    }
    function branch(branchLength) {
        // save the current drawing options
        p5Library.push();
        p5Library.strokeWeight(p5Library.map(branchLength, minBranchLength, initialBranchLength, 1, 15));
        p5Library.stroke(70, 40, 20);
        p5Library.line(0, 0, 0, -branchLength);
        // Translate to the end of the previous branch
        p5Library.translate(0, -branchLength);
        // Only continue if the branch is going to be visible
        if (branchLength > minBranchLength) {
            // branch to the left
            p5Library.rotate(p5Library.random(-20, -30));
            branch(branchLength * p5Library.random(0.7, 0.9));
            // branch to the right
            p5Library.rotate(p5Library.random(50, 60));
            branch(branchLength * p5Library.random(0.7, 0.9));
        } else {
            p5Library.noStroke();
            let redValue = 220 + p5Library.random(-20, 20);
            let greenValue = 120 + p5Library.random(-20, 20);
            let blueValue = 170 + p5Library.random(-20, 20);
            p5Library.fill(redValue, greenValue, blueValue, 150);

            // draw a leaf by drawing a part of a circle two times so we have two halves
            p5Library.beginShape();
            // radius of the circle
            let radius = 30;
            // For the first half of the leaf, start at angle 45 and go to angle 135.
            for (let i = 45; i < 135; i++) {
                // We need to use sin and cos which will create a curve
                let x = radius * p5Library.cos(i);
                let y = radius * p5Library.sin(i);
                p5Library.vertex(x, y);
            }
            for (let i = 135; i > 45; i--) {
                // We need to use sin and cos which will create a curve
                let x = radius * p5Library.cos(i);
                let y = radius * p5Library.sin(-i) + radius * 1.4;
                p5Library.vertex(x, y);
            }
            // This will end the shape and then connect the first and last point with a straight line
            p5Library.endShape(p5Library.CLOSE);
        }
        // go back to the saved settings
        p5Library.pop();
    }
}
let instantiatedSketch = new p5(sketch);