import p5 from 'p5';
import * as d3 from 'd3-delaunay';

let sketch = function (p: p5) {
    let randomPoints: number[];
    let amountOfPoints = 100;
    let previousSquareLength = 0;
    let delaunay: d3.Delaunay<number>;
    let voronoi: d3.Voronoi<number>;
    const setCanvasSize = function () {
        let factorSize = 0.9;
        let squareLength = (p.windowWidth < p.windowHeight ? p.windowWidth : p.windowHeight) * factorSize;
        squareLength = Math.floor(squareLength);
        if (squareLength === previousSquareLength)
            return;
        calculatePoints();
        calculateDelaunay();
        calculateVoronoi();
        p.resizeCanvas(squareLength, squareLength);
        previousSquareLength = squareLength;
    }

    p.setup = function () {
        p.createCanvas(500, 500);
        p.randomSeed(0);
        setCanvasSize();
    }
    p.draw = function () {
        p.background(255);
        drawPoints();
        drawVoronoiDiagram();
    }

    let calculateDelaunay = function () {
        delaunay = new d3.Delaunay(randomPoints);
    }

    let calculateVoronoi = function () {
        voronoi = delaunay.voronoi([0, 0, p.width, p.height]);
    }

    let calculatePoints = function () {
        randomPoints = new Array(amountOfPoints);
        for (let i = 0; i < amountOfPoints; i += 2) {
            randomPoints[i] = p.random(0, p.width);
            randomPoints[i + 1] = p.random(0, p.height);
        }
    }

    let movePointsClockwise = function () {
        let sinValue = p.sin(p.frameCount * 0.01);
        let cosValue = p.cos(p.frameCount * 0.01);
        for (let i = 0; i < randomPoints.length; i += 2) {
            randomPoints[i] += sinValue;
            randomPoints[i + 1] += cosValue;
        }
    }

    let movePointsRandomly = function (min: number, max: number) {
        for (let i = 0; i < randomPoints.length; i += 2) {
            randomPoints[i] += p.random(min, max);
            randomPoints[i + 1] += p.random(min, max);
        }
    }

    let drawVoronoiDiagram = function () {
        let polygons = voronoi.cellPolygons();
        let cells = Array.from(polygons);
        p.stroke(0);
        p.strokeWeight(1);
        p.noFill();
        // Draw the polygons of the voronoi diagram
        for (let polygon of cells) {
            p.beginShape();
            for (let i = 0; i < polygon.length; i++) {
                p.vertex(polygon[i][0], polygon[i][1]);
            }
            p.endShape(p.CLOSE);
        }

        for (let polygon of cells) {
            let centroid = p.createVector(0, 0);
            let area=calculateAreaOfPolygon(polygon);
            for (let i = 0; i < polygon.length; i++) {
                centroid.x += polygon[i][0];
                centroid.y += polygon[i][1];
            }
            centroid.div(polygon.length);
            p.stroke(255, 0, 0);
            p.strokeWeight(4);
            p.point(centroid.x, centroid.y);
        }
    }

    let calculateAreaOfPolygon = function (polygon: d3.Delaunay.Polygon) {
    }

    let drawPoints = function () {
        p.stroke(0);
        p.strokeWeight(4);
        // Draw the random points
        for (let i = 0; i < randomPoints.length; i += 2) {
            p.point(randomPoints[i], randomPoints[i + 1]);
        }
    }

    let drawDelaunayTriangles = function () {
        p.stroke(0);
        p.noFill();
        p.strokeWeight(1);
        for (let i = 0; i < delaunay.triangles.length; i += 3) {
            let firstPoint = 2 * delaunay.triangles[i];
            let secondPoint = 2 * delaunay.triangles[i + 1];
            let thirdPoint = 2 * delaunay.triangles[i + 2];
            p.triangle(
                delaunay.points[firstPoint], delaunay.points[firstPoint + 1],
                delaunay.points[secondPoint], delaunay.points[secondPoint + 1],
                delaunay.points[thirdPoint], delaunay.points[thirdPoint + 1]
            );
        }
    }
    p.windowResized = function () {
        setCanvasSize();
    }
}
let instantiatedSketch = new p5(sketch);