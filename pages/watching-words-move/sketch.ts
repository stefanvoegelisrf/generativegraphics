import p5 from 'p5';

let sketch = function (p5Library: p5) {
    const africanFoods = [
        "Boshintang",
        "Dikdik",
        "Eland",
        "Fufu",
        "Gari",
        "HornedMelon",
        "Imoyo",
        "Jollof",
        "Kedjenou",
        "LiberianChilli",
        "Moinmoin",
        "NiterKibbeh",
        "Ogbono",
        "PoundedYam",
        "Quail",
        "Rooibos",
        "Suya",
        "Tilapia",
        "Uji",
        "Vetkoek",
        "Waterblommetjiebredie",
        "Xylopia",
        "Yams",
        "Zigni",
    ];

    let wordObjects: WordObject[] = [];

    class WordObject {
        word: string;
        position: p5.Vector;
        fontSize: number;
        color: p5.Color;
        transparencyDecrease: number;
        transparency: number;
        fontSizeIncrease: number;
        angle: number;
        constructor(word: string) {
            this.word = word;
            this.position = p5Library.createVector(p5Library.random(p5Library.width), p5Library.random(p5Library.height));
            this.fontSize = p5Library.random(12, 24);
            this.transparency = p5Library.random(150, 255);
            this.color = p5Library.color(
                p5Library.random(180, 255),
                p5Library.random(100, 150),
                p5Library.random(200, 255),
                this.transparency
            );
            this.transparencyDecrease = 0.1;
            this.fontSizeIncrease = 5;
            this.angle = p5Library.random(p5Library.TWO_PI);
        }

        display() {
            p5Library.push();
            p5Library.translate(this.position.x, this.position.y);
            p5Library.rotate(this.angle);
            p5Library.fill(this.color);
            p5Library.textSize(this.fontSize);
            p5Library.text(this.word, 0, 0);
            p5Library.pop();
        }

        update() {
            this.fontSize += this.fontSizeIncrease;
            this.transparency -= this.transparencyDecrease;
            this.color.setAlpha(this.transparency);

            if (this.fontSize > 100) {
                this.fontSize = p5Library.random(12, 24);
                this.position = p5Library.createVector(p5Library.random(p5Library.width), p5Library.random(p5Library.height));
                this.transparency = p5Library.random(150, 255);
                this.color.setAlpha(this.transparency);
                this.angle = p5Library.random(p5Library.TWO_PI);
            }
        }
    }

    p5Library.setup = function () {
        p5Library.createCanvas(p5Library.windowWidth, p5Library.windowHeight);

        // Initialize word objects
        for (let i = 0; i < africanFoods.length; i++) {
            wordObjects.push(new WordObject(africanFoods[i].toUpperCase()));
        }
    }


    p5Library.draw = function () {
        p5Library.background(255, 255, 255, 5);

        for (let wordObject of wordObjects) {
            wordObject.display();
            wordObject.update();
        }
    }


    p5Library.windowResized = function () {
        p5Library.resizeCanvas(p5Library.windowWidth, p5Library.windowHeight);
    }

}
let instantiatedSketch = new p5(sketch);