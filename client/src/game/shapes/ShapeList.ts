import { AbstractShape } from './AbstractShape'
import { IShape } from './definitions/IShape'
import { JShape } from './definitions/JShape'
import { LShape } from './definitions/LShape'
import { OShape } from './definitions/OShape'
import { SShape } from './definitions/SShape'
import { TShape } from './definitions/TShape'
import { ZShape } from './definitions/ZShape'

export class ShapeList {
  private availableShapes: AbstractShape[] = [IShape, JShape, LShape, OShape, SShape, TShape, ZShape]

  private shapeBag: AbstractShape[] = []

  public getShape(): AbstractShape {
    if (this.shapeBag.length === 0) {
      this.fillShapeBag()
    }

    return this.shapeBag.pop()
  }

  private fillShapeBag() {
    let randomIndex = 0
    let lastRandomIndex = 0
    let isReroll = false

    while (this.shapeBag.length < 8) {
      randomIndex = Math.ceil((Math.random() * 100) % this.availableShapes.length) - 1

      if (randomIndex === lastRandomIndex && !isReroll) {
        isReroll = !isReroll
        continue
      }

      this.shapeBag.push(this.availableShapes[randomIndex])
      lastRandomIndex = randomIndex
      isReroll = false
    }
  }
}
