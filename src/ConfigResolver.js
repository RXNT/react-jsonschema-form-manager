export class ConfigResolver {
  resolve = () => Promise.reject("Can't resolve schema");
}

export class StaticConfigResolver {
  constructor(configs) {
    this.configs = configs;
  }
  resolve = () => Promise.resolve(this.configs);
}
