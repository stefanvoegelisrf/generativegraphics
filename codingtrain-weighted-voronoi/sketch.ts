import p5, { Vector } from 'p5';
import * as d3 from 'd3-delaunay';

let sketch = function (p5Library: p5) {
    let randomPoints: Vector[];
    let amountOfPoints = 200;
    let previousSquareLength = 0;

    const setCanvasSize = function () {
        let factorSize = 0.9;
        let squareLength = (p5Library.windowWidth < p5Library.windowHeight ? p5Library.windowWidth : p5Library.windowHeight) * factorSize;
        squareLength = Math.floor(squareLength);
        if (squareLength === previousSquareLength)
            return;
        previousSquareLength = squareLength;
    }

    const generateRandomPoints = function () {
        randomPoints = new Array(amountOfPoints);
        for (let i = 0; i < randomPoints.length; i++) {
            randomPoints[i] = p5Library.createVector(p5Library.random(0, p5Library.width), p5Library.random(0, p5Library.height));
        }
    }

    p5Library.setup = function () {
        setCanvasSize();
        p5Library.createCanvas(previousSquareLength, previousSquareLength);
        p5Library.randomSeed(0);
        generateRandomPoints();
    }

    p5Library.draw = function () {
        p5Library.background(255);
        drawVoronoiDiagram();
    }

    const drawCellPolygons = function (cells: d3.Delaunay.Polygon[]) {
        p5Library.push();
        p5Library.stroke(0);
        p5Library.strokeWeight(1);
        p5Library.noFill();
        for (let polygon of cells) {
            p5Library.beginShape();
            for (let i = 0; i < polygon.length; i++) {
                p5Library.vertex(polygon[i][0], polygon[i][1]);
            }
            p5Library.endShape(p5Library.CLOSE);
        }
        p5Library.pop();
    }

    const calculateCentroids = function (cells: d3.Delaunay.Polygon[]): Vector[] {
        const centroids: Vector[] = [];
        for (let polygon of cells) {
            let area = 0;
            const centroid = p5Library.createVector(0, 0);
            for (let i = 0; i < polygon.length; i++) {
                const vertex1 = polygon[i];
                const vertex2 = polygon[(i + 1) % polygon.length];
                const crossProduct = vertex1[0] * vertex2[1] - vertex2[0] * vertex1[1];
                area += crossProduct;
                centroid.x += (vertex1[0] + vertex2[0]) * crossProduct;
                centroid.y += (vertex1[1] + vertex2[1]) * crossProduct;
            }
            area /= 2;
            centroid.div(6 * area);
            centroids.push(centroid);
        }
        return centroids;
    }

    const drawVoronoiDiagram = function () {
        let points: number[] = [];
        for (let i = 0; i < randomPoints.length; i++) {
            points.push(randomPoints[i].x, randomPoints[i].y);
        }
        const delaunay = new d3.Delaunay(points);
        const voronoi = delaunay.voronoi([0, 0, p5Library.width, p5Library.height]);
        const polygons = voronoi.cellPolygons();
        const cells = Array.from(polygons);
        drawCellPolygons(cells);
        const centroids = calculateCentroids(cells);

        for (let i = 0; i < randomPoints.length; i++) {
            randomPoints[i].lerp(centroids[i], 0.01);
        }

        for (let i = 0; i < randomPoints.length; i++) {
            p5Library.stroke(0);
            p5Library.strokeWeight(4);
            p5Library.point(randomPoints[i].x, randomPoints[i].y);
        }

        for (let centroid of centroids) {
            p5Library.stroke(255, 0, 0);
            p5Library.strokeWeight(4);
            p5Library.point(centroid.x, centroid.y);
        }
    }

    let lerp = function (start: number, end: number, amount: number) {
        return (1 - amount) * start + amount * end;
    }

    p5Library.windowResized = function () {
        setCanvasSize();
        p5Library.resizeCanvas(previousSquareLength, previousSquareLength);
        generateRandomPoints();
    }
}
let instantiatedSketch = new p5(sketch);