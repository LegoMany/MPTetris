import { AbstractShape } from './shapes/AbstractShape'
import { Coordinate } from './shapes/Coordinate'
import { IHasLifecycle } from '../engine/behavior/HasLifecycle'
import { InputManager } from '../engine/InputManager'
import { ShapeList } from './shapes/ShapeList'

export class Field implements IHasLifecycle {
  static readonly CELL_SIZE: number = 20

  public width: number
  public height: number

  protected ctx: CanvasRenderingContext2D

  protected lastDrawnFrame = 0
  protected speed: number = 31 * 16

  protected lastKeyFrame = 0
  protected keySpeed: number = 16 * 3

  protected _fixedShapes: AbstractShape[] = []
  protected _activeShape: AbstractShape = null

  protected shapeList: ShapeList = new ShapeList()

  constructor(canvasSelector: string) {
    const element: HTMLCanvasElement = document.querySelector(canvasSelector)
    this.ctx = element.getContext('2d')

    this.height = element.height
    this.width = element.width

    this.spawnShape()
  }

  public update(frameTime: DOMHighResTimeStamp) {
    if (this._activeShape === null) {
      this.spawnShape()
    }

    if (frameTime > this.lastKeyFrame + this.keySpeed) {
      this.handleKeys()
      this.lastKeyFrame = frameTime
    }

    if (frameTime > this.lastDrawnFrame + this.speed) {
      this.moveActiveShapesDown()
      this.lastDrawnFrame = frameTime
    }

    this.draw()
  }

  protected draw() {
    const shapes = [...this.fixedShapes]

    this.clear()

    if (this._activeShape !== null) {
      shapes.push(this._activeShape)
    }

    this.ctx.fillStyle = '#000'

    shapes.forEach(shape => {
      shape.cells.forEach(cell => {
        this.ctx.fillRect(cell.position.x, cell.position.y, Field.CELL_SIZE, Field.CELL_SIZE)
      })
    })
  }

  public spawnShape() {
    // HACK: apparently TypeScript doesn't like returning constructors and directly calling them. "as any" fixes it (???)
    const shape = new (this.shapeList.getShape() as any)(new Coordinate(this.width / 2 - Field.CELL_SIZE / 2, 0), this)
    shape.initializeCells()

    this._activeShape = shape
  }

  public moveActiveShapesDown() {
    if (this._activeShape instanceof AbstractShape) {
      this._activeShape.moveVertically()
    }
  }

  public fixShape(shape: AbstractShape): void {
    this._fixedShapes.push(shape)
    this.removeFullRows(shape)
  }

  protected removeFullRows(shape: AbstractShape) {
    let cellsPerY = []
    this._fixedShapes.forEach((shape) => {
      shape.cells.forEach((cell) => {
        if (cellsPerY[cell.position.y] === undefined) {
          cellsPerY[cell.position.y] = 0
        }
        cellsPerY[cell.position.y] += 1
      })
    })

    let maxCellsPerRow = this.width / Field.CELL_SIZE
    let fullRows = []
    cellsPerY.forEach((cellsCount, y) => {
      if (cellsCount >= maxCellsPerRow) {
        fullRows.push(y)
      }
    })

    if (fullRows.length > 0) {
      this._fixedShapes.forEach(shape => {
        shape.cells.forEach((cell, index) => {
          if (fullRows.includes(cell.position.y)) {
            delete shape.cells[index]
          }
        })
      })
    }
  }

  protected handleKeys(): void {
    const inputManager = InputManager.instance
    if (this._activeShape instanceof AbstractShape) {
      if (inputManager.keyIsPressed('ArrowLeft')) {
        this._activeShape.moveHorizontally('left')
      }

      if (inputManager.keyIsPressed('ArrowRight')) {
        this._activeShape.moveHorizontally('right')
      }

      if (inputManager.keyIsPressed('ArrowDown')) {
        this._activeShape.moveVertically()
      }

      if (inputManager.keyIsPressed('a')) {
        this._activeShape.rotate(AbstractShape.ROTATION_COUNTER_CLOCKWISE)
        inputManager.dissalowKey('a')
      }

      if (inputManager.keyIsPressed('d')) {
        this._activeShape.rotate(AbstractShape.ROTATION_CLOCKWISE)
        inputManager.dissalowKey('d')
      }
    }
  }

  protected clear() {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }

  public set activeShape(shape: AbstractShape | null) {
    this._activeShape = shape
  }

  public get fixedShapes(): AbstractShape[] {
    return this._fixedShapes
  }
}
