import { AbstractShape } from 'shapes/AbstractShape';
import { Coordinate } from 'shapes/Coordinate';

export class Field {
  static readonly cellSize: number = 20

  public width: number
  public height: number

  protected ctx: CanvasRenderingContext2D

  protected fixedShapes: AbstractShape[] = []
  protected activeShape: AbstractShape = null

  constructor(canvasSelector: string) {
    let element = (document.querySelector(canvasSelector) as HTMLCanvasElement);
    this.ctx = element.getContext('2d')

    this.height = element.height
    this.width = element.width
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

  public addShape(shape: AbstractShape) {
    let x = shape.spawnPosition.x
    let y = shape.spawnPosition.y

    shape.cells.forEach((row) => {
      row.forEach((cell) => {
        cell.position = new Coordinate((cell.column * Field.cellSize) + x, (cell.row * Field.cellSize) + y)
      })
    })

    this.activeShape = shape
  }

  protected clear() {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }
}
