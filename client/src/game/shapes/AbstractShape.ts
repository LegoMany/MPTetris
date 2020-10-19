import { Coordinate } from './Coordinate'
import { Field } from '../scenes/Field'
import { Cell } from './Cell'

export abstract class AbstractShape {
  static readonly ROTATION_CLOCKWISE = 1
  static readonly ROTATION_COUNTER_CLOCKWISE = 2

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

  public initializeCells(position: Coordinate = null): void {
    if (position === null) {
      position = this.spawnPosition
    }

    this.definition.forEach((row, rowIndex) => {
      row.forEach((cellValue, cellIndex) => {
        if (cellValue === 1) {
          const newCell = new Cell(
            position.x + cellIndex * Field.CELL_SIZE,
            position.y + rowIndex * Field.CELL_SIZE
          )

          this._cells.push(newCell)
        }
      })
    })
  }

  public rotate(direction: number = AbstractShape.ROTATION_CLOCKWISE): void {
    let gridPosition = this.getGridPosition()
    let originalCells = this.definition.slice()
    originalCells.reverse()

    let rotatedRowsCount = originalCells[0].length
    let rotatedColumnsCount = originalCells.length

    let rotatedCells = []
    for (let i = 0; i < rotatedRowsCount; i++) {
      let rotatedRow = []
      for (let j = 0; j < rotatedColumnsCount; j++) {
        rotatedRow.push(originalCells[j][i])
      }
      if (direction === AbstractShape.ROTATION_COUNTER_CLOCKWISE) {
        rotatedRow.reverse()
      }
      rotatedCells.push(rotatedRow);
    }
    if (direction === AbstractShape.ROTATION_COUNTER_CLOCKWISE) {
      rotatedCells.reverse()
    }

    this.definition = rotatedCells
    this._cells = []
    this.initializeCells(gridPosition)
    this.keepInsideField()
    if (this.hasHitBottom() || this.collidingWithFixedShape() === true) {
      this._cells.forEach(cell => {
        cell.position.y -= Field.CELL_SIZE
      })

      this.field.fixShape(this)
      this.field.activeShape = null
    }
  }

  protected getGridPosition(): Coordinate {
    let lowestX = this.cells[0].position.x
    let lowestY = this.cells[0].position.y

    let offsetX: number
    let offsetY: number = 0

    for (let rowIndex = 0; rowIndex < this.definition.length; rowIndex++) {
      if (this.definition[rowIndex].includes(1) === false) {
        offsetY += Field.CELL_SIZE
      } else {
        break
      }
    }

    let firstRowEmptyColumns = this.definition[0].indexOf(1)
    let emptyColumns = firstRowEmptyColumns === -1 ? this.definition.length : firstRowEmptyColumns
    for (let rowIndex = 0; rowIndex < this.definition.length; rowIndex++) {
      let rowEmptyColumns = this.definition[rowIndex].indexOf(1)
      if (rowEmptyColumns !== -1 && rowEmptyColumns < emptyColumns) {
        emptyColumns = rowEmptyColumns
      }
      if (rowEmptyColumns === 0) {
        break
      }
    }
    offsetX = emptyColumns * Field.CELL_SIZE

    this.cells.forEach(cell => {
      if (cell.position.x < lowestX) {
        lowestX = cell.position.x
      }
      if (cell.position.y < lowestY) {
        lowestY = cell.position.y
      }
    })

    return new Coordinate(lowestX - offsetX, lowestY - offsetY)
  }

  public moveVertically(direction = 'down') {
    let difference = 0

    switch (direction) {
      case 'up':
        difference -= Field.CELL_SIZE
        break
      case 'down':
        difference += Field.CELL_SIZE
        break
    }

    this._cells.forEach(cell => {
      cell.position.y += difference
    })

    if (this.hasHitBottom() || this.collidingWithFixedShape() === true) {
      this._cells.forEach(cell => {
        cell.position.y -= Field.CELL_SIZE
      })

      this.field.fixShape(this)
      this.field.activeShape = null
    }
  }

  public moveHorizontally(direction: string) {
    let difference = 0

    switch (direction) {
      case 'left':
        difference -= Field.CELL_SIZE
        break
      case 'right':
        difference += Field.CELL_SIZE
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
