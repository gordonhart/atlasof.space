export class FrameRateCounter {
  private readonly array: Array<number>;
  private readonly size = 60;

  private oldestIndex = 0;
  private newestIndex = 0;

  constructor() {
    this.array = new Array(this.size).fill(performance.now());
  }

  update() {
    this.newestIndex = (this.newestIndex + 1) % this.size;
    this.array[this.newestIndex] = performance.now();
    if (this.newestIndex === this.oldestIndex) {
      this.oldestIndex = (this.oldestIndex + 1) % this.size;
    }
  }

  fps() {
    const elapsed = this.array[this.newestIndex] - this.array[this.oldestIndex];
    const frames = this.newestIndex > this.oldestIndex ? this.newestIndex - this.oldestIndex : this.size - 1;
    return (frames / elapsed) * 1e3;
  }
}
