import { AbstractShape } from "shapes/AbstractShape"
import { Cell } from "shapes/Cell"

export class ZShape extends AbstractShape {
  cells = [
    [new Cell(1, 1), new Cell(1, 2)],
    [new Cell(2, 2), new Cell(2, 3)],
  ]
}
