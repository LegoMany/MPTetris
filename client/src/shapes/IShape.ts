import { AbstractShape } from 'shapes/AbstractShape'
import { Cell } from 'shapes/Cell'

export class IShape extends AbstractShape {
  cells = [
    [new Cell(1, 1)],
    [new Cell(2, 1)],
    [new Cell(3, 1)],
    [new Cell(4, 1)],
  ]
}
