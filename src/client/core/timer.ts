export class Timer {
  private previousTime: number;

  private currentTime: number;

  private delta: number;

  private elapsed: number;

  private timescale: number;

  private useFixedDelta: boolean;

  private fixedDelta: number;

  private usePageVisibilityAPI: boolean;

  private pageVisibilityHandler!: () => void;

  constructor() {
    this.previousTime = 0;
    this.currentTime = 0;

    this.delta = 0;
    this.elapsed = 0;

    this.timescale = 1;

    this.useFixedDelta = false;
    this.fixedDelta = 16.67; // ms, corresponds to approx. 60 FPS

    // use Page Visibility API to avoid large time delta values

    this.usePageVisibilityAPI = (typeof document !== 'undefined' && document.hidden !== undefined);

    if (this.usePageVisibilityAPI === true) {
      this.pageVisibilityHandler = this.handleVisibilityChange.bind(this);

      document.addEventListener('visibilitychange', this.pageVisibilityHandler, false);
    }
  }

  disableFixedDelta() {
    this.useFixedDelta = false;

    return this;
  }

  dispose() {
    if (this.usePageVisibilityAPI === true) {
      document.removeEventListener('visibilitychange', this.pageVisibilityHandler);
    }

    return this;
  }

  enableFixedDelta() {
    this.useFixedDelta = true;

    return this;
  }

  getDelta() {
    return this.delta / 1000;
  }

  getElapsed() {
    return this.elapsed / 1000;
  }

  getFixedDelta() {
    return this.fixedDelta / 1000;
  }

  getTimescale() {
    return this.timescale;
  }

  reset() {
    this.currentTime = this.now();

    return this;
  }

  setFixedDelta(fixedDelta: number) {
    this.fixedDelta = fixedDelta * 1000;

    return this;
  }

  setTimescale(timescale: number) {
    this.timescale = timescale;

    return this;
  }

  update() {
    if (this.useFixedDelta === true) {
      this.delta = this.fixedDelta;
    } else {
      this.previousTime = this.currentTime;
      this.currentTime = this.now();

      this.delta = this.currentTime - this.previousTime;
    }

    this.delta *= this.timescale;

    this.elapsed += this.delta; // _elapsed is the accumulation of all previous deltas

    return this;
  }

  private now() {
    return (typeof performance === 'undefined' ? Date : performance).now();
  }

  private handleVisibilityChange() {
    if (document.hidden === false) this.reset();
  }
}
