function cheat() {
	if(game.money == 0) {
		game.money = 100
	}
	game.money *= 2
}

window.onkeypress = function(e) {
	let key = e.key;
	if(key == "w") {
		game.controlUp();
	}else if(key == "s") {
		game.controlDown();
	}else if(key == "a") {
		game.controlLeft();
	}else if(key == "d") {
		game.controlRight();
	}else {
		return
	}
	game.manualCollect()
}

const DOM = {
	board: document.getElementById('board'),
	currentTile: document.getElementById('currentTile'),
	money: document.getElementsByClassName('money'),
}

function renderBoard() {
	const tileWidth = Math.floor(DOM.board.offsetWidth / game.boardSize - 1);
	let boardHTML = ""
	for(let row=0 ; row<game.boardSize ; row++) {
		for(let col=0 ; col<game.boardSize ; col++) {
			let hasPlayer = game.playerRow == row && game.playerCol == col;
			boardHTML += game.getTile(row,col).render(tileWidth, hasPlayer);
		}
	}
	DOM.board.innerHTML = boardHTML
}

function renderUpgrades() {
	for(let e of DOM.money) {
		e.innerHTML = game.money
	}
}

function renderCurrentTile() {
	DOM.currentTile.innerHTML = game.getCurrentTile().render(150)
}

function render() {
	renderUpgrades()
	renderCurrentTile()
	renderBoard()
}

function update() {
	game.update()
}

const updateKey = setInterval(update, 1000)
const renderKey = setInterval(render, 50)
