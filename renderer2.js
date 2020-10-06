class Shape {
    id = 0
    color = '#000'
    spawnPosition = {
        x: 0,
        y: 0
    }

    setSpawnPosition(x, y) {
        this.spawnPosition.x = x
        this.spawnPosition.y = y
    }
}

class Cell {
    row = 0
    column = 0

    constructor(row, column) {
        this.row = row
        this.column = column
    }
}



class LRShape extends Shape {
    cells = [
        [new Cell(1, 3)],
        [new Cell(2, 1), new Cell(2, 2), new Cell(2, 3)],
    ]
}

class TShape extends Shape {
    cells = [
        [new Cell(1, 2)],
        [new Cell(2, 1), new Cell(2, 2), new Cell(2, 3)],
    ]
}

class ZShape extends Shape {
    cells = [
        [new Cell(1, 1), new Cell(1, 2)],
        [new Cell(2, 2), new Cell(2, 3)],
    ]
}

class SShape extends Shape {
    cells = [
        [new Cell(1, 2), new Cell(1, 3)],
        [new Cell(2, 1), new Cell(2, 2)],
    ]
}

class IShape extends Shape {
    cells = [
        [new Cell(1, 1)],
        [new Cell(2, 1)],
        [new Cell(3, 1)],
        [new Cell(4, 1)],
    ]
}

class SquareShape extends Shape {
    cells = [
        [new Cell(1, 1)],
        [new Cell(2, 2)],
    ]
}

let Shapes = [
    //TODO this works, keep doing it
    class LShape extends Shape {
        cells = [
            [new Cell(1, 1)],
            [new Cell(2, 1), new Cell(2, 2), new Cell(2, 3)],
        ]
    },
    LRShape,
    TShape,
    ZShape,
    SShape,
    IShape,
    SquareShape
]

class Game {
    canvasElement
    convasCtx
    fieldBottom = 0
    fieldWidth = 0
    cellSize = 20

    //Interval
    loop

    shapeDefinitions = []

    activeShape = null
    fixedShapes = []

    constructor(props) {
        this.canvasElement = document.getElementById("canvas")
        this.convasCtx = this.canvasElement.getContext('2d')
        this.fieldBottom = this.canvasElement.height
        this.fieldWidth = this.canvasElement.width
        this.setEvents()
    }

    setEvents() {
        window.addEventListener('keydown', (e) => {
            if (this.loop !== null) {
                switch (e.key) {
                case 'ArrowLeft':
                    if (this.activeShape !== null) {
                        Game.moveShapesSideways('left')
                        Game.draw()
                    }
                    break
                case 'ArrowRight':
                    if (Game.activeShape !== null) {
                        Game.moveShapesSideways('right')
                        Game.draw()
                    }
                    break
                case 'ArrowDown':
                    if (Game.activeShape !== null) {
                        Game.moveShapesDown()
                        Game.draw()
                    }
                    break
                case 'ArrowUp':
                    if (Game.activeShape !== null) {
                        Game.rotateShapes()
                        Game.draw()
                    }
                    break
                }
            }
        }, true)
    }

    moveShapesDown() {
        if (this.activeShape === null) {
            this.spawnShape(this.getRandomShape())
        } else {
            this.activeShape.y += this.cellSize
            if (this.collisionDetected() || this.hitBottom()) {
                if (this.activeShape.y < this.getShapeHeight(this.activeShape)) {
                    clearInterval(this.interval)
                    this.interval = null
                    alert('Game over')
                }
                this.activeShape.y -= this.cellSize
                this.fixedShapes.push(Object.assign({}, this.activeShape))
                this.activeShape = null
            }
        }
    }

    /**
     * @param {Shape} shape
     */
    spawnShape(shape) {
        shape.id = this.getUniqueId()
        shape.setSpawnPosition(this.fieldWidth / 2, 0)
        shape.color = this.getRandomColor()
        this.activeShape = shape
    }

    /**
     * @returns {Shape}
     */
    getRandomShape() {
        // TODO continue here
        return new window['LShape']()
    }

    /**
     * @returns {string}
     */
    getRandomColor() {
        let letters = '0123456789ABCDEF';
        let color = '';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return '#000'
        return '#' + color
    }

    /**
     * @returns {number}
     */
    getUniqueId() {
        return Math.round(Math.random() * 100000000);
    }

    draw() {
        let shapes = [...this.fixedShapes]
        if (this.activeShape !== null) {
            shapes.push(this.activeShape)
        }

        this.convasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
        shapes.forEach((shape) => {
            let x = shape.x
            let y = shape.y
            shape.cells.forEach((row) => {
                row.forEach((cellValue) => {
                    if (cellValue === 1) {
                        context.fillStyle = shape.color
                        context.fillRect(x, y, this.cellSize, this.cellSize)
                        context.strokeRect(x, y, this.cellSize, this.cellSize)

                        context.fillStyle = '#fff'
                        context.fillText(y, x, y + this.cellSize, this.cellSize)
                    }
                    x += Game.cellSize
                })
                y += Game.cellSize
                x = shape.x
            })
            context.fillStyle = '#000'
            context.fillText(shape.id, shape.x, shape.y)
        })
    }
}
