import { findLast, intersectionBy, map, reduce } from 'lodash'
import type { Declaration } from 'css-tree'

interface PropertyValue {
  type: string
  name: string
  children: any // You may need to replace this with the actual type
}

export const getLastPropertyValue = (
  declarations: Declaration[],
  prop: string,
): PropertyValue[] =>
  findLast(declarations, (d) => d.property === prop).value.children.toArray()

interface AnimationValues {
  [key: string]: {
    start: PropertyValue[]
    end: PropertyValue[]
  }
}

const getAnimationValues = (
  startDec: Declaration[],
  endDec: Declaration[],
): AnimationValues =>
  reduce(
    intersectionBy(map(startDec, 'property'), map(endDec, 'property')),
    (accu: any, prop: string) =>
      Object.assign(accu, {
        [prop]: {
          start: getLastPropertyValue(startDec, prop),
          end: getLastPropertyValue(endDec, prop),
        },
      }),
    {},
  )

export default getAnimationValues
