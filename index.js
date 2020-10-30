rowHints = [[1, 1], [4], [4], [2, 2], [6], [5, 1], [5, 1], [6, 2], [8, 1], [9], [9], [1, 7], [1, 1, 5], [1, 1, 4], [2, 1, 4]]
colHints = [[4, 1], [15], [10], [2, 11], [12], [3, 6, 1], [1, 7], [7], [2, 6], [1, 2, 4]]

var app = new Vue({
    el: '#app',
    data: {
        styleMap: {
            '-1': {backgroundColor: '#ffffff'},
            '0': {backgroundColor: '#ffffff'},
            '1': {backgroundColor: '#000000'},
        },
        rowHints,
        colHints,
        width: 0,
        height: 0,
        board: [],
        rowTable: [],
        colTable: [],
    },
    mounted: function() {
        this.height = this.rowHints.length
        this.width = this.colHints.length
        this.board = generateEmptyBoard(this.rowHints, this.colHints)
        this.rowTable = fillHintTable(this.rowHints)
        this.colTable = fillHintTable(this.colHints)
        this.colTable = rotate2dArray(this.colTable)
    },
    computed: {
    },
    methods: {
        updateBoard: function(i, j, newValue) {
            if (i >= 0 && j >= 0 && i < this.height && j < this.width) {
                Vue.set(this.board[i], j, newValue)
            }
        },
        clickTile: function(i, j) {
            if (this.board[i][j] == 0) {
                this.updateBoard(i, j, 1)
            } else if (this.board[i][j] == -1){
                this.updateBoard(i, j, 0)
            } else {
                this.updateBoard(i, j, -1)
            }
        },
        rightClickTile: function() {

        },
    }
})

function generateEmptyBoard(rowHints, colHints) {
    let board = Array(rowHints.length)
    for(let i=0 ; i<rowHints.length ; i++) {
        let row = Array(colHints.length)
        row.fill(0)
        board[i] = row
    }
    return board
}

function fillHintTable(hints) {
    let maxLength = Math.max(...hints.map(r => r.length))
    let table = []
    for (let i=0 ; i<hints.length ; i++) {
        let row = Array(maxLength)
        row.fill(0)
        row.splice(maxLength-hints[i].length, hints[i].length, ...hints[i])
        table.push(row)
    }
    return table
}

function rotate2dArray(arr) {
    let ret = []
    for (let i=0 ; i<arr[0].length ; i++) {
        let row = []
        for (let j=0 ; j<arr.length ; j++) {
            row.push(arr[j][i])
        }
        ret.push(row)
    }
    return ret
}