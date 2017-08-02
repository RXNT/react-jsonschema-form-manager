export const IgnoreUpdateStrategy = {
  subscribe: function() {},
  onChange: function() {},
  stop: function() {},
};

export class InstantUpdateStrategy {
  constructor() {}
  subscribe = updateCallback => {
    this.onUpdate = updateCallback;
  };
  onChange = formData => {
    if (this.onUpdate) {
      this.onUpdate(formData);
    }
  };
  stop = () => {};
}

export class IntervalUpdateStrategy {
  constructor(period) {
    this.period = period;
  }
  subscribe = onUpdate => {
    this.onUpdate = onUpdate;
  };
  onChange = formData => {
    this.formData = formData;
    if (this.interval === undefined && this.onUpdate) {
      this.interval = setInterval(
        () => this.onUpdate(this.formData),
        this.period
      );
    }
  };
  stop = () => {
    clearInterval(this.interval);
  };
}
