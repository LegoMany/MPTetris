import { Coordinate } from 'shapes/Coordinate';

export class Cell {
  position: Coordinate
  row = 0
  column = 0

  constructor(row, column) {
    this.row = row
    this.column = column
  }
}
