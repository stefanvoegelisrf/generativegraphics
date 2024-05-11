import p5 from 'p5';

let sketch = function (p5Library: p5) {
    let sections = 8;
    let distanceBetweenArcs = 20;

    p5Library.setup = function () {
        p5Library.createCanvas(400, 400);
        p5Library.angleMode(p5Library.DEGREES);
    }


    p5Library.draw = function () {
        p5Library.background(220);

        p5Library.translate(p5Library.width / 2, p5Library.height / 2);

        for (let i = 0; i < sections; i++) {
            p5Library.push();
            p5Library.rotate(i * 45);
            drawSpiderwebSection();
            p5Library.pop();
        }
    }

    function drawSpiderwebSection() {
        let radius = p5Library.height / 2;
        let startLineEnd = p5Library.createVector(0, -radius);
        let endLineEnd = p5Library.createVector(0, -radius).rotate(45);

        // Draw start line
        p5Library.line(0, 0, startLineEnd.x, startLineEnd.y);

        // Draw end line
        p5Library.line(0, 0, endLineEnd.x, endLineEnd.y);

        // Draw arcs
        for (let i = 1; i <= radius / distanceBetweenArcs; i++) {
            let currentRadius = i * distanceBetweenArcs;
            let angle = 45;
            let arcStart = startLineEnd.copy().setMag(currentRadius);
            let arcEnd = endLineEnd.copy().setMag(currentRadius);

            // Calculate control points for the bezier curve to create an upside down arc
            let controlPoint1 = arcStart.copy().rotate(-angle / 2);
            let controlPoint2 = arcEnd.copy().rotate(angle / 2);

            // Draw the arc using bezier curve
            p5Library.noFill();
            p5Library.stroke(0);
            p5Library.strokeWeight(2);
            p5Library.beginShape();
            p5Library.vertex(arcStart.x, arcStart.y);
            p5Library.bezierVertex(
                controlPoint1.x,
                controlPoint1.y,
                controlPoint2.x,
                controlPoint2.y,
                arcEnd.x,
                arcEnd.y
            );
            p5Library.endShape();
        }
    }
}
let instantiatedSketch = new p5(sketch);