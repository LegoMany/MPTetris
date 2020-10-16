import { HasLifecycle, IHasLifecycle } from 'engine/behavior/HasLifecycle'
import { Field } from 'engine/Field'

export class Game extends HasLifecycle implements IHasLifecycle {
  protected field: Field

  constructor() {
    super()
  }

  awake() {
    this.field = new Field('#canvas')
  }

  update(frameTime: DOMHighResTimeStamp) {
    this.field.update(frameTime);
    this.field.draw()
  }
}
