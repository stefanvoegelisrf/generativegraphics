import p5 from 'p5';

let sketch = function (p5Library: p5) {

    p5Library.setup = function () {
        p5Library.createCanvas(p5Library.windowWidth, p5Library.windowHeight);
        p5Library.noStroke();
    }


    p5Library.draw = function () {
        p5Library.blendMode(p5Library.SUBTRACT);
        p5Library.background(250, 250, 250, 3);
      
        let time = p5Library.millis() * 0.001; // Scale time for smoother animation.
        let diameter = 0;
        for (let i = 0; i < 500; i++) {
          let angle = (p5Library.TWO_PI * i) / 100;
          let x = p5Library.windowWidth * 0.5 + p5Library.windowWidth * 0.5 * Math.sin(angle - time);
          let y = p5Library.windowHeight * 0.5 + p5Library.windowHeight * 0.5 * Math.cos(angle + time);
          
      
          let r = Math.sin(angle * 2 + time) * 127 + 128 + 200;
          let g = Math.cos(angle * 4 - time) * 127 + 128;
          let b = Math.sin(angle * 5 + time*2) * 127 + 128 + 200;
      
          if (r < 127) r += 200 - r;
          p5Library.fill(r, g, b, 10);
          
          diameter = 50 + 50 * Math.sin(angle);
          p5Library.ellipse(x, y, diameter, diameter);
        }
    }

    p5Library.windowResized = function () {
        p5Library.resizeCanvas(p5Library.windowWidth, p5Library.windowHeight);
    }

}
let instantiatedSketch = new p5(sketch);