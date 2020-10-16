import { Coordinate } from 'shapes/Coordinate';
import { Field } from 'engine/Field'
import { Cell } from 'shapes/Cell'

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
    this.definition.forEach((cellDefinition) => {
      let newCell = new Cell(
        this.spawnPosition.x + cellDefinition[1] * Field.cellSize,
        this.spawnPosition.y + cellDefinition[0] * Field.cellSize,
      )
      this._cells.push(newCell)
    })
  }

  protected getGridSize(): number {
    let maxSize = 0

    this.definition.forEach((cellDefinition) => {
      if (cellDefinition[0] > maxSize) {
        maxSize = cellDefinition[0]
      }
      if (cellDefinition[1] > maxSize) {
        maxSize = cellDefinition[1]
      }
    })
    return maxSize
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

    shape._cells.forEach((cell) => {
      cell.position.y += difference
    })

    if (this.hasHitBottom(shape) || this.collidingWithFixedShape(shape) === true) {
      shape._cells.forEach((cell) => {
        cell.position.y -= Field.cellSize
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
    shape._cells.forEach((cell) => {
      cell.position.x += difference
    })

    if (this.collidingWithFixedShape(shape) === true) {
      shape._cells.forEach((cell) => {
        cell.position.x -= difference
      })
    }

    this.keepInsideField(shape)
  }

  protected keepInsideField(shape: AbstractShape): void {
    shape._cells.forEach((cell) => {
      if (cell.position.x === this.field.width) {
        shape.moveHorizontally(shape, 'left')
      }
      if (cell.position.x < 0) {
        shape.moveHorizontally(shape, 'right')
      }
    })
  }

  protected hasHitBottom(shape: AbstractShape): boolean {
    let lowestPoint = 0
    shape._cells.forEach((cell) => {
      lowestPoint = cell.position.y
    })
    return lowestPoint === this.field.height
  }

  protected collidingWithFixedShape(shape: AbstractShape): boolean {
    let collision = false
    shape._cells.forEach((activeCell) => {
      this.field.fixedShapes.forEach((fixedShape) => {
        fixedShape._cells.forEach((fixedCell) => {
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
