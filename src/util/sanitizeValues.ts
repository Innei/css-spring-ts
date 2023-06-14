import { compact, map } from 'lodash'

// 定义 Value 类型
interface Value {
  type: string
  start?: number | string
  end?: number | string
  unit?: string
  value?: string
  name?: string
  values?: Value[]
  children?: { toArray: () => Value[] }
}

// 定义 Values 类型
interface Values {
  start: Value[]
  end: Value[]
}

export const getAnimatableValues = (
  startValues: Value[],
  endValues: Value[],
): (Value | null)[] =>
  compact(
    map(startValues, (start, i) => {
      const end = endValues[i]

      if (start.type !== end.type) {
        return
      }

      switch (start.type) {
        // ...
        case 'Function':
          const values = getAnimatableValues(
            start.children?.toArray() || [],
            end.children?.toArray() || [],
          )
          return values.length !== start.children?.toArray().length
            ? null
            : { type: start.type, name: start.name, values }
        default:
          console.error(`unknown type: ${start.type}`)
          return null
      }
    }),
  )

const sanitizeValues = (
  values: Record<string, Values>,
): Record<string, Value[]> => {
  const result: Record<string, Value[]> = {}

  Object.keys(values).forEach((prop) => {
    const { start: startValues, end: endValues } = values[prop]
    const animatable = getAnimatableValues(startValues, endValues)
    if (animatable.length === startValues.length) {
      result[prop] = animatable
    }
  })

  return result
}

export default sanitizeValues
