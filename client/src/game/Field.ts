import { AbstractShape } from './shapes/AbstractShape'
import { Coordinate } from './shapes/Coordinate'
import { Shapes } from './shapes/Shapes'
import { IHasLifecycle } from '../engine/behavior/HasLifecycle'
import { InputManager } from '../engine/InputManager'

export class Field implements IHasLifecycle {
  static readonly cellSize: number = 20

  public width: number
  public height: number

  protected ctx: CanvasRenderingContext2D

  protected lastDrawnFrame = 0
  protected speed: number = 31 * 16

  protected lastKeyFrame = 0
  protected keySpeed: number = 16 * 3

  protected _fixedShapes: AbstractShape[] = []
  protected _activeShape: AbstractShape = null

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

  public draw() {
    this.clear()
    const shapes = [...this.fixedShapes]
    if (this._activeShape !== null) {
      shapes.push(this._activeShape)
    }
    this.ctx.fillStyle = '#000'
    shapes.forEach(shape => {
      shape.cells.forEach(cell => {
        this.ctx.fillRect(cell.position.x, cell.position.y, Field.cellSize, Field.cellSize)
      })
    })
  }

  public spawnShape() {
    const randomNumber = Math.floor(Math.random() * Math.floor(6))
    const shape = new Shapes[randomNumber](new Coordinate(this.width / 2 - Field.cellSize / 2, 0), this)
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
  }

  protected handleKeys(): void {
    const inputManager = InputManager.instance
    if (this._activeShape !== null) {
      if (inputManager.keyIsPressed('ArrowLeft')) {
        this._activeShape.moveHorizontally('left')
      }
      if (inputManager.keyIsPressed('ArrowRight')) {
        this._activeShape.moveHorizontally('right')
      }
      if (inputManager.keyIsPressed('ArrowDown')) {
        this._activeShape.moveVertically()
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
