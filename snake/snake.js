const WIDTH = 40
const HEIGHT = 30

const LEFT = 1
const UP = 2
const RIGHT = 3
const DOWN = 4

let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')

let snake = []
let x = y = vx = vy = ax = ay = 0
let snakeLength = 5
let keyList = []
let direction = 0

let score = 0
let highscore = 0
let control = 'human'

window.onload = function() {
    document.addEventListener('keydown', keyDown)
    init()
    setInterval(loop, 1000/60)
}

function loop() {
    update()
    draw()
}

dirList = []
function astar() {
    if (dirList.length == 0) {
        let seen = {}
        let flag = false
        let q = [{x, y, w: h(x, y), d: 0, h: h(x, y), vx:0, vy:0, prevx: -1, prevy: -1}]
        while (q.length > 0) {
            let p = q.reduce((a, b) => a.w < b.w ? a : b)
            for (let i=0 ; i<q.length ; ++i) {
                if (p == q[i]) {
                    q.splice(i, 1)
                    break
                }
            }
            if (seen[key(p.x, p.y)]) continue
            seen[key(p.x, p.y)] = p
            if (p.x == ax && p.y == ay) {
                flag = true
                break
            }
            addToQueue(q, seen, p.x, p.y, p.d, -1, 0)
            addToQueue(q, seen, p.x, p.y, p.d, 1, 0)
            addToQueue(q, seen, p.x, p.y, p.d, 0, -1)
            addToQueue(q, seen, p.x, p.y, p.d, 0, 1)
        }
        if (flag) {
            let tempx = ax
            let tempy = ay
            while (true) {
                let k = key(tempx, tempy)
                let d = seen[k]
                if (d.prevx == -1) break
                dirList.unshift({vx: d.vx, vy: d.vy})
                tempx = d.prevx
                tempy = d.prevy
            }
        }
    }
    if (dirList.length > 0) {
        let d = dirList.shift()
        vx = d.vx
        vy = d.vy
        return
    } else {
        simplebot()
    }
    

}

function addToQueue(q, seen, x, y, d, vx, vy) {
    let prevx = x
    let prevy = y
    x += vx
    y += vy
    if (x < 0) x = WIDTH-1
    else if (x > WIDTH-1) x = 0
    if (y < 0) y = HEIGHT-1
    else if (y > HEIGHT-1) y = 0
    let k = key(x, y)
    if (!seen[k] && !collide(x, y)) {
        let heuristic = h(x, y)
        q.push({
            x,
            y,
            h: heuristic,
            d: d+1,
            w: d + heuristic + 1,
            vx,
            vy,
            prevx,
            prevy
        })
    }
}

function key(x, y) {
    return x + ',' + y
}

function h(x, y) {
    let dx = Math.min(Math.abs(x - ax), Math.abs(x - ax + WIDTH), Math.abs(x - ax - WIDTH))
    let dy = Math.min(Math.abs(y - ay), Math.abs(y - ay + HEIGHT), Math.abs(y - ay - HEIGHT))
    return dx + dy
}

function simplebot() {
    if (x > ax && !collide(x-1, y)) {
        vx = -1
        vy = 0
    } else if (x < ax && !collide(x+1, y)) {
        vx = 1
        vy = 0
    } else if (y > ay && !collide(x, y-1)) {
        vx = 0
        vy = -1
    } else if (y < ay && !collide(x, y+1)) {
        vx = 0
        vy = 1
    } else if (!collide(x-1, y)) {
        vx = -1
        vy = 0
    } else if (!collide(x, y+1)) {
        vx = 0
        vy = 1
    } else if (!collide(x+1, y)) {
        vx = 1
        vy = 0
    } else if (!collide(x, y-1)) {
        vx = 0
        vy = -1
    } else {
        vx = 0
        vy = 1
    }
}

function update() {

    if (control == 'human'){
        while (keyList.length > 0) {
            let key = keyList.shift()
            if (direction != LEFT && direction != RIGHT && 
                (key == 'a' || key == 'ArrowLeft')) {
                direction = LEFT
                vx = -1
                vy = 0
                break
            } else if (direction != UP && direction != DOWN &&
                (key == 'w' || key == 'ArrowUp')) {
                direction = UP
                vx = 0
                vy = -1
                break
            } else if (direction != LEFT && direction != RIGHT && 
                (key == 'd' || key == 'ArrowRight')) {
                direction = RIGHT
                vx = 1
                vy = 0
                break
            } else if (direction != UP && direction != DOWN &&
                (key == 's' || key == 'ArrowDown')) {
                direction = DOWN
                vx = 0
                vy = 1
                break
            }
        }
    } else {
        astar()
    }

    x += vx
    y += vy

    if (x < 0) x = WIDTH - 1
    if (x > WIDTH-1) x = 0
    if (y < 0) y = HEIGHT - 1
    if (y > HEIGHT - 1) y = 0

    // dead
    if ((vx != 0 || vy != 0) && collide(x, y)) {
        if (score > highscore) {
            highscore = score
            document.getElementById('highscore').innerHTML = highscore
        }
        init()
    }

    // eat apple
    if (x == ax && y == ay) {
        snakeLength ++
        do {
            ax = Math.floor(Math.random() * WIDTH)
            ay = Math.floor(Math.random() * HEIGHT)
        } while (collide(ax, ay))
        score ++
        document.getElementById('score').innerHTML = score
    }

    // extend snake
    snake.push({x, y})

    // move tail
    while (snake.length > snakeLength) {
        snake.shift()
    }

}

function collide(x, y) {
    if (x < 0) x = WIDTH-1
    else if (x > WIDTH-1) x = 0
    if (y < 0) y = HEIGHT-1
    else if (y > HEIGHT-1) y = 0
    for (let i=0 ; i<snake.length ; ++i) {
        if (snake[i].x == x && snake[i].y == y) {
            return true
        }
    }
    return false
}

function draw() {

    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'green'
    snake.forEach(p => {
        ctx.fillRect(p.x*10+1, p.y*10+1, 8, 8)
    })
    ctx.fillStyle = 'red'
    ctx.fillRect(ax*10+1, ay*10+1, 8, 8)

}

function init() {
    x = WIDTH / 2
    y = HEIGHT / 2
    snake = [{x, y}]
    vx = vy = 0
    snakeLength = 5
    do {
        ax = Math.floor(Math.random() * WIDTH)
        ay = Math.floor(Math.random() * HEIGHT)
    } while (ax != x && ay != y)
    keyList = []
    direction = 0
    score = 0
    document.getElementById('score').innerHTML = score
}

function keyDown(key) {
    if (key.key == ' ') {
        if (control == 'human') control = 'bot'
        else control = 'human'
    }
    keyList.push(key.key)
}