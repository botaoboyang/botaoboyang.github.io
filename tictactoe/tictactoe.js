
console.log('tictactoe.js');

const RUNNING = 0
const X_win = 1
const O_win = 2
const DRAW = 3

var AI_player = 'X'

var end = false;
var current = 'X'
var board = [['', '', ''],
			['', '', ''],
			['', '', '']]

var tip = document.getElementById("tip");
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.lineWidth = 3;

reset()
window.addEventListener('mouseup', function (e) {
	let rect = canvas.getBoundingClientRect(); 
	let x = e.clientX - rect.left - 2;
	let y = e.clientY - rect.top - 2;
	if(x >= 0 && x < 300 && y >= 0 && y<300) {
		let row = Math.floor(y / 100);
		let col = Math.floor(x / 100);
		takeTurn(row, col)
	}
})

function copyBoard(board) {
	let ret = []
	for(let row=0 ; row<3 ; row++) {
		ret[row] = []
		for(let col=0 ; col<3 ; col++) {
			ret[row][col] = board[row][col]
		}
	}
	return ret
}

function reset(switchRole) {
	ctx.clearRect(0, 0, 300, 300);
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, 300, 300);
	board = [['', '', ''],
			['', '', ''],
			['', '', '']];
	current = 'X';
	tip.innerHTML = 'X';
	end = false;
	drawBackground();
	if(switchRole) {
		AI_player = getOpponent(AI_player)
	}
	if(AI_player == 'X') {
		minmax(AI_player)
	}
}

function randomTurn(player) {
	if(end || current != player) {
		return
	}
	let emptyCells = getEmptyCells(board)
	let r = Math.floor(Math.random() * emptyCells.length)
	let row = emptyCells[r][0]
	let col = emptyCells[r][1]
	takeTurn(row, col)
}

function minmax(player) {
	if(end || current != player) {
		return
	}
	let bestCells = evaluate(player, board).cells
	let r = Math.floor(Math.random() * bestCells.length)
	let row = bestCells[r][0]
	let col = bestCells[r][1]
	takeTurn(row, col)
}

function getOpponent(player) {
	if(player == 'X') {
		return 'O'
	}else {
		return 'X'
	}
}

function evaluate(player, board) {
	let state = getState(board)
	if(state == DRAW) {
		return {score: 0}
	}else if(state == X_win) {
		if(player == 'X') {
			return {score: 1}
		}else {
			return {score: -1}
		}
	}else if(state == O_win) {
		if(player == 'O') {
			return {score: 1}
		}else {
			return {score: -1}
		}
	}
	//state == RUNNING
	let emptyCells = getEmptyCells(board)
	let opponent = getOpponent(player)
	let score = -1
	let cells = []
	emptyCells.forEach(cell => {
		let row = cell[0]
		let col = cell[1]
		let newBoard = copyBoard(board)
		newBoard[row][col] = player
		let newBoardScore = -evaluate(opponent, newBoard).score

		if(newBoardScore > score) {
			score = newBoardScore
			cells = [[row, col]]
		}else if(newBoardScore == score) {
			cells.push([row, col])
		}
	})
	return {score, cells}
}

function getEmptyCells(board) {
	let ret = []
	for(let row=0 ; row<3 ; row++) {
		for(let col=0 ; col<3 ; col++) {
			if(board[row][col] == '') {
				ret.push([row, col])
			}
		}
	}
	return ret
}

function takeTurn(row, col) {
	if(end || board[row][col] != "") {
		return false;
	}
	board[row][col] = current;
	if(current == 'X') {
		current = 'O';
	}else {
		current = 'X';
	}
	drawBoard();
	checkState();

	//AI
	if(current == AI_player) {
		setTimeout(() => minmax(AI_player), 50)
	}

	return true;
}

function checkState() {
	let state = getState(board)
	if(state == RUNNING) {
		tip.innerHTML = current
	}else if(state == X_win) {
		end = true
		tip.innerHTML = 'X has won!'
	}else if(state == O_win) {
		end = true
		tip.innerHTML = 'O has won!'
	}else if(state == DRAW) {
		end = true
		tip.innerHTML = 'DRAW'
	}
}

function getState(board) {
	for(let row=0 ; row<3 ; row++) {
		if(board[row][0] == board[row][1] && board[row][0] == board[row][2]) {
			if(board[row][0] == 'X') {
				return X_win
			}else if(board[row][0] == 'O') {
				return O_win
			}
		}
	}

	for(let col=0 ; col<3 ; col++) {
		if(board[0][col] == board[1][col] && board[0][col] == board[2][col]) {
			if(board[0][col] == 'X') {
				return X_win
			}else if(board[0][col] == 'O') {
				return O_win
			}
		}
	}

	if(board[1][1] == board[0][0] && board[1][1] == board[2][2]) {
		if(board[1][1] == 'X') {
			return X_win
		}else if(board[1][1] == 'O') {
			return O_win
		}
	}

	if(board[1][1] == board[0][2] && board[1][1] == board[2][0]) {
		if(board[1][1] == 'X') {
			return X_win
		}else if(board[1][1] == 'O') {
			return O_win
		}
	}

	let draw = true
	for(let row=0 ; row<3 ; row++) {
		for(let col=0 ; col<3 ; col++) {
			if(board[row][col] == '') {
				draw = false;
			}
		}
	}
	if(draw) {
		return DRAW
	}
	return RUNNING
}

function drawBoard() {
	for(let row=0 ; row<3 ; row++) {
		for(let col=0 ; col<3 ; col++) {
			if(board[row][col] == 'X') {
				drawX(row, col);
			}else if(board[row][col] == 'O') {
				drawO(row, col);
			}
		}
	}
}

function drawBackground() {
	ctx.beginPath();
	ctx.moveTo(0, 100);
	ctx.lineTo(300, 100);
	ctx.moveTo(0, 200);
	ctx.lineTo(300, 200);
	ctx.moveTo(100, 0);
	ctx.lineTo(100, 300);
	ctx.moveTo(200, 0);
	ctx.lineTo(200, 300);
	ctx.stroke();
}

function drawX(row, col) {
	const SIZE = 26;
	let x = col * 100 + 50;
	let y = row * 100 + 50;
	ctx.beginPath();
	ctx.moveTo(x-SIZE, y-SIZE);
	ctx.lineTo(x+SIZE, y+SIZE);
	ctx.moveTo(x-SIZE, y+SIZE);
	ctx.lineTo(x+SIZE, y-SIZE);
	ctx.stroke();
}

function drawO(row, col) {
	const SIZE = 30;
	let x = col * 100 + 50;
	let y = row * 100 + 50;
	ctx.beginPath();
	ctx.arc(x, y, SIZE, 0, 2*Math.PI);
	ctx.stroke();
}
