import p5 from 'p5';

let sketch = function (p5Library: p5) {
    p5Library.setup = function () {
        p5Library.createCanvas(p5Library.windowWidth, p5Library.windowHeight);
    }

    p5Library.draw = function () {
        p5Library.background(255);
        p5Library.stroke(255);
        const tangramSide = p5Library.width * 0.5;
        const offsetX = tangramSide * 0.5;
        const offsetY = p5Library.height * 0.25;
        p5Library.textSize(tangramSide * 0.5);
        tangramIndex = Math.floor(
            p5Library.map(p5Library.mouseX, 0, p5Library.windowWidth, 0, tangramForms.length)
        );
        fillColorRed = p5Library.map(tangramIndex, 0, tangramForms.length, 0, 255);
        fillColorGreen = p5Library.map(p5Library.mouseY, 0, p5Library.windowHeight, 255, 0);
        p5Library.fill(fillColorRed, fillColorGreen, 5);
        let tangram = tangramForms[tangramIndex];
        p5Library.triangle(
            offsetX + tangramSide * tangram.triangle1[0],
            tangramSide * tangram.triangle1[1],
            offsetX + tangramSide * tangram.triangle1[2],
            tangramSide * tangram.triangle1[3],
            offsetX + tangramSide * tangram.triangle1[4],
            tangramSide * tangram.triangle1[5]
        );

        p5Library.triangle(
            offsetX + tangramSide * tangram.triangle2[0],
            tangramSide * tangram.triangle2[1],
            offsetX + tangramSide * tangram.triangle2[2],
            tangramSide * tangram.triangle2[3],
            offsetX + tangramSide * tangram.triangle2[4],
            tangramSide * tangram.triangle2[5]
        );

        p5Library.triangle(
            offsetX + tangramSide * tangram.triangle3[0],
            tangramSide * tangram.triangle3[1],
            offsetX + tangramSide * tangram.triangle3[2],
            tangramSide * tangram.triangle3[3],
            offsetX + tangramSide * tangram.triangle3[4],
            tangramSide * tangram.triangle3[5]
        );

        p5Library.triangle(
            offsetX + tangramSide * tangram.triangle4[0],
            tangramSide * tangram.triangle4[1],
            offsetX + tangramSide * tangram.triangle4[2],
            tangramSide * tangram.triangle4[3],
            offsetX + tangramSide * tangram.triangle4[4],
            tangramSide * tangram.triangle4[5]
        );

        p5Library.triangle(
            offsetX + tangramSide * tangram.triangle5[0],
            tangramSide * tangram.triangle5[1],
            offsetX + tangramSide * tangram.triangle5[2],
            tangramSide * tangram.triangle5[3],
            offsetX + tangramSide * tangram.triangle5[4],
            tangramSide * tangram.triangle5[5]
        );

        p5Library.rect(
            offsetX + tangramSide * tangram.quadrat[0],
            tangramSide * tangram.quadrat[1],
            tangramSide * oneThird,
            tangramSide * oneThird
        );
        p5Library.quad(
            offsetX + tangramSide * tangram.trapez[0],
            tangramSide * tangram.trapez[1],
            offsetX + tangramSide * tangram.trapez[2],
            tangramSide * tangram.trapez[3],
            offsetX + tangramSide * tangram.trapez[4],
            tangramSide * tangram.trapez[5],
            offsetX + tangramSide * tangram.trapez[6],
            tangramSide * tangram.trapez[7]
        );
        p5Library.fill(255);
        p5Library.text(
            tangramIndex + 1,
            offsetX + tangramSide * (oneThird + 0.03),
            tangramSide * twoThirds
        );
    }

    p5Library.windowResized = function () {
    }

    const oneThird = 1 / 3;
    const twoThirds = oneThird * 2;

    const tangramForms = [
        {
            trapez: [0, twoThirds, oneThird, oneThird, oneThird, twoThirds, 0, 1],
            triangle1: [oneThird, 1, 1, 1, 1, oneThird],
            triangle2: [0, 1, oneThird, 1, oneThird, twoThirds],
            triangle3: [0, 0, twoThirds, 0, twoThirds, twoThirds],
            triangle4: [oneThird, oneThird, twoThirds, twoThirds, oneThird, 1],
            triangle5: [twoThirds, oneThird, 1, oneThird, twoThirds, twoThirds],
            quadrat: [twoThirds, 0],
        },
        {
            trapez: [twoThirds, 0, 1, 0, twoThirds, oneThird, oneThird, oneThird],
            triangle1: [0, 0, oneThird, oneThird, 0, oneThird],
            triangle2: [0, 0, twoThirds, 0, oneThird, oneThird],
            triangle3: [0, oneThird, twoThirds, oneThird, 0, 1],
            triangle4: [twoThirds, oneThird, twoThirds, 1, 0, 1],
            triangle5: [1, oneThird, 1, twoThirds, twoThirds, twoThirds],
            quadrat: [twoThirds, twoThirds],
        },
        {
            trapez: [0, oneThird, oneThird, 0, oneThird, oneThird, 0, twoThirds],
            triangle1: [0, 0, oneThird, 0, 0, oneThird],
            triangle2: [oneThird, 0, 1, 0, oneThird, twoThirds],
            triangle3: [1, 0, 1, twoThirds, oneThird, twoThirds],
            triangle4: [oneThird, twoThirds, twoThirds, twoThirds, oneThird, 1],
            triangle5: [oneThird, 1, twoThirds, twoThirds, 1, 1],
            quadrat: [0, twoThirds],
        },
        {
            trapez: [oneThird, twoThirds, twoThirds, twoThirds, oneThird, 1, 0, 1],
            triangle1: [0, 0, twoThirds, 0, 0, twoThirds],
            triangle2: [0, twoThirds, oneThird, oneThird, twoThirds, twoThirds],
            triangle3: [oneThird, oneThird, twoThirds, oneThird, twoThirds, twoThirds],
            triangle4: [0, twoThirds, oneThird, twoThirds, 0, 1],
            triangle5: [oneThird, 1, 1, oneThird, 1, 1],
            quadrat: [twoThirds, 0],
        },
        {
            trapez: [0, twoThirds, oneThird, oneThird, oneThird, twoThirds, 0, 1],
            triangle1: [0, 0, oneThird, oneThird, 0, twoThirds],
            triangle2: [oneThird, 0, 1, 0, oneThird, twoThirds],
            triangle3: [1, 0, 1, twoThirds, oneThird, twoThirds],
            triangle4: [twoThirds, twoThirds, 1, twoThirds, twoThirds, 1],
            triangle5: [1, twoThirds, 1, 1, twoThirds, 1],
            quadrat: [oneThird, twoThirds],
        },
        {
            trapez: [0, 0, oneThird, 0, twoThirds, oneThird, oneThird, oneThird],
            triangle1: [oneThird, 0, 1, 0, 1, twoThirds],
            triangle2: [0, oneThird, twoThirds, oneThird, twoThirds, 1],
            triangle3: [0, oneThird, oneThird, twoThirds, 0, twoThirds],
            triangle4: [twoThirds, oneThird, 1, twoThirds, twoThirds, 1],
            triangle5: [1, twoThirds, 1, 1, twoThirds, 1],
            quadrat: [0, twoThirds],
        },
        {
            trapez: [
                oneThird,
                oneThird,
                twoThirds,
                0,
                twoThirds,
                oneThird,
                oneThird,
                twoThirds,
            ],
            triangle1: [0, 0, oneThird, oneThird, 0, oneThird],
            triangle2: [0, 0, twoThirds, 0, oneThird, oneThird],
            triangle3: [twoThirds, 0, 1, 0, twoThirds, oneThird],
            triangle4: [0, oneThird, twoThirds, 1, 0, 1],
            triangle5: [oneThird, twoThirds, 1, 0, 1, twoThirds],
            quadrat: [twoThirds, twoThirds],
        },
        {
            trapez: [twoThirds, oneThird, 1, 0, 1, oneThird, twoThirds, twoThirds],
            triangle1: [0, 0, twoThirds, 0, twoThirds, twoThirds],
            triangle2: [0, 0, twoThirds, twoThirds, 0, twoThirds],
            triangle3: [0, twoThirds, oneThird, 1, 0, 1],
            triangle4: [0, twoThirds, twoThirds, twoThirds, oneThird, 1],
            triangle5: [oneThird, 1, twoThirds, twoThirds, twoThirds, 1],
            quadrat: [twoThirds, twoThirds],
        },
        {
            trapez: [twoThirds, oneThird, 1, 0, 1, oneThird, twoThirds, twoThirds],
            triangle1: [0, 0, twoThirds, 0, 0, twoThirds],
            triangle2: [0, twoThirds, twoThirds, 0, twoThirds, twoThirds],
            triangle3: [twoThirds, 0, 1, 0, twoThirds, oneThird],
            triangle4: [0, 1, oneThird, twoThirds, twoThirds, 1],
            triangle5: [oneThird, twoThirds, twoThirds, twoThirds, twoThirds, 1],
            quadrat: [twoThirds, twoThirds],
        },
    ];
    let tangramIndex = 1;
    let fillColorRed = 0;
    let fillColorGreen = 0;
}
let instantiatedSketch = new p5(sketch);