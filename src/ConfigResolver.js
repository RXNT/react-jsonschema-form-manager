export class ConfigResolver {
  resolve = () => Promise.reject("Can't resolve schema");
}

export class StaticConfigResolver {
  constructor(configs, delay = 0) {
    this.configs = configs;
    this.delay = delay;
  }
  resolve = () => {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.configs), this.delay);
    });
  };
}
