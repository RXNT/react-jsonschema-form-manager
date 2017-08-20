export function ignoreUpdateStrategy() {
  return {
    onChange: function() {},
    stop: function() {},
  };
}

export function instantUpdateStrategy(manager) {
  return {
    onChange: () => manager.updateIfChanged(),
    stop: function() {},
  };
}

export function intervalUpdateStrategy(period) {
  return manager => {
    let interval = setInterval(() => manager.updateIfChanged(), period);
    return {
      onChange: () => {},
      stop: () => clearInterval(interval),
    };
  };
}
