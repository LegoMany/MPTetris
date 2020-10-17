import { Coordinate } from './Coordinate'

export class Cell {
  position: Coordinate

  constructor(x: number, y: number) {
    this.position = new Coordinate(x, y)
  }
}
