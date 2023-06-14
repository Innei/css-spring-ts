export interface Value {
  type: string
  unit?: string
  start?: number
  end?: number
  values?: string[]
}

export interface Keyframe {
  [key: string]: { [key: string]: string }
}

export interface AnimationValues {
  [key: string]: {
    start: Value[]
    end: Value[]
  }
}

export interface Interpolator {
  fixed: (value: string) => string[]
  number: (start: number, end: number) => number[]
  hex: (start: string, end: string) => string[]
}

export interface Part {
  type: string
  values?: string[]
  unit?: string
  start?: number
  end?: number
  name?: string
}

export interface Obj {
  [key: string]: Part[]
}
