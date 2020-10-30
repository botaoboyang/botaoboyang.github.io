const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
ctx.setTransform(1, 0, 0, 1, 5, 5);

const TILE_WIDTH: number = 20;
const WIDTH: number = 40;
const HEIGHT: number = 30;

const maze: Array<Array<MazeCell>> = [];

enum Direction {
    LEFT, RIGHT, TOP, BOTTOM
}

interface MazeCell {
    topWall: boolean,
    leftWall: boolean,
}

interface Pos {
    x: number,
    y: number
}

interface Wall {
    x: number,
    y: number,
    direction: Direction
}

window.onload = function(): void {
    initMaze();
    prim();
    setInterval(draw, 1000)
}

function draw() {
    // clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(-5, -5, canvas.width, canvas.height);


    // draw walls
    ctx.beginPath()
    ctx.lineWidth = 2;
    ctx.fillStyle = 'black';
    for (let x=0 ; x<WIDTH ; ++x) {
        for (let y=0 ; y<HEIGHT ; ++y) {
            const cell: MazeCell = maze[x][y];
            if (cell.topWall) {
                ctx.moveTo(TILE_WIDTH * x, TILE_WIDTH * y);
                ctx.lineTo(TILE_WIDTH * x + TILE_WIDTH, TILE_WIDTH * y);
            }
            if (cell.leftWall) {
                ctx.moveTo(TILE_WIDTH * x, TILE_WIDTH * y);
                ctx.lineTo(TILE_WIDTH * x, TILE_WIDTH * y + TILE_WIDTH);
            }
        }
    }

    // draw bottom and right wall
    ctx.moveTo(0, TILE_WIDTH * HEIGHT);
    ctx.lineTo(TILE_WIDTH * WIDTH, TILE_WIDTH * HEIGHT);
    ctx.moveTo(TILE_WIDTH * WIDTH, 0);
    ctx.lineTo(TILE_WIDTH * WIDTH, TILE_WIDTH * HEIGHT);
    ctx.stroke();

}

const unionFindArray: Array<number> = [];
for (let i=0 ; i<WIDTH*HEIGHT ; i++) {
    unionFindArray.push(i);
}
const uf = {
    clear: function() {
        for (let i=0 ; i<WIDTH*HEIGHT ; i++) {
            unionFindArray[i] = i;
        }
    },
    findPos: function(a: Pos | Wall): number {
        const i: number = a.x + a.y * WIDTH;
        return this.find(i);
    },
    find: function(i: number): number {
        if (unionFindArray[i] == i) return i;
        const ret = this.find(unionFindArray[i]);
        unionFindArray[i] = ret;
        return ret;
    },
    union: function(a: Pos, b: Pos): void {
        const fa: number = this.findPos(a);
        const fb: number = this.findPos(b);
        if (fa != fb) {
            unionFindArray[fa] = fb;
        }
    }
}

function isValid(pos: Pos): boolean {
    return pos.x >= 0 && pos.y >= 0 && pos.x <= WIDTH-1 && pos.y <= HEIGHT-1;
}

function getNeighbors(pos: Pos): Array<Pos> {
    return [
        {x: pos.x-1, y: pos.y},
        {x: pos.x+1, y: pos.y},
        {x: pos.x, y: pos.y-1},
        {x: pos.x, y: pos.y+1}
    ].filter(isValid);
}

function prim(): void {
    resetMaze()
    uf.clear();
    const cells: Array<Pos> = [];
    const walls: Array<Wall> = [];

    const addCell = function(cell: Pos) {
        cells.push(cell);
        if (cell.x > 0 && uf.findPos(cell) != uf.findPos({x: cell.x-1, y: cell.y})) {
            walls.push({...cell, direction: Direction.LEFT});
        }
        if (cell.x < WIDTH-1 && uf.findPos(cell) != uf.findPos({x: cell.x+1, y: cell.y})) {
            walls.push({...cell, direction: Direction.RIGHT});
        }
        if (cell.y > 0 && uf.findPos(cell) != uf.findPos({x: cell.x, y: cell.y-1})) {
            walls.push({...cell, direction: Direction.TOP});
        }
        if (cell.y < HEIGHT-1 && uf.findPos(cell) != uf.findPos({x: cell.x, y: cell.y+1})) {
            walls.push({...cell, direction: Direction.BOTTOM});
        }
    }

    addCell({x: 0, y: 0})
    while (walls.length > 0) {
        const [wall] = walls.splice(Math.floor(Math.random() * walls.length), 1)
        const neighborPos = getPosByWall(wall);
        if (uf.findPos(wall) == uf.findPos(neighborPos)) {
            continue;
        }
        setWall(wall, false);
        uf.union(wall, neighborPos)
        addCell(neighborPos);
    }

}

function setWall(wall: Wall, value: boolean) {
    if (wall.direction == Direction.LEFT) {
        maze[wall.x][wall.y].leftWall = value;
    } else if (wall.direction == Direction.TOP) {
        maze[wall.x][wall.y].topWall = value;
    } else if (wall.direction == Direction.RIGHT) {
        maze[wall.x+1][wall.y].leftWall = value;
    } else if (wall.direction == Direction.BOTTOM) {
        maze[wall.x][wall.y+1].topWall = value;
    }
}

function getPosByWall(wall: Wall): Pos {
    if (wall.direction == Direction.LEFT) {
        return {x: wall.x-1, y: wall.y}
    } else if (wall.direction == Direction.RIGHT) {
        return {x: wall.x+1, y: wall.y}
    } else if (wall.direction == Direction.TOP) {
        return {x: wall.x, y: wall.y-1}
    } else if (wall.direction == Direction.BOTTOM) {
        return {x: wall.x, y: wall.y+1}
    }
    throw new Error('Unknown Direction')
}

function backtrack() {

}

function initMaze() {
    for (let x=0 ; x<WIDTH ; ++x) {
        const row: Array<MazeCell> = [];
        for (let y=0 ; y<HEIGHT ; ++y) {
            row.push({leftWall: true, topWall: true})
        }
        maze.push(row);
    }
}

function resetMaze() {
    for (let x=0 ; x<WIDTH ; ++x) {
        for (let y=0 ; y<HEIGHT ; ++y) {
            maze[x][y].topWall = true
            maze[x][y].leftWall = true
        }
    }
}
