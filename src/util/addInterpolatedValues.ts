import toPrecision from "./toPrecision";

// 定义 Value 类型
interface Value {
  type: string;
  start?: number;
  end?: number;
  unit?: string;
  value?: string;
  values?: Value[];
}

// 定义 Interpolator 类型
interface Interpolator {
  number: (start: number, end: number) => number[];
  hex: (start: string, end: string) => string[];
  fixed: (value: string) => string[];
}

export const assignValues = (obj: Value, values: Value[]): Value =>
  Object.assign(obj, { values });

export const addInterpolatedValue = (
  interpolator: Interpolator,
  parts: Value[],
  precision: number
): Value[] =>
  parts.map((part) => {
    switch (part.type) {
      case "Function":
        return assignValues(
          part,
          addInterpolatedValue(interpolator, part.values || [], precision)
        );
      case "Dimension":
        return assignValues(
          part,
          interpolator.number(part.start || 0, part.end || 0).map((v) => {
            const rounded = toPrecision(v, precision, part.unit);
            return rounded === "0" ? "0" : `${rounded}${part.unit}`;
          })
        );
      case "Number":
        return assignValues(
          part,
          interpolator
            .number(part.start || 0, part.end || 0)
            .map((v) => toPrecision(v, precision))
        );
      case "HexColor":
        return assignValues(
          part,
          interpolator.hex(part.start || "", part.end || "")
        );
      case "Fixed":
        return assignValues(part, interpolator.fixed(part.value || ""));
      default:
        throw new Error(`unknown value type: ${part.type}`);
    }
  });

const addInterpolatedValues = (
  interpolator: Interpolator,
  values: Record<string, Value[]>,
  precision: number
): Record<string, Value[]> => {
  for (let key of Object.keys(values)) {
    values[key] = addInterpolatedValue(interpolator, values[key], precision);
  }

  return values;
};

export default addInterpolatedValues;
