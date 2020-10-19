import { SceneManager } from '../engine/SceneManager'
import { HasLifecycle, IHasLifecycle } from '../engine/behavior/HasLifecycle'
import { Field } from './scenes/Field'

export class Game extends HasLifecycle implements IHasLifecycle {
  protected field: Field

  constructor() {
    super()
  }

  awake() {
    SceneManager.instance.addScene('Field', new Field('#canvas'))
    SceneManager.instance.switchScene('Field')
  }

  update(frameTime: DOMHighResTimeStamp) {
    SceneManager.instance.currentScene.update(frameTime)
  }
}
