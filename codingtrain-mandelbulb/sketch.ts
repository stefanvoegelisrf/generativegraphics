import p5 from 'p5';

class SphericalCoordinate {
    distanceFromOrigin: number;
    thetaAngle: number;
    phiAngle: number;
    constructor(distanceFromOrigin: number, thetaAngle: number, phiAngle: number) {
        this.distanceFromOrigin = distanceFromOrigin;
        this.thetaAngle = thetaAngle;
        this.phiAngle = phiAngle;
    }
}

let sketch = function (p: p5) {
    let cubeLength = 128;
    let mandelBulbPoints: p5.Vector[] = [];
    const setCanvasSize = function () {
        let factorSize = 0.9;
        let squareLength = (p.windowWidth < p.windowHeight ? p.windowWidth : p.windowHeight) * factorSize;
        squareLength = Math.floor(squareLength);
        p.resizeCanvas(squareLength, squareLength);
    }

    const convertToSphericalCoordinate = function (x: number, y: number, z: number): SphericalCoordinate {
        let distanceFromOrigin = Math.sqrt(x * x + y * y + z * z);
        let thetaAngle = Math.atan2(Math.sqrt(x * x + y * y), z);
        let phiAngle = Math.atan2(y, x);

        return new SphericalCoordinate(distanceFromOrigin, thetaAngle, phiAngle);
    }

    p.setup = function () {
        p.createCanvas(500, 500, p.WEBGL);
        setCanvasSize();
        p.frameRate(24);
        let n = 8;
        let maxIterations = 10;
        for (let i = 0; i < cubeLength; i++) {
            for (let j = 0; j < cubeLength; j++) {
                let edge = false;
                for (let k = 0; k < cubeLength; k++) {
                    let x = p.map(i, 0, cubeLength, -1, 1);
                    let y = p.map(j, 0, cubeLength, -1, 1);
                    let z = p.map(k, 0, cubeLength, -1, 1);

                    let zeta = new p5.Vector(0, 0, 0);
                    let iteration = 0;

                    while (true) {
                        let sphericalZeta = convertToSphericalCoordinate(zeta.x, zeta.y, zeta.z);
                        let newX = Math.pow(sphericalZeta.distanceFromOrigin, n) * Math.sin(sphericalZeta.thetaAngle * n) * Math.cos(sphericalZeta.phiAngle * n);
                        let newY = Math.pow(sphericalZeta.distanceFromOrigin, n) * Math.sin(sphericalZeta.thetaAngle * n) * Math.sin(sphericalZeta.phiAngle * n);
                        let newZ = Math.pow(sphericalZeta.distanceFromOrigin, n) * Math.cos(sphericalZeta.thetaAngle * n);

                        zeta.x = newX + x;
                        zeta.y = newY + y;
                        zeta.z = newZ + z;
                        if (sphericalZeta.distanceFromOrigin > 2) {
                            if (edge) {
                                edge = false;
                            }
                            break;
                        }
                        if (iteration > maxIterations) {
                            if (!edge) {
                                edge = true;
                                mandelBulbPoints.push(p.createVector(x * 100, y * 100, z * 100));
                            }
                            break;
                        }
                        iteration++;
                    }
                }
            }
        }
    }
    p.draw = function () {
        p.background(0);
        p.orbitControl(1, 1, 1, { freeRotation: true });
        p.strokeWeight(.1)
        p.stroke(255);
        for (let i = 0; i < mandelBulbPoints.length; i++) {
            p.point(mandelBulbPoints[i].x, mandelBulbPoints[i].y, mandelBulbPoints[i].z);
        }
    }
    p.windowResized = function () {
        setCanvasSize();
    }
}
let instantiatedSketch = new p5(sketch);