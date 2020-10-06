export abstract class AbstractShape {
  id = 0
  color = '#000'
  spawnPosition = {
    x: 0,
    y: 0,
  }

  setSpawnPosition(x, y) {
    this.spawnPosition.x = x
    this.spawnPosition.y = y
  }
}
