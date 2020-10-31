var leftPlayerBtn = document.getElementById("leftPlayerBtn")
var rightPlayerBtn = document.getElementById("rightPlayerBtn")
var pauseBtn = document.getElementById("pauseBtn")
var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d")

var game = {
	pause: false,
	start: false,
	leftPlayer: {
		id: 'left',
		human: true,
		pos: 250,
		width: 80,
		moveMent: 0,
		speed: 3,
		score: 0,
	},
	rightPlayer: {
		id: 'right',
		human: false,
		pos: 250,
		width: 80,
		moveMent: 0,
		speed: 3,
		score: 0,
	},
	ball: {
		x: 300,
		y: 250,
		xSpeed: 0,
		ySpeed: 0,
		speedMult: 1.0,
	},
	boosts: [],
	buffs: [],
}

document.addEventListener('keyup', function(e) {
	if(e.key == 'w' && game.leftPlayer.moveMent == -1) {
		game.leftPlayer.moveMent = 0
	}else if(e.key == 's' && game.leftPlayer.moveMent == 1) {
		game.leftPlayer.moveMent = 0
	}else if(e.key == 'ArrowUp' && game.rightPlayer.moveMent == -1) {
		game.rightPlayer.moveMent = 0
	}else if(e.key == 'ArrowDown' && game.rightPlayer.moveMent == 1) {
		game.rightPlayer.moveMent = 0
	}
})

document.addEventListener('keydown', function(e) {
	if(e.key == ' ') {
		startGame()
	}else if(e.key == 'w' && game.leftPlayer.human) {
		game.leftPlayer.moveMent = -1
	}else if(e.key == 's' && game.leftPlayer.human) {
		game.leftPlayer.moveMent = 1
	}else if(e.key == 'ArrowUp' && game.rightPlayer.human) {
		game.rightPlayer.moveMent = -1
	}else if(e.key == 'ArrowDown' && game.rightPlayer.human) {
		game.rightPlayer.moveMent = 1
	}
})

function pauseBtnClick() {
	if(!game.pause) {
		game.pause = true
		stopInterval()
		pauseBtn.innerHTML = 'resume'
	}else {
		game.pause = false
		startInterval()
		pauseBtn.innerHTML = 'pause'
	}
}

function leftPlayerBtnClick() {
	if(game.leftPlayer.human) {
		game.leftPlayer.human = false
		leftPlayerBtn.innerHTML = "Computer"
	}else {
		game.leftPlayer.human = true
		game.leftPlayer.moveMent = 0
		leftPlayerBtn.innerHTML = "Human"
	}
}

function rightPlayerBtnClick() {
	if(game.rightPlayer.human) {
		game.rightPlayer.human = false
		rightPlayerBtn.innerHTML = "Computer"
	}else {
		game.rightPlayer.human = true
		game.rightPlayer.moveMent = 0
		rightPlayerBtn.innerHTML = "Human"
	}
}

var flag;
startInterval()

function startInterval() {
	flag = setInterval(gameLoop, 1000/60)
}

function stopInterval() {
	clearInterval(flag)
}

function gameLoop() {
	update()
	render()
}

function reset() {
	game.leftPlayer.pos = 250
	game.rightPlayer.pos = 250
	game.ball.x = 300
	game.ball.y = 250
	game.ball.xSpeed = 0
	game.ball.ySpeed = 0
	game.ball.speedMult = 1.0
	game.boosts = []
	game.start = false
}

function startGame() {
	if(!game.start) {
		game.start = true
		game.ball.xSpeed = Math.random() < 0.5 ? -2 : 2
		game.ball.ySpeed = Math.random() * 2 - 1
	}
}

function update() {
	if(!game.start && !game.leftPlayer.human && !game.rightPlayer.human) {
		startGame()
	}
	updatePlayer(game.leftPlayer)
	updatePlayer(game.rightPlayer)
	updateBall(game.ball)
	updateBoosts()
}

function updateBoosts() {
	let ball = game.ball
	let boosts = game.boosts
	for(let i=0 ; i<boosts.length ; i++) {
		let d = getDist(ball, boosts[i])
		if(d <= 17) {
			boosts.splice(i, 1)
			applyBoost()
			break
		}
	}
}

function applyBoost() {
	let player;
	if(game.ball.xSpeed > 0) {
		player = game.leftPlayer
	}else {
		player = game.rightPlayer
	}
	let r = Math.floor(Math.random() * 2)
	if(r == 0) {
		return applyWidthBuff(player)
	}else if(r == 1) {
		return applySpeedBuff(player)
	}
}

function applySpeedBuff(player) {
	let id = player.id + '+speed'
	for(let i=0 ; i<game.buffs.length ; i++) {
		if(game.buffs[i].id == id) {
			game.buffs[i].duration = 2
			return id
		}
	}
	player.speed *= 1.5
	let buff = {
		id: id,
		playerId: player.id,
		duration: 2,
		wearoff: function() {
			player.speed = 3
		},
	}
	game.buffs.push(buff)
	return id
}

function applyWidthBuff(player) {
	let id = player.id + '+width'
	for(let i=0 ; i<game.buffs.length ; i++) {
		if(game.buffs[i].id == id) {
			game.buffs[i].duration = 2
			return id
		}
	}
	player.width *= 1.5
	let buff = {
		id: id,
		playerId: player.id,
		duration: 2,
		wearoff: function() {
			player.width = 80
		},
	}
	game.buffs.push(buff)
	return id
}

function getDist(ball, boost) {
	return Math.sqrt((ball.x - boost.x) ** 2 + (ball.y - boost.y) ** 2)
}

function updatePlayer(player) {
	if(!player.human) {
		controlPlayer(player)
	}
	player.pos += player.moveMent * player.speed
	if(player.pos + player.width/2 > 500) {
		player.pos = 500 - player.width/2
	}else if(player.pos - player.width/2 < 0) {
		player.pos = player.width/2
	}
}

function controlPlayer(player) {
	player.moveMent = Math.sign(game.ball.y - player.pos)
}

function updateBall(ball) {
	ball.x += ball.xSpeed * ball.speedMult
	ball.y += ball.ySpeed * ball.speedMult

	if(ball.y >= 500) {
		ball.y = 500
		ball.ySpeed = -ball.ySpeed
	}else if(ball.y <= 0) {
		ball.y = 0
		ball.ySpeed = -ball.ySpeed
	}

	if(ball.xSpeed < 0 && ball.x >= 10 && ball.x <= 26 && hitball(game.leftPlayer)) {
		ball.xSpeed = 2
		ball.ySpeed = 4 * (Math.random() * 0.5) + 0.2 * ball.ySpeed + 0.5 * game.leftPlayer.moveMent
		ball.speedMult += 0.02
		addBoost()
		updateBuffs(game.leftPlayer)
	}else if(ball.xSpeed > 0 && ball.x >= 574 && ball.x <= 590 && hitball(game.rightPlayer)) {
		ball.xSpeed = -2
		ball.ySpeed = 4 * (Math.random() * 0.5) + 0.2 * ball.ySpeed + 0.5 * game.leftPlayer.moveMent
		ball.speedMult += 0.02
		addBoost()
		updateBuffs(game.rightPlayer)
	}else if(ball.x <= 0) {
		game.rightPlayer.score += 1
		reset()
	}else if(ball.x >= 600) {
		game.leftPlayer.score += 1
		reset()
	}

}

function updateBuffs(player) {
	let temp = []
	for(let i=0 ; i<game.buffs.length ; i++) {
		if(game.buffs[i].playerId == player.id) {
			game.buffs[i].duration -= 1
			if(game.buffs[i].duration == 0) {
				game.buffs[i].wearoff()
			}
		}
	}
	for(let i=0 ; i<game.buffs.length ; i++) {
		if(game.buffs[i].duration > 0) {
			temp.push(game.buffs[i])
		}
	}
	game.buffs = temp
}

function addBoost() {
	if(Math.random() < 1) {
		let boost = {
			x: Math.random() * 400 + 100,
			y: Math.random() * 460 + 20,
		}
		game.boosts.push(boost)
	}
}

function hitball(player) {
	return game.ball.y >= player.pos - player.width / 2 && game.ball.y <= player.pos + player.width/2
}

function render() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	renderBackground()
	renderScoreBoard()
	renderPlayer()
	renderBoosts()
	renderBall()
}

function renderBackground() {
	ctx.fillStyle = 'black'
	ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function renderScoreBoard() {
	ctx.globalAlpha = 0.5
	ctx.font = '50px serif'
	ctx.textAlign = 'center'

	ctx.fillStyle = 'white'
	ctx.fillText(':', 300, 120)

	ctx.fillStyle = 'blue'
	ctx.textAlign = 'right'
	ctx.fillText(game.leftPlayer.score, 280, 125)

	ctx.fillStyle = 'red'
	ctx.textAlign = 'left'
	ctx.fillText(game.rightPlayer.score, 320, 125)

	ctx.globalAlpha = 1.0
}

function renderPlayer() {
	ctx.lineWidth = 5

	ctx.strokeStyle = 'blue'
	ctx.beginPath()
	ctx.moveTo(20, game.leftPlayer.pos - game.leftPlayer.width/2)
	ctx.lineTo(20, game.leftPlayer.pos + game.leftPlayer.width/2)
	ctx.closePath()
	ctx.stroke()

	ctx.strokeStyle = 'red'
	ctx.beginPath()
	ctx.moveTo(580, game.rightPlayer.pos - game.rightPlayer.width/2)
	ctx.lineTo(580, game.rightPlayer.pos + game.rightPlayer.width/2)
	ctx.closePath()
	ctx.stroke()
}

function renderBall() {
	ctx.fillStyle = 'yellow'
	ctx.beginPath()
	ctx.arc(game.ball.x, game.ball.y, 5, 0, 2*Math.PI)
	ctx.closePath()
	ctx.fill()
}

function renderBoosts() {
	ctx.lineWidth = 2
	ctx.strokeStyle = 'white'
	game.boosts.forEach(boost => {
		ctx.beginPath()
		ctx.arc(boost.x, boost.y, 12, 0, 2*Math.PI)

		ctx.moveTo(boost.x-5, boost.y)
		ctx.lineTo(boost.x, boost.y-5)
		ctx.lineTo(boost.x+5, boost.y)

		ctx.moveTo(boost.x-5, boost.y+4)
		ctx.lineTo(boost.x, boost.y-1)
		ctx.lineTo(boost.x+5, boost.y+4)

		ctx.stroke()
	})
}
