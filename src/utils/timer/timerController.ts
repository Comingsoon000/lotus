type TimerChangeListener = ({ min, sec, millisec }: { min?: number; sec?: number; millisec?: number }) => unknown
type TimerStopListener = () => unknown

class TimerController {
  private timer?: number

  private seconds?: number

  private milliseconds?: number

  private minutes?: number

  private changeListeners: TimerChangeListener[] = []

  private stopListeners: TimerStopListener[] = []

  private readonly delay = 50

  stop() {
    if (this.timer) {
      clearInterval(this.timer)
    }

    this.stopListeners.forEach(listener => {
      listener()
    })
  }

  start(milliseconds: number) {
    this.milliseconds = milliseconds

    this.timer = setInterval(() => {
      this.milliseconds = this.milliseconds ? this.milliseconds - this.delay : 0
      const allSeconds = Math.ceil(this.milliseconds / 1000)
      this.seconds = allSeconds % 60
      this.minutes = Math.floor(allSeconds / 60)

      this.changeListeners.forEach(listener => {
        listener({ min: this.minutes, sec: this.seconds, millisec: this.milliseconds })
      })

      if (this.milliseconds <= 0) {
        this.stop()
      }
    }, this.delay)
  }

  correct(milliseconds: number) {
    if (this.timer) {
      clearInterval(this.timer)
    }

    this.start(milliseconds)
  }

  correctOnDelta(delta: number) {
    if (this.timer) {
      clearInterval(this.timer)
    }

    if (this.milliseconds) {
      const newMilliseconds = this.milliseconds - delta
      if (newMilliseconds > 0) {
        this.start(newMilliseconds)
      } else {
        this.stop()
      }
    }
  }

  addChangeListener(cb: TimerChangeListener) {
    this.changeListeners.push(cb)
  }

  addStopListener(cb: TimerStopListener) {
    this.stopListeners.push(cb)
  }

  private removeChangeListener() {
    this.changeListeners = []
  }

  private removeStopListeners() {
    this.stopListeners = []
  }

  removeAllListeners() {
    this.removeChangeListener()
    this.removeStopListeners()
  }
}

export default new TimerController()
