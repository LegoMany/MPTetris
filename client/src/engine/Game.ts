import { HasLifecycle, IHasLifecycle } from 'engine/behavior/HasLifecycle'
import { Field } from 'engine/Field'

export class Game extends HasLifecycle implements IHasLifecycle {
  protected lastDrawnFrame: number = 0
  protected speed: number = 500
  protected field: Field

  constructor() {
    super()
  }

  awake() {
    this.field = new Field('#canvas')
    this.field.spawnShape()
  }

  update(frameTime: DOMHighResTimeStamp) {
    if (frameTime > this.lastDrawnFrame + this.speed) {
      console.log('tick')
      this.field.moveActiveShapesDown()
      this.field.draw()
      this.lastDrawnFrame = frameTime
    }
  }
}
