let Game = {
    interval: null,
    shapesDefinition: {},
    element: null,
    cellSize: 20,
    spawnPoint: 300,
    bottom: 0,
    width: 0,

    activeShape: null,
    fixedShapes: [],

    initialize: () => {
        Game.element = document.getElementById("canvas")
        Game.bottom = Game.element.height
        Game.width = Game.element.width

        let shape = {
            me: this,
            color: '#000',
            x: 0,
            y: 0,
            cells: []
        }

        Game.shapesDefinition.L = Object.create(shape)
        Game.shapesDefinition.L.cells = [
            [1, 0, 0],
            [1, 1, 1],
        ]
        Game.shapesDefinition.T = Object.create(shape)
        Game.shapesDefinition.T.cells = [
            [0, 1, 0],
            [1, 1, 1],
        ]

        Game.shapesDefinition.Z = Object.create(shape)
        Game.shapesDefinition.Z.cells = [
            [1, 1, 0],
            [0, 1, 1],
        ]

        Game.shapesDefinition.Line = Object.create(shape)
        Game.shapesDefinition.Line.cells = [
            [1],
            [1],
            [1],
            [1]
        ]

        Game.shapesDefinition.Square = Object.create(shape)
        Game.shapesDefinition.Square.cells = [
            [1, 1],
            [1, 1],
        ]

        window.addEventListener('keydown', (e) => {
            if (Game.interval !== null) {
                switch (e.key) {
                case 'ArrowLeft':
                    if (Game.activeShape !== null) {
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
                    Game.moveShapesDown()
                    Game.draw()
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
    },

    start: () => {
        Game.interval = setInterval(() => {
            Game.moveShapesDown()
            Game.tetrisDetected()
            Game.draw()
        }, 1000)
    },

    draw: () => {
        let context = Game.element.getContext("2d")
        let shapes = [...Game.fixedShapes]
        if (Game.activeShape !== null) {
            shapes.push(Game.activeShape)
        }

        context.clearRect(0, 0, Game.element.width, Game.element.height);
        shapes.forEach((shape) => {
            let x = shape.x
            let y = shape.y
            shape.cells.forEach((row) => {
                context.fillStyle = shape.color
                row.forEach((cellValue) => {
                    if (cellValue === 1) {
                        context.fillRect(x, y, Game.cellSize, Game.cellSize)
                    }
                    x += Game.cellSize
                })
                y += Game.cellSize
                x = shape.x
            })
        })
    },

    addShape: (shape) => {
        shape.y = 0
        shape.x = Game.spawnPoint
        shape.color = Game.getRandomColor()
        Game.activeShape = shape
    },

    moveShapesDown: () => {
        if (Game.activeShape === null) {
            Game.addShape(Game.getRandomShape())
        } else {
            Game.activeShape.y += Game.cellSize
            if (Game.collisionDetected() || Game.hitBottom()) {
                if (Game.activeShape.y < Game.getShapeHeight(Game.activeShape)) {
                    clearInterval(Game.interval)
                    Game.interval = null
                    console.log('Game over')
                }
                Game.activeShape.y -= Game.cellSize
                Game.fixedShapes.push(Game.activeShape)
                Game.activeShape = null
            }
        }
    },

    moveShapesSideways: (direction) => {
        let difference = 0
        switch (direction) {
        case 'left':
            difference -= Game.cellSize
            break
        case 'right':
            difference += Game.cellSize
            break
        }
        Game.activeShape.x += difference
        if (Game.collisionDetected() || Game.outOfBoundsDetected()) {
            Game.activeShape.x -= difference
        }
    },

    rotateShapes: () => {
        let originalCells = Game.activeShape.cells.slice()
        originalCells.reverse()

        let rotatedRowsCount = originalCells[0].length
        let rotatedColumnsCount = originalCells.length

        let rotatedCells = []
        for (let i = 0; i < rotatedRowsCount; i++) {
            let rotatedRow = []
            for (let j = 0; j < rotatedColumnsCount; j++) {
                rotatedRow.push(originalCells[j][i])
            }
            rotatedCells.push(rotatedRow);
        }
        Game.activeShape.cells = rotatedCells
    },

    tetrisDetected: () => {
        let linesToCheck = []
        Game.fixedShapes.forEach((shape) => {
            let y = shape.y
            shape.cells.forEach((row) => {
                if (row.indexOf(0) === -1) {
                    if (linesToCheck[y] === undefined) {
                        linesToCheck[y] = 0
                    }
                    linesToCheck[y] += row.length
                }
                y += Game.cellSize
            })
        })

        linesToCheck.forEach((filledCellsCount, y) => {
            if (filledCellsCount >= Game.width / Game.cellSize) {
                console.log('Tetris detected in line ' + y / Game.cellSize)
            }
        })
    },

    hitBottom: () => {
        return Game.activeShape.y + Game.getShapeHeight(Game.activeShape) >= Game.bottom + Game.cellSize;
    },

    collisionDetected: () => {
        let colliding = false
        let activeX = Game.activeShape.x
        let activeY = Game.activeShape.y
        Game.activeShape.cells.forEach((activeRow) => {
            activeRow.forEach((activeCellValue) => {
                if (activeCellValue === 1) {
                    Game.fixedShapes.forEach((fixedShape) => {
                        let fixedX = fixedShape.x
                        let fixedY = fixedShape.y
                        fixedShape.cells.forEach((fixedRow) => {
                            fixedRow.some((fixedCellValue) => {
                                if (fixedCellValue === 1) {
                                    if (fixedX === activeX && fixedY === activeY) {
                                        colliding = true
                                    }
                                }
                                fixedX += Game.cellSize
                            })
                            fixedY += Game.cellSize
                            fixedX = fixedShape.x
                        })
                    })

                }
                activeX += Game.cellSize
            })
            activeY += Game.cellSize
            activeX = Game.activeShape.x
        })
        return colliding
    },

    outOfBoundsDetected: () => {
        return Game.activeShape.x < 0 || Game.activeShape.x + Game.getShapeWidth(Game.activeShape) > Game.width;
    },

    getShapeHeight: (shape) => {
        let height = 0
        shape.cells.forEach((row) => {
            if (row.indexOf(1) !== -1) {
                height += Game.cellSize
            }
        })
        return height
    },

    getShapeWidth: (shape) => {
        return shape.cells[0].length * Game.cellSize
    },

    getRandomShape: () => {
        let keys = Object.keys(Game.shapesDefinition);
        return Object.assign({}, Game.shapesDefinition[keys[keys.length * Math.random() << 0]]);
    },

    getRandomColor: () => {
        let letters = '0123456789ABCDEF';
        let color = '';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return '#' + color;
    }
}

Game.initialize()
Game.start()
