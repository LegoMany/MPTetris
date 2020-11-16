export class InputManager {
  protected pressedKeys: string[] = []
  protected illegalKeys: string[] = []

  public keyIsPressed(key: string): boolean {
    return this.pressedKeys.includes(key)
  }

  /* Prevent key from being "pressed" until it's next keyup event */
  public dissalowKey(key: string): void {
    this.illegalKeys.push(key)
    this.pressedKeys.splice(this.pressedKeys.indexOf(key), 1)
  }

  public reset(): void {
    this.pressedKeys = []
    this.illegalKeys = []
  }

  /** Singleton stuff */
  private static _instance: InputManager

  private constructor() {
    window.addEventListener('keydown', e => {
      if (!this.pressedKeys.includes(e.key) && !this.illegalKeys.includes(e.key)) {
        this.pressedKeys.push(e.key)
      }
    })

    window.addEventListener('keyup', e => {
      if (this.pressedKeys.includes(e.key)) {
        this.pressedKeys.splice(this.pressedKeys.indexOf(e.key), 1)
      }
      if (this.illegalKeys.includes(e.key)) {
        this.illegalKeys.splice(this.pressedKeys.indexOf(e.key), 1)
      }
    })
  }

  public static get instance(): InputManager {
    if (this._instance === undefined) {
      this._instance = new InputManager()
    }

    return this._instance
  }
}
