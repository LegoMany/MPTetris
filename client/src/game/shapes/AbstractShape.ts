import { Coordinate } from './Coordinate'
import { Field } from '../Field'
import { Cell } from './Cell'

export abstract class AbstractShape {
  public id = 0
  public color = '#000'
  public spawnPosition: Coordinate

  protected field: Field
  protected _cells: Cell[] = []

  abstract definition: number[][]

  constructor(spawnPosition: Coordinate, field: Field) {
    this.spawnPosition = spawnPosition
    this.field = field
  }

  public initializeCells(): void {
    this.definition.forEach((row, rowIndex) => {
      row.forEach((cellValue, cellIndex) => {
        if (cellValue === 1) {
          const newCell = new Cell(
            this.spawnPosition.x + cellIndex * Field.cellSize,
            this.spawnPosition.y + rowIndex * Field.cellSize
          )

          this._cells.push(newCell)
        }
      })
    })
  }

  protected getGridSize(): number {
    let maxSize = 0

    this.definition.forEach(cellDefinition => {
      if (cellDefinition[0] > maxSize) {
        maxSize = cellDefinition[0]
      }
      if (cellDefinition[1] > maxSize) {
        maxSize = cellDefinition[1]
      }
    })

    return maxSize
  }

  public moveVertically(direction = 'down') {
    let difference = 0

    switch (direction) {
      case 'up':
        difference -= Field.cellSize
        break
      case 'down':
        difference += Field.cellSize
        break
    }

    this._cells.forEach(cell => {
      cell.position.y += difference
    })

    if (this.hasHitBottom() || this.collidingWithFixedShape() === true) {
      this._cells.forEach(cell => {
        cell.position.y -= Field.cellSize
      })

      this.field.fixShape(this)
      this.field.activeShape = null
    }
  }

  public moveHorizontally(direction: string) {
    let difference = 0

    switch (direction) {
      case 'left':
        difference -= Field.cellSize
        break
      case 'right':
        difference += Field.cellSize
        break
    }

    this._cells.forEach(cell => {
      cell.position.x += difference
    })

    if (this.collidingWithFixedShape() === true) {
      this._cells.forEach(cell => {
        cell.position.x -= difference
      })
    }

    this.keepInsideField()
  }

  protected keepInsideField(): void {
    this._cells.forEach(cell => {
      if (cell.position.x === this.field.width) {
        this.moveHorizontally('left')
      }

      if (cell.position.x < 0) {
        this.moveHorizontally('right')
      }
    })
  }

  protected hasHitBottom(): boolean {
    let lowestPoint = 0

    this._cells.forEach(cell => {
      lowestPoint = cell.position.y
    })

    return lowestPoint === this.field.height
  }

  protected collidingWithFixedShape(): boolean {
    let collision = false

    this._cells.forEach(activeCell => {
      this.field.fixedShapes.forEach(fixedShape => {
        fixedShape._cells.forEach(fixedCell => {
          if (activeCell.position.x === fixedCell.position.x && activeCell.position.y === fixedCell.position.y) {
            collision = true
          }
        })
      })
    })

    return collision
  }

  public get cells(): Cell[] {
    return this._cells
  }
}
