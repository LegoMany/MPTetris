import { Coordinate } from 'shapes/Coordinate';
import { Cell } from 'shapes/Cell';

export abstract class AbstractShape {
  id = 0
  color = '#000'
  spawnPosition: Coordinate

  abstract cells: Cell[][]

  constructor(spawnPosition: Coordinate) {
    this.spawnPosition = spawnPosition
  }
}
