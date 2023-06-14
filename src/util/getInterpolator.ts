import springer from 'springer'

export const toSixDigits = (hex: string): string =>
  hex.length === 3
    ? `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`
    : hex

export const interpolateColor = (
  a: string,
  b: string,
  amount: number,
): string => {
  a = toSixDigits(a)
  b = toSixDigits(b)

  const ah = parseInt(a.replace(/#/g, ''), 16)
  const ar = ah >> 16
  const ag = (ah >> 8) & 0xff
  const ab = ah & 0xff
  const bh = parseInt(b.replace(/#/g, ''), 16)
  const br = bh >> 16
  const bg = (bh >> 8) & 0xff
  const bb = bh & 0xff
  const rr = ar + amount * (br - ar)
  const rg = ag + amount * (bg - ag)
  const rb = ab + amount * (bb - ab)

  return `#${(((1 << 24) + (rr << 16) + (rg << 8) + rb) | 0)
    .toString(16)
    .slice(1)}`
}

interface Interpolator {
  fixed: (value: string) => string[];
  number: (start: number, end: number) => number[];
  hex: (start: string, end: string) => string[];
}

const getInterpolator = (
  tension: number,
  wobble: number,
  steps: number,
): Interpolator => {
  const spring = springer(tension, wobble)

  return {
    fixed: (value: string) => Array(steps + 1).fill(value),
    number: (start: number, end: number) =>
      Array(steps + 1)
        .fill(0)
        .map((_, i) => start + (end - start) * spring(i / steps)),
    hex: (start: string, end: string) =>
      Array(steps + 1)
        .fill(0)
        .map((_, i) => interpolateColor(start, end, spring(i / steps))),
  }
}

export default getInterpolator
