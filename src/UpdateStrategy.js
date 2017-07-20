export class InstantUpdateStrategy {
  onChange = (formData, manager) => {
    let update = manager.update(formData);
    return update;
  };
  stop = () => {};
}

export class IntervalUpdateStrategy {
  constructor(period) {
    this.period = period;
  }
  update = () => {
    if (this.manager && this.formData) {
      this.manager.update(this.formData);
    }
  };
  onChange = (formData, manager) => {
    if (this.interval === undefined) {
      this.interval = setInterval(this.update, this.period);
    }
    this.formData = formData;
    this.manager = manager;
    return Promise.resolve(this.formData);
  };
  stop = () => {
    clearInterval(this.interval);
  };
}
