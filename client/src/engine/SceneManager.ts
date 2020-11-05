export abstract class Scene {
  abstract load(): void

  abstract unload(): void

  abstract update(frameTime: DOMHighResTimeStamp): void

  protected abstract draw(): void
}

type SceneList = {
  [name: string]: Scene
}

export class SceneManager {
  private _scenes: SceneList = {}

  private _currentScene: Scene

  public addScene(sceneName: string, scene: Scene): void {
    this._scenes[sceneName] = scene
  }

  public removeScene(sceneName: string): void {
    delete this._scenes[sceneName]
  }

  public switchScene(sceneName: string): void {
    if (this._currentScene !== undefined) {
      this._currentScene.unload()
    }

    if (this._scenes[sceneName] !== undefined) {
      this._currentScene = this._scenes[sceneName]
      this._currentScene.load()
    }
  }

  public get currentScene(): Scene {
    return this._currentScene
  }

  private static _instance: SceneManager

  private constructor() {}

  public static get instance(): SceneManager {
    if (this._instance === undefined) {
      this._instance = new SceneManager()
    }

    return this._instance
  }
}
