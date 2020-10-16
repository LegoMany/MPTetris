import { Coordinate } from 'shapes/Coordinate';
import { Cell } from 'shapes/Cell';
import { Field } from 'engine/Field'

export abstract class AbstractShape {
  public id = 0
  public color = '#000'
  public spawnPosition: Coordinate

  protected field: Field

  abstract cells: Cell[][]

  constructor(spawnPosition: Coordinate, field: Field) {
    this.spawnPosition = spawnPosition
    this.field = field
  }

  public moveVertically(shape: AbstractShape, direction: string = 'down') {
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
      this.field.fixShape(shape)
      this.field.activeShape = null
    }
  }

  public moveHorizontally(shape: AbstractShape, direction: string) {
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
  }

  protected keepInsideField(shape: AbstractShape): void {
    shape.cells.forEach((row) => {
      row.forEach((cell) => {
        if (cell.position.x === this.field.width) {
          shape.moveHorizontally(shape, 'left')
        }
        if (cell.position.x < 0) {
          shape.moveHorizontally(shape, 'right')
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
    return lowestPoint === this.field.height
  }

  protected collidingWithFixedShape(shape: AbstractShape): boolean {
    let collision = false
    shape.cells.forEach((activeRow) => {
      activeRow.forEach((activeCell) => {
        this.field.fixedShapes.forEach((fixedShape) => {
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
}
