import { HasLifecycle, IHasLifecycle } from './behavior/HasLifecycle'

export class Game extends HasLifecycle implements IHasLifecycle {
  constructor() {
    super()
  }

  awake() {
    console.log('Game.awake()')
  }

  update(frameTime: DOMHighResTimeStamp) {
    console.log(`Game.update() / frameTime: ${frameTime} / deltaTime: ${this.deltaTime}`)
  }
}
