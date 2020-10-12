import { HasLifecycle, IHasLifecycle } from './behavior/HasLifecycle'
import { Field } from './Field'
import { TShape } from "shapes/TShape";
import { Coordinate } from 'shapes/Coordinate';

export class Game extends HasLifecycle implements IHasLifecycle {
  protected lastDrawnFrame: number = 0
  protected speed: number = 1000
  protected field: Field

  constructor() {
    super()
  }

  awake() {
    this.field = new Field('#canvas')
    this.field.addShape(new TShape(new Coordinate(this.field.width / 2, 0)))
  }

  update(frameTime: DOMHighResTimeStamp) {
    if (frameTime > this.lastDrawnFrame + this.speed) {
      this.field.draw()
      this.field.moveShapesDown()
      this.lastDrawnFrame = frameTime
    }
  }
}
