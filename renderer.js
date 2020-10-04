let Game = {
    interval: null,
    shapesDefinition: {},
    element: null,
    rectangleSize: 20,
    spawnPoint: 300,
    bottom: 520,

    activeShape: null,
    fixedShapes: [],

    initialize: () => {
        Game.element = document.getElementById("canvas")

        let shape = {
            me: this,
            color: '#000',
            x: 0,
            y: 0,
            rectangles: []
        }

        Game.shapesDefinition.L = Object.create(shape)
        Game.shapesDefinition.L.rectangles = [
            [1, 0, 0],
            [1, 1, 1],
        ]
        Game.shapesDefinition.T = Object.create(shape)
        Game.shapesDefinition.T.rectangles = [
            [0, 1, 0],
            [1, 1, 1],
        ]

        Game.shapesDefinition.Z = Object.create(shape)
        Game.shapesDefinition.Z.rectangles = [
            [1, 1, 0],
            [0, 1, 1],
        ]

        Game.shapesDefinition.Line = Object.create(shape)
        Game.shapesDefinition.Line.rectangles = [
            [1],
            [1],
            [1],
            [1]
        ]

        Game.shapesDefinition.Square = Object.create(shape)
        Game.shapesDefinition.Square.rectangles = [
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
            console.log('Game loop tick')
            Game.moveShapesDown()
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
            shape.rectangles.forEach((row) => {
                context.fillStyle = shape.color
                row.forEach((cellValue) => {
                    if (cellValue === 1) {
                        context.fillRect(x, y, Game.rectangleSize, Game.rectangleSize)
                    }
                    x += Game.rectangleSize
                })
                y += Game.rectangleSize
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
            Game.activeShape.y += Game.rectangleSize
            if (Game.collisionDetected() || Game.hitBottom()) {
                if (Game.activeShape.y < Game.getShapeHeight(Game.activeShape)) {
                    clearInterval(Game.interval)
                    Game.interval = null
                }
                Game.activeShape.y -= Game.rectangleSize
                Game.fixedShapes.push(Game.activeShape)
                Game.activeShape = null
            }
        }
    },

    moveShapesSideways: (direction) => {
        let difference = 0
        switch (direction) {
        case 'left':
            difference -= Game.rectangleSize
            break
        case 'right':
            difference += Game.rectangleSize
            break
        }
        Game.activeShape.x += difference
        if (Game.collisionDetected()) {
            Game.activeShape.x -= difference
        }
    },

    rotateShapes: () => {
        let originalRectangles = Game.activeShape.rectangles
        originalRectangles.reverse()

        let rotatedRowsCount = originalRectangles[0].length
        let rotatedColumnsCount = originalRectangles.length

        let rotatedRectangles = []
        for (let i = 0; i < rotatedRowsCount; i++) {
            let rotatedRow = []
            for (let j = 0; j < rotatedColumnsCount; j++) {
                rotatedRow.push(Game.activeShape.rectangles[j][i])
            }
            rotatedRectangles.push(rotatedRow);
        }
        console.log('Active shape rotated')
        Game.activeShape.rectangles = rotatedRectangles
    },

    hitBottom: () => {
        if (Game.activeShape.y + Game.getShapeHeight(Game.activeShape) >= Game.bottom + Game.rectangleSize) {
            console.log('Active shape hit bottom')
            return true
        }
        return false
    },

    collisionDetected: () => {
        let colliding = false
        let activeX = Game.activeShape.x
        let activeY = Game.activeShape.y
        Game.activeShape.rectangles.forEach((activeRow) => {
            activeRow.forEach((activeCellValue) => {
                if (activeCellValue === 1) {
                    Game.fixedShapes.forEach((fixedShape) => {
                        let fixedX = fixedShape.x
                        let fixedY = fixedShape.y
                        fixedShape.rectangles.forEach((fixedRow) => {
                            fixedRow.some((fixedCellValue) => {
                                if (fixedCellValue === 1) {
                                    if (fixedX === activeX && fixedY === activeY) {
                                        console.log('Active shape collision detected')
                                        colliding = true
                                    }
                                }
                                fixedX += Game.rectangleSize
                            })
                            fixedY += Game.rectangleSize
                            fixedX = fixedShape.x
                        })
                    })

                }
                activeX += Game.rectangleSize
            })
            activeY += Game.rectangleSize
            activeX = Game.activeShape.x
        })
        return colliding
    },

    getShapeHeight: (shape) => {
        let height = 0
        shape.rectangles.forEach((row) => {
            if (row.indexOf(1) !== -1) {
                height += Game.rectangleSize
            }
        })
        return height
    },

    getRandomShape: () => {
        let keys = Object.keys(Game.shapesDefinition);
        return Object.create(Game.shapesDefinition[keys[keys.length * Math.random() << 0]]);
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
