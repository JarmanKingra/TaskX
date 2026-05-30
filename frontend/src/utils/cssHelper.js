export const cssHelper = (styles) => {
  return (...args) => {
    return args
      .flatMap((arg) => {
        if (typeof arg === "string") {
          return arg.split(" ");
        }

        if (typeof arg === "object" && arg !== null) {
          return Object.entries(arg)
            .filter(([, value]) => value)
            .map(([key]) => key);
        }

        return [];
      })
      .map((name) => styles[name])
      .filter(Boolean)
      .join(" ");
  };
};