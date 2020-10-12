import { AbstractShape } from "shapes/AbstractShape"
import { Cell } from "shapes/Cell"

export class SquareShape extends AbstractShape {
  cells = [
    [new Cell(1, 1)],
    [new Cell(2, 2)],
  ]
}