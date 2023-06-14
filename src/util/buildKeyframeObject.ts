export const addOrApppend = (
  obj: { [key: string]: string },
  key: string,
  value: string,
): { [key: string]: string } =>
  Object.assign(obj, {
    [key]: `${obj[key] || ''}${value}`,
  })

export const getFunctionValue = (values: any[], step: number): string =>
  values.map((part) => (part.values ? part.values[step] : '')).join('')

interface Keyframe {
  [key: string]: { [key: string]: string };
}

const buildKeyframeObject = (
  obj: any,
  keyframePercentages: string[],
): Keyframe => {
  const result: Keyframe = {}
  for (let i = 0; i < keyframePercentages.length; i++) {
    const element = keyframePercentages[i]
    result[element] = {}

    for (const key of Object.keys(obj)) {
      result[element] = obj[key].reduce((accu: any, part: any) => {
        switch (part.type) {
          case 'Dimension':
          case 'Fixed':
          case 'HexColor':
          case 'Number':
            return addOrApppend(result[element], key, part.values[i])
          case 'Function':
            return addOrApppend(
              result[element],
              key,
              `${part.name}(${getFunctionValue(part.values, i)})`,
            )
        }
        return result[element]
      }, result[element])
    }
  }
  return result
}

export default buildKeyframeObject
