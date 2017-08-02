export const IgnoreUpdateStrategy = {
  onChange: function() {},
  stop: function() {},
};

export class InstantUpdateStrategy {
  constructor() {}
  onChange = (formData, handleUpdate) => {
    handleUpdate(formData);
  };
  stop = () => {};
}

export class IntervalUpdateStrategy {
  constructor(period) {
    this.period = period;
  }
  onChange = (formData, handleUpdate) => {
    this.formData = formData;
    if (this.interval === undefined) {
      this.interval = setInterval(
        () => handleUpdate(this.formData),
        this.period
      );
    }
  };
  stop = () => {
    clearInterval(this.interval);
  };
}
