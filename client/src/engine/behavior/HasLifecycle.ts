export interface IHasLifecycle {
  awake?(): void
  update?(frameTime?: DOMHighResTimeStamp): void
}

export abstract class HasLifecycle {
  protected lastFrameTime = 0
  protected deltaTime = 0

  constructor() {
    this.awake()
    requestAnimationFrame(this._update.bind(this))
  }

  awake(): void {}

  abstract update(frameTime: DOMHighResTimeStamp): void

  _update(frameTime: DOMHighResTimeStamp) {
    if (this.lastFrameTime > 0) {
      this.deltaTime = frameTime - this.lastFrameTime
    }
    this.update(frameTime)
    this.lastFrameTime = frameTime
    requestAnimationFrame(this._update.bind(this))
  }
}
