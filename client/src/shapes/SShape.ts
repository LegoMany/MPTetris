import {AbstractShape} from "shapes/AbstractShape"
import {Cell} from "shapes/Cell"

export class SShape extends AbstractShape {
  cells = [
    [new Cell(1, 2), new Cell(1, 3)],
    [new Cell(2, 1), new Cell(2, 2)],
  ]
}
