class Tile {

	static BASIC = 1
	static HANDCRAFTED = 2
	static CHAINED = 3
	static COLLECTOR = 4
	static INDUSTRIAL = 5
	
	constructor(row, col) {
		this.type = Tile.BASIC
		this.row = row
		this.col = col
		this.level = 1
		this.currentValue = 0
	}

	toString() {
		switch(this.type) {
			case Tile.BASIC:
				return "BASIC"
			case Tile.HANDCRAFTED:
				return "HANDCRAFTED"
			case Tile.CHAINED:
				return "CHAINED"
			case Tile.COLLECTOR:
				return "COLLECTOR"
			case Tile.INDUSTRIAL:
				return "INDUSTRIAL"
		}
		return ""
	}

	desc() {
		switch(this.type) {
			case Tile.BASIC:
				return "BASIC tiles"
			case Tile.HANDCRAFTED:
				return "HANDCRAFTED tiles have double the value when collected manually"
			case Tile.CHAINED:
				return "CHAINED tiles collect from their neighbors as well as themselves"
			case Tile.COLLECTOR:
				return "COLLECTOR tiles don't produce money themselves, but they have 20 times more storage and can collect from their neighbors"
			case Tile.INDUSTRIAL:
				return "INDUSTRIAL tiles have double the value when collected by other tiles"
		}
		return ""
	}

	update() {
		switch(this.type) {
			case Tile.BASIC:
			case Tile.HANDCRAFTED:
			case Tile.CHAINED:
			case Tile.INDUSTRIAL:
				if(this.currentValue == this.getMaxValue()) {
					return
				}
				this.currentValue += this.getGrowValue()
				if(this.currentValue > this.getMaxValue()) {
					this.currentValue = this.getMaxValue()
				}
				break;
			case Tile.COLLECTOR:
				if(this.currentValue == this.getMaxValue()) {
					return
				}
				let neighbors = this.neighbors()
				for(let tile of neighbors) {
					this.currentValue += tile.autoCollect()
				}
				if(this.currentValue > this.getMaxValue()) {
					this.currentValue = this.getMaxValue()
				}
				break;
		}
	}

	renderImage(tileWidth) {
		let imgsrc = ""
		switch(this.type) {
			case Tile.HANDCRAFTED:
			case Tile.BASIC:
			case Tile.CHAINED:
			case Tile.INDUSTRIAL:
			case Tile.COLLECTOR:
				imgsrc = "si-glyph-database.svg"
				break
				
		}
		tileWidth -= 4
		return `<img style="position:relative;left:${tileWidth/4}px;top:${tileWidth/4}px;width:${tileWidth/2}px;height:${tileWidth/2}px" src="glyph-iconset-master/svg/${imgsrc}">`
	}

	render(tileWidth, hasPlayer) {
		let playerColor = "rgba(255, 204, 187, 1.0)"
		let highlightColor = "rgba(253, 255, 206, 1.0)"
		if(hasPlayer) {
			highlightColor = "rgba(253, 255, 206, 0.5)"
		}
		if(this.getValuePercentage() == 1.0) {
			highlightColor = "rgb(244, 217, 66)"
		}
		let playerStyle = ""
		if(hasPlayer) {
			playerStyle = `border-color:red;background-color:${playerColor}`
		}
		let img = this.renderImage(tileWidth)

		return `<div class="tile" style="width:${tileWidth}px;height:${tileWidth}px;${playerStyle}">
					<div style="position: absolute;width:${this.getValuePercentage()*(tileWidth-4)}px;height:${tileWidth-4}px;background-color:${highlightColor}">
						${img}
					</div>
				</div>`

	}

	manualCollect() {
		switch(this.type) {
			case Tile.HANDCRAFTED:
				return 2*this.collect()
			case Tile.BASIC:
			case Tile.CHAINED:
			case Tile.INDUSTRIAL:
			case Tile.COLLECTOR:
				return this.collect()
		}
		return 0
	}

	autoCollect() {
		switch(this.type) {
			case Tile.INDUSTRIAL:
				return 2*this.collect()
			case Tile.BASIC:
			case Tile.HANDCRAFTED:
			case Tile.CHAINED:
			case Tile.COLLECTOR:
				return this.collect()
		}
	}

	collect() {

		switch(this.type) {
			case Tile.BASIC:
			case Tile.HANDCRAFTED:
			case Tile.COLLECTOR:
			case Tile.INDUSTRIAL:
				if(this.currentValue == this.getMaxValue()) {
					let collectedValue = this.currentValue
					this.currentValue = 0
					return collectedValue
				}
				break;
			case Tile.CHAINED:
				if(this.currentValue == this.getMaxValue()) {
					let collectedValue = this.currentValue
					this.currentValue = 0
					let neighbors = this.neighbors()
					for(let tile of neighbors) {
						collectedValue += tile.autoCollect()
					}
					return collectedValue
				}
				break;
		}
		return 0
	}

	getMaxValue() {
		switch(this.type) {
			case Tile.INDUSTRIAL:
			case Tile.BASIC:
			case Tile.HANDCRAFTED:
			case Tile.CHAINED:
				return this.getBasicMaxValue()
			case Tile.COLLECTOR:
				return this.getBasicMaxValue()*20
		}
		return 0
	}

	getGrowValue() {
		switch(this.type) {
			case Tile.INDUSTRIAL:
			case Tile.BASIC:
			case Tile.HANDCRAFTED:
			case Tile.CHAINED:
			case Tile.COLLECTOR:
				return this.getBasicGrowValue()
		}
		return 0
	}

	getLevelUpCost() {
		switch(this.type) {
			case Tile.BASIC:
			case Tile.INDUSTRIAL:
			case Tile.HANDCRAFTED:
			case Tile.CHAINED:
			case Tile.COLLECTOR:
				return this.getBasicLevelUpCost()
		}
	}

	getSwitchTypeCost(newType) {
		switch(newType) {
			case Tile.BASIC:
			case Tile.INDUSTRIAL:
			case Tile.HANDCRAFTED:
			case Tile.CHAINED:
			case Tile.COLLECTOR:
				return this.getBasicSwitchTypeCost()
		}
	}

	//common functions
	levelUp() {
		if(game.spendMoney(this.getLevelUpCost())) {
			this.level += 1
		}
	}

	switchType(newType) {
		if(game.spendMoney(this.getSwitchTypeCost(newType))) {
			this.type = newType
		}
	}

	getValuePercentage() {
		return this.currentValue / this.getMaxValue()
	}

	getBasicMaxValue() {
		return this.level*10*game.maxValueMult
	}

	getBasicGrowValue() {
		return this.level*game.growValueMult
	}

	getBasicLevelUpCost() {
		return Math.ceil(1.12**this.level*5)
	}

	getBasicSwitchTypeCost() {
		return Math.ceil(1.12**this.level*10)
	}

	neighbors() {
		let ret = []
		let upTile = game.getTile(row-1, col)
		let downTile = game.getTile(row+1, col)
		let leftTile = game.getTile(row, col-1)
		let rightTile = game.getTile(row, col+1)
		if(upTile != undefined) {
			ret.push(upTile)
		}
		if(downTile != undefined) {
			ret.push(downTile)
		}
		if(leftTile != undefined) {
			ret.push(leftTile)
		}
		if(rightTile != undefined) {
			ret.push(rightTile)
		}
		return ret
	}

}

