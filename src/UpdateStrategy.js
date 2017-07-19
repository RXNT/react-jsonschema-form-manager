export class InstantUpdateStrategy {
  onChange = formData => {
    return this.manager.update(formData);
  };
  start = manager => (this.manager = manager);
  stop = () => (this.manager = undefined);
}

export class IntervalUpdateStrategy {
  constructor(period) {
    this.period = period;
    this.formData = {};
  }
  onChange = formData => {
    this.formData = formData;
    return Promise.resolve(this.formData);
  };
  start = manager => {
    this.interval = setInterval(
      () => manager.update(this.formData),
      this.period
    );
  };
  stop = () => {
    clearInterval(this.interval);
  };
}
