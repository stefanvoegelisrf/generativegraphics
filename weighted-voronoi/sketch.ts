import p5, { Vector } from 'p5';
import * as d3 from 'd3-delaunay';

let sketch = function (p5Library: p5) {
    let randomPoints: Vector[] = [];
    let amountOfPoints = 10000;
    let stefanPortrait: p5.Image;

    p5Library.preload = function () {
        p5Library.loadImage('./images/20220629_Portrait_SRF-122_edit_scaled.png', (img) => {
            stefanPortrait = img;
        });
    }

    p5Library.setup = function () {
        p5Library.frameRate(30);
        p5Library.createCanvas(stefanPortrait.width, stefanPortrait.height)
        for (let i = 0; i < amountOfPoints; i++) {
            let x = p5Library.random(stefanPortrait.width);
            let y = p5Library.random(stefanPortrait.height);
            let color = stefanPortrait.get(x, y);
            if (p5Library.alpha(color) > 100 && p5Library.random(10, 100) > p5Library.brightness(color)) {
                randomPoints.push(p5Library.createVector(x, y));
            }
            else {
                i--;
            }
        }
        p5Library.randomSeed(0);
    }
    p5Library.draw = function () {
        p5Library.background(255);
        drawVoronoiDiagram();
    }

    const drawCellPolygons = function (cells: d3.Delaunay.Polygon[]) {
        p5Library.push();
        p5Library.stroke(0);
        p5Library.strokeWeight(1);
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
        // drawCellPolygons(cells);
        const centroids = new Array(cells.length);
        for (let i = 0; i < centroids.length; i++) {
            centroids[i] = new p5.Vector(0, 0);
        }

        const weights = new Array(cells.length).fill(0);
        let delaunayIndex = 0;
        stefanPortrait.loadPixels();
        for (let x = 0; x < p5Library.width; x++) {
            for (let y = 0; y < p5Library.height; y++) {
                const index = (x + y * p5Library.width) * 4;
                const r = stefanPortrait.pixels[index + 0];
                const g = stefanPortrait.pixels[index + 1];
                const b = stefanPortrait.pixels[index + 2];
                const color = (r + g + b) / 3;
                const brightness = p5Library.saturation([r, g, b]);
                let weight = brightness / 255;
                if (stefanPortrait.pixels[index + 3] < 100) {
                    weight = 0;
                }
                delaunayIndex = delaunay.find(x, y, delaunayIndex);
                centroids[delaunayIndex].x += x * weight;
                centroids[delaunayIndex].y += y * weight;
                weights[delaunayIndex] += weight;
            }
        }

        for (let i = 0; i < centroids.length; i++) {
            if (weights[i] > 0) {
                centroids[i].div(weights[i]);
            }
            else {
                centroids[i] = randomPoints[i].copy();
            }
        }

        for (let i = 0; i < randomPoints.length; i++) {
            randomPoints[i].lerp(centroids[i], 0.1);
        }
        let maxWeight = Math.max(...weights);
        for (let i = 0; i < randomPoints.length; i++) {
            let mappedColorValue = p5Library.map(weights[i], 0, maxWeight, 0, 255);
            p5Library.stroke(mappedColorValue);
            p5Library.strokeWeight(p5Library.map(weights[i], 0, maxWeight, 1, 7));
            p5Library.point(randomPoints[i].x, randomPoints[i].y);
        }
    }

    p5Library.windowResized = function () {
    }
}
let instantiatedSketch = new p5(sketch);