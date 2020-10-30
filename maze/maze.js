"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
ctx.setTransform(1, 0, 0, 1, 5, 5);
var TILE_WIDTH = 20;
var WIDTH = 40;
var HEIGHT = 30;
var maze = [];
var Direction;
(function (Direction) {
    Direction[Direction["LEFT"] = 0] = "LEFT";
    Direction[Direction["RIGHT"] = 1] = "RIGHT";
    Direction[Direction["TOP"] = 2] = "TOP";
    Direction[Direction["BOTTOM"] = 3] = "BOTTOM";
})(Direction || (Direction = {}));
window.onload = function () {
    initMaze();
    prim();
    setInterval(draw, 1000);
};
function draw() {
    ctx.fillStyle = 'white';
    ctx.fillRect(-5, -5, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.fillStyle = 'black';
    for (var x = 0; x < WIDTH; ++x) {
        for (var y = 0; y < HEIGHT; ++y) {
            var cell = maze[x][y];
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
    ctx.moveTo(0, TILE_WIDTH * HEIGHT);
    ctx.lineTo(TILE_WIDTH * WIDTH, TILE_WIDTH * HEIGHT);
    ctx.moveTo(TILE_WIDTH * WIDTH, 0);
    ctx.lineTo(TILE_WIDTH * WIDTH, TILE_WIDTH * HEIGHT);
    ctx.stroke();
}
var unionFindArray = [];
for (var i = 0; i < WIDTH * HEIGHT; i++) {
    unionFindArray.push(i);
}
var uf = {
    clear: function () {
        for (var i = 0; i < WIDTH * HEIGHT; i++) {
            unionFindArray[i] = i;
        }
    },
    findPos: function (a) {
        var i = a.x + a.y * WIDTH;
        return this.find(i);
    },
    find: function (i) {
        if (unionFindArray[i] == i)
            return i;
        var ret = this.find(unionFindArray[i]);
        unionFindArray[i] = ret;
        return ret;
    },
    union: function (a, b) {
        var fa = this.findPos(a);
        var fb = this.findPos(b);
        if (fa != fb) {
            unionFindArray[fa] = fb;
        }
    }
};
function isValid(pos) {
    return pos.x >= 0 && pos.y >= 0 && pos.x <= WIDTH - 1 && pos.y <= HEIGHT - 1;
}
function getNeighbors(pos) {
    return [
        { x: pos.x - 1, y: pos.y },
        { x: pos.x + 1, y: pos.y },
        { x: pos.x, y: pos.y - 1 },
        { x: pos.x, y: pos.y + 1 }
    ].filter(isValid);
}
function prim() {
    resetMaze();
    uf.clear();
    var cells = [];
    var walls = [];
    var addCell = function (cell) {
        cells.push(cell);
        if (cell.x > 0 && uf.findPos(cell) != uf.findPos({ x: cell.x - 1, y: cell.y })) {
            walls.push(__assign(__assign({}, cell), { direction: Direction.LEFT }));
        }
        if (cell.x < WIDTH - 1 && uf.findPos(cell) != uf.findPos({ x: cell.x + 1, y: cell.y })) {
            walls.push(__assign(__assign({}, cell), { direction: Direction.RIGHT }));
        }
        if (cell.y > 0 && uf.findPos(cell) != uf.findPos({ x: cell.x, y: cell.y - 1 })) {
            walls.push(__assign(__assign({}, cell), { direction: Direction.TOP }));
        }
        if (cell.y < HEIGHT - 1 && uf.findPos(cell) != uf.findPos({ x: cell.x, y: cell.y + 1 })) {
            walls.push(__assign(__assign({}, cell), { direction: Direction.BOTTOM }));
        }
    };
    addCell({ x: 0, y: 0 });
    while (walls.length > 0) {
        var wall = walls.splice(Math.floor(Math.random() * walls.length), 1)[0];
        var neighborPos = getPosByWall(wall);
        if (uf.findPos(wall) == uf.findPos(neighborPos)) {
            continue;
        }
        setWall(wall, false);
        uf.union(wall, neighborPos);
        addCell(neighborPos);
    }
}
function setWall(wall, value) {
    if (wall.direction == Direction.LEFT) {
        maze[wall.x][wall.y].leftWall = value;
    }
    else if (wall.direction == Direction.TOP) {
        maze[wall.x][wall.y].topWall = value;
    }
    else if (wall.direction == Direction.RIGHT) {
        maze[wall.x + 1][wall.y].leftWall = value;
    }
    else if (wall.direction == Direction.BOTTOM) {
        maze[wall.x][wall.y + 1].topWall = value;
    }
}
function getPosByWall(wall) {
    if (wall.direction == Direction.LEFT) {
        return { x: wall.x - 1, y: wall.y };
    }
    else if (wall.direction == Direction.RIGHT) {
        return { x: wall.x + 1, y: wall.y };
    }
    else if (wall.direction == Direction.TOP) {
        return { x: wall.x, y: wall.y - 1 };
    }
    else if (wall.direction == Direction.BOTTOM) {
        return { x: wall.x, y: wall.y + 1 };
    }
    throw new Error('Unknown Direction');
}
function backtrack() {
}
function initMaze() {
    for (var x = 0; x < WIDTH; ++x) {
        var row = [];
        for (var y = 0; y < HEIGHT; ++y) {
            row.push({ leftWall: true, topWall: true });
        }
        maze.push(row);
    }
}
function resetMaze() {
    for (var x = 0; x < WIDTH; ++x) {
        for (var y = 0; y < HEIGHT; ++y) {
            maze[x][y].topWall = true;
            maze[x][y].leftWall = true;
        }
    }
}
//# sourceMappingURL=maze.js.map