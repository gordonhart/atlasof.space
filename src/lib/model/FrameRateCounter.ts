export class FrameRateCounter {
  private readonly times: Array<number> = [];
  private readonly maxAgeMillis = 1e3; // expire timestamps older than 1 second

  update() {
    const now = performance.now();
    this.times.push(now);
    while (this.times.length > 0 && this.times[0] <= now - this.maxAgeMillis) {
      this.times.shift();
    }
  }

  fps() {
    if (this.times.length < 2) return null; // insufficient data
    const elapsed = this.times[this.times.length - 1] - this.times[0];
    return Math.max(((this.times.length - 1) / elapsed) * 1e3, 1); // clamp to 1fps minimum
  }
}
