import p5 from 'p5';

let sketch = function (p5Library: p5) {
    let columns: number, rows: number;
    let w = 100;
    let grid: Cell[] = [];
    let current: Cell;
    let stack: Cell[] = [];
    let allowDeadEnds = true; // Change this to false to avoid dead ends
    let seed = 1234;
    class Cell {
        visited: boolean;
        walls: boolean[];
        i: number;
        j: number;
        constructor(i: number, j: number) {
            this.i = i;
            this.j = j;
            this.walls = [true, true, true, true]; // top, right, bottom, left
            this.visited = false;
        }

        checkNeighbors() {
            let neighbors: Cell[] = [];

            let top = grid[index(this.i, this.j - 1)];
            let right = grid[index(this.i + 1, this.j)];
            let bottom = grid[index(this.i, this.j + 1)];
            let left = grid[index(this.i - 1, this.j)];

            if (top && !top.visited) {
                neighbors.push(top);
            }
            if (right && !right.visited) {
                neighbors.push(right);
            }
            if (bottom && !bottom.visited) {
                neighbors.push(bottom);
            }
            if (left && !left.visited) {
                neighbors.push(left);
            }

            if (neighbors.length > 0) {
                let r = Math.floor(p5Library.random(0, neighbors.length));
                return neighbors[r];
            } else {
                return undefined;
            }
        }

        show() {
            let x = this.i * w;
            let y = this.j * w;
            p5Library.stroke(0);
            if (this.walls[0]) {
                p5Library.line(x, y, x + w, y); // Top
            }
            if (this.walls[1]) {
                p5Library.line(x + w, y, x + w, y + w); // Right
            }
            if (this.walls[2]) {
                p5Library.line(x + w, y + w, x, y + w); // Bottom
            }
            if (this.walls[3]) {
                p5Library.line(x, y + w, x, y); // Left
            }

            if (this.visited) {
                p5Library.noStroke();
                p5Library.fill(255, 0, 255, 100);
                p5Library.rect(x, y, w, w);
            }
        }
    }
    p5Library.setup = function () {
        p5Library.createCanvas(p5Library.windowWidth, p5Library.windowHeight);
        columns = Math.floor(p5Library.width / w);
        rows = Math.floor(p5Library.height / w);
        // Initialize grid
        for (let j = 0; j < rows; j++) {
            for (let i = 0; i < columns; i++) {
                let cell = new Cell(i, j);
                grid.push(cell);
            }
        }
        current = grid[0];

        // Seed for randomness
        p5Library.randomSeed(seed);
    }


    p5Library.draw = function () {
        p5Library.background(255);
        for (let i = 0; i < grid.length; i++) {
            grid[i].show();
        }

        current.visited = true;
        let next = current.checkNeighbors();
        if (next) {
            next.visited = true;
            stack.push(current);
            removeWalls(current, next);
            current = next;
        } else if (stack.length > 0) {
            current = stack.pop()!;
        }
    }

    p5Library.windowResized = function () {
        p5Library.resizeCanvas(p5Library.windowWidth, p5Library.windowHeight);
    }
    function removeWalls(a, b) {
        let x = a.i - b.i;
        if (x === 1) {
            a.walls[3] = false;
            b.walls[1] = false;
        } else if (x === -1) {
            a.walls[1] = false;
            b.walls[3] = false;
        }
        let y = a.j - b.j;
        if (y === 1) {
            a.walls[0] = false;
            b.walls[2] = false;
        } else if (y === -1) {
            a.walls[2] = false;
            b.walls[0] = false;
        }
    }
    function index(i, j) {
        if (i < 0 || j < 0 || i > columns - 1 || j > rows - 1) {
            return -1;
        }
        return i + j * columns;
    }
}
let instantiatedSketch = new p5(sketch);