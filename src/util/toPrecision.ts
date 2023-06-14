const toPrecision = (num: number, precision: number, unit?: string): string =>
  Number(num.toFixed(unit === "px" ? 0 : precision)).toString();

export default toPrecision;
