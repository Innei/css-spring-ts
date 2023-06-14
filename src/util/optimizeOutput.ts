import { isEmpty, omitBy } from 'lodash'

// 假设一个基本的 keyframes 类型，你可能需要根据你的实际代码对此进行修改
interface Keyframes {
  [percentage: string]: {
    [property: string]: string
  }
}

interface LastProp {
  [property: string]: {
    percentage: string
    value: string
  }
}

export const removeConsecutiveValues = (keyframes: Keyframes): Keyframes => {
  const last: LastProp = {}
  const beforeLast: LastProp = {}

  for (const percentage of Object.keys(keyframes)) {
    const keyframe = keyframes[percentage]
    for (const property of Object.keys(keyframe)) {
      const value = keyframe[property]
      if (
        last[property] &&
        beforeLast[property] &&
        last[property].value === value &&
        beforeLast[property].value === value
      ) {
        delete keyframes[last[property].percentage][property]
      }
      beforeLast[property] = last[property]
      last[property] = { percentage, value }
    }
  }

  return keyframes
}

const optimizeOutput = (keyframes: Keyframes): Keyframes => {
  return omitBy(removeConsecutiveValues(keyframes), isEmpty) as Keyframes
}

export default optimizeOutput
