import { AbstractShape } from 'shapes/AbstractShape';
import { Coordinate } from 'shapes/Coordinate';
import { Shapes } from 'shapes/Shapes';
import { IHasLifecycle } from 'engine/behavior/HasLifecycle';

export class Field implements IHasLifecycle {
  static readonly cellSize: number = 20

  public width: number
  public height: number

  protected ctx: CanvasRenderingContext2D
  protected lastDrawnFrame: number = 0
  protected speed: number = 500

  protected fixedShapes: AbstractShape[] = []
  protected activeShape: AbstractShape = null

  constructor(canvasSelector: string) {
    let element: HTMLCanvasElement = document.querySelector(canvasSelector);
    this.ctx = element.getContext('2d')

    this.height = element.height
    this.width = element.width

    this.spawnShape()

    // TODO: pls change this
    window.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          if (this.activeShape !== null) {
            this.moveShapeHorizontally(this.activeShape, 'left')
          }
          break
        case 'ArrowRight':
          if (this.activeShape !== null) {
            this.moveShapeHorizontally(this.activeShape, 'right')
          }
          break
        case 'ArrowDown':
          if (this.activeShape !== null) {
            this.moveShapeVertically(this.activeShape)
            this.draw()
          }
          break
      }
    })
  }

  public update(frameTime: DOMHighResTimeStamp) {
    if (frameTime > this.lastDrawnFrame + this.speed) {
      this.moveActiveShapesDown()
      this.lastDrawnFrame = frameTime
    }
    this.draw()
  }

  public draw() {
    this.clear()
    let shapes = [...this.fixedShapes]
    if (this.activeShape !== null) {
      shapes.push(this.activeShape)
    }
    this.ctx.fillStyle = '#000'
    shapes.forEach((shape) => {
      shape.cells.forEach((row) => {
        row.forEach((cell) => {
          this.ctx.fillRect(cell.position.x, cell.position.y, Field.cellSize, Field.cellSize)
        })
      })
    })
  }

  public spawnShape() {
    let randomNumber = Math.floor(Math.random() * Math.floor(6))
    let shape = new Shapes[randomNumber](new Coordinate(this.width / 2 - Field.cellSize / 2, 0));

    let x = shape.spawnPosition.x
    let y = shape.spawnPosition.y

    shape.cells.forEach((row) => {
      row.forEach((cell) => {
        cell.position = new Coordinate((cell.column * Field.cellSize) + x, (cell.row * Field.cellSize) + y)
      })
    })

    this.activeShape = shape
  }

  public moveActiveShapesDown() {
    if (this.activeShape instanceof AbstractShape) {
      this.moveShapeVertically(this.activeShape)
    }
  }

  protected moveShapeVertically(shape: AbstractShape, direction: string = 'down') {
    let difference = 0
    switch (direction) {
      case 'up':
        difference -= Field.cellSize
        break
      case 'down':
        difference += Field.cellSize
        break
    }

    shape.cells.forEach((row) => {
      row.forEach((cell) => {
        cell.position.y += difference
      })
    })

    if (this.hasHitBottom(shape) || this.collidingWithFixedShape(shape) === true) {
      shape.cells.forEach((row) => {
        row.forEach((cell) => {
          cell.position.y -= Field.cellSize
        })
      })
      this.fixedShapes.push(shape)
      this.spawnShape()
    }
  }

  protected moveShapeHorizontally(shape: AbstractShape, direction: string) {
    let difference = 0
    switch (direction) {
      case 'left':
        difference -= Field.cellSize
        break
      case 'right':
        difference += Field.cellSize
        break
    }
    shape.cells.forEach((row) => {
      row.forEach((cell) => {
        cell.position.x += difference
      })
    })

    if (this.collidingWithFixedShape(shape) === true) {
      shape.cells.forEach((row) => {
        row.forEach((cell) => {
          cell.position.x -= difference
        })
      })
    }

    this.keepInsideField(shape)

    this.draw()
  }

  protected keepInsideField(shape: AbstractShape): void {
    shape.cells.forEach((row) => {
      row.forEach((cell) => {
        if (cell.position.x === this.width) {
          this.moveShapeHorizontally(shape, 'left')
        }
        if (cell.position.x < 0) {
          this.moveShapeHorizontally(shape, 'right')
        }
      })
    })
  }

  protected hasHitBottom(shape: AbstractShape): boolean {
    let lowestPoint = 0
    shape.cells.forEach((row) => {
      row.forEach((cell) => {
        lowestPoint = cell.position.y
      })
    })
    return lowestPoint === this.height
  }

  protected collidingWithFixedShape(shape: AbstractShape): boolean {
    let collision = false
    shape.cells.forEach((activeRow) => {
      activeRow.forEach((activeCell) => {
        this.fixedShapes.forEach((fixedShape) => {
          fixedShape.cells.forEach((fixedRow) => {
            fixedRow.forEach((fixedCell) => {
              if (activeCell.position.x === fixedCell.position.x && activeCell.position.y === fixedCell.position.y) {
                collision = true
              }
            })
          })
        })
      })
    })
    return collision
  }

  protected clear() {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }
}
