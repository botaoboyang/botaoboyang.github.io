
class Game {

	constructor() {
		this.money = 0
		this.boardSize = 2
		this.board = []
		this.upgrades = []
		this.unlockedTiles = new Set()
		this.playerRow = 0
		this.playerCol = 0
		this.maxValueMult = 1
		this.growValueMult = 1

		//init board
		for(let row=0 ; row<this.boardSize ; row++) {
			this.board[row] = []
			for(let col=0 ; col<this.boardSize ; col++) {
				this.newTile(row, col)
			}
		}

		//initUpgrades
		this.upgrades.push({
			name: "Expand 1",
			cost: 1000,
			buy: function() {
				if(game.spendMoney(this.cost)) {
					game.expandBoard();
					return true
				}
				return false
			},
		});
		this.upgrades.push({
			name: "Expand 2",
			cost: 10000,
			buy: function() {
				if(game.spendMoney(this.cost)) {
					game.expandBoard();
					return true
				}
				return false
			},
		});
		this.upgrades.push({
			name: "Expand 3",
			cost: 100000,
			buy: function() {
				if(game.spendMoney(this.cost)) {
					game.expandBoard();
					return true
				}
				return false
			},
		});

		this.upgrades.push({
			name: "Larger Storage 1",
			cost: 200,
			buy: function() {
				if(game.spendMoney(this.cost)) {
					game.maxValueMult *= 2
					return true
				}
				return false
			},
		});
		this.upgrades.push({
			name: "Larger Storage 2",
			cost: 400,
			buy: function() {
				if(game.spendMoney(this.cost)) {
					game.maxValueMult *= 2
					return true
				}
				return false
			},
		});
		this.upgrades.push({
			name: "Larger Storage 3",
			cost: 800,
			buy: function() {
				if(game.spendMoney(this.cost)) {
					game.maxValueMult *= 2
					return true
				}
				return false
			},
		});
		this.upgrades.push({
			name: "Larger Storage 4",
			cost: 1600,
			buy: function() {
				if(game.spendMoney(this.cost)) {
					game.maxValueMult *= 2
					return true
				}
				return false
			},
		});
		this.upgrades.push({
			name: "Larger Storage 5",
			cost: 3200,
			buy: function() {
				if(game.spendMoney(this.cost)) {
					game.maxValueMult *= 2
					return true
				}
				return false
			},
		});
		this.upgrades.push({
			name: "Larger Storage 6",
			cost: 6400,
			buy: function() {
				if(game.spendMoney(this.cost)) {
					game.maxValueMult *= 2
					return true
				}
				return false
			},
		});

		this.upgrades.sort((a,b)=>{return a.cost-b.cost})

	}

	update() {
		for(let row=0 ; row<this.boardSize ; row++) {
			for(let col=0 ; col<this.boardSize ; col++) {
				this.board[row][col].update()
			}
		}
		this.manualCollect()
	}

	manualCollect() {
		this.money += this.board[this.playerRow][this.playerCol].manualCollect()
	}

	buyUpgrade(index) {
		if(index < 0 || index >= this.upgrades.length) {
			return false
		}
		if(this.upgrades[index].buy()) {
			let newUpgrades = this.upgrades.slice(0, index).concat(this.upgrades.slice(index+1))
			this.upgrades = newUpgrades
			return true
		}
		return false
	}

	hasUnlockedTile(tileType) {
		return this.unlockedTiles.has(tileType)
	}

	unlockTile(tileType) {
		this.unlockedTiles.add(tileType)
	}

	isValidPoint(row, col) {
		return row >= 0 && col >= 0 && row < this.boardSize && col < this.boardSize
	}

	addMoney(m) {
		this.money += m
	}

	spendMoney(cost) {
		if(this.money < cost) {
			return false
		}
		this.money -= cost
		return true
	}

	expandBoard() {
		for(let row=0 ; row<this.boardSize ; row++) {
			this.newTile(row, this.boardSize);
		}
		this.board.push([])
		for(let col=0 ; col<this.boardSize+1 ; col++) {
			this.newTile(this.boardSize, col);
		}
		this.boardSize ++;
	}

	newTile(row, col) {
		this.board[row][col] = new Tile(row, col)
	}

	getTile(row, col) {
		if(this.isValidPoint(row, col)) {
			return this.board[row][col]
		}
		return undefined
	}

	getCurrentTile() {
		return this.getTile(this.playerRow, this.playerCol)
	}

	controlUp() {
		if(this.isValidPoint(this.playerRow-1, this.playerCol)) {
			this.playerRow -= 1
		}
	}

	controlDown() {
		if(this.isValidPoint(this.playerRow+1, this.playerCol)) {
			this.playerRow += 1
		}
	}

	controlLeft() {
		if(this.isValidPoint(this.playerRow, this.playerCol-1)) {
			this.playerCol -= 1
		}
	}

	controlRight() {
		if(this.isValidPoint(this.playerRow, this.playerCol+1)) {
			this.playerCol += 1
		}
	}

}

const game = new Game()