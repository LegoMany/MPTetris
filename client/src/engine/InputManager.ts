export class InputManager {
  protected pressedKeys: string[] = []

  public keyIsPressed(key: string): boolean {
    return this.pressedKeys.includes(key)
  }

  /** Singleton stuff */
  private static _instance: InputManager

  private constructor() {
    window.addEventListener('keydown', e => {
      if (!this.pressedKeys.includes(e.key)) {
        this.pressedKeys.push(e.key)
      }
    })

    window.addEventListener('keyup', e => {
      this.pressedKeys.splice(this.pressedKeys.indexOf(e.key), 1)
    })
  }

  public static get instance(): InputManager {
    if (this._instance === undefined) {
      this._instance = new InputManager()
    }

    return this._instance
  }
}
