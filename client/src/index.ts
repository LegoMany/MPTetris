class Game {
  private static _instance: Game;

  private constructor() {}

  public static get instance(): Game {
    if (!Game._instance) {
      Game._instance = new Game();
    }

    return Game._instance;
  }

  private set instance(instance: Game) {}

  start() {
    console.log('Hello World!');
  }
}

Game.instance.start();
