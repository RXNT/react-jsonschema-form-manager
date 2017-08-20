export function ignoreUpdateStrategy() {
  return {
    onChange: function() {},
    stop: function() {},
  };
}

export function instantUpdateStrategy(manager) {
  return {
    onChange: () => manager.update(),
    stop: function() {},
  };
}

export function intervalUpdateStrategy(period) {
  return manager => {
    let interval = setInterval(() => manager.update(), period);
    return {
      onChange: () => {},
      stop: () => clearInterval(interval),
    };
  };
}
