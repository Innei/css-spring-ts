import { isEmpty } from './util/_'
import addInterpolatedValues from './util/addInterpolatedValues'
import buildKeyframeObject from './util/buildKeyframeObject'
import getAnimationValues from './util/getAnimationValues'
import getInterpolator from './util/getInterpolator'
import optimizeOutput from './util/optimizeOutput'
import parseDeclarations from './util/parseDeclarations'
import sanitizeValues from './util/sanitizeValues'
import toPrecision from './util/toPrecision'

interface Preset {
  tension: number
  wobble: number
}

interface DefaultOptions extends Preset {
  keyframePrecision: number
  precision: number
  steps: number
}

// spring presets. selected combinations of tension/wobble.
const presets: Record<string, Preset> = {
  noWobble: { tension: 0.6, wobble: 0 },
  gentle: { tension: 0.2, wobble: 0.6 },
  wobbly: { tension: 0.6, wobble: 0.7 },
  stiff: { tension: 0.5, wobble: 0.5 },
}

// default spring options.
// tension and wobble reflect the values of the `wobbly` preset,
const defaultOptions: DefaultOptions = {
  keyframePrecision: 2,
  precision: 2,
  steps: 100,
  tension: 0.6,
  wobble: 0.7,
}

interface Styles {
  [key: string]: string
}

interface Options extends Partial<DefaultOptions> {
  preset?: string
}

// css-spring
const spring = (
  startStyles: Styles,
  endStyles: Styles,
  options: Options = {},
) => {
  const { keyframePrecision, precision, steps, tension, wobble } = {
    ...defaultOptions,
    ...options,
    ...presets[options.preset || ''],
  }

  const declarations = sanitizeValues(
    getAnimationValues(
      parseDeclarations(startStyles),
      parseDeclarations(endStyles),
    ),
  )

  if (isEmpty(declarations)) {
    return
  }

  const interpolator = getInterpolator(tension, wobble, steps)

  const keyframePercentages = [...Array(steps + 1)].map(
    (_, i) => `${toPrecision((i * 100) / steps, keyframePrecision)}%`,
  )

  const declarationsWithInterpolatedValues = addInterpolatedValues(
    interpolator,
    declarations,
    precision,
  )

  return optimizeOutput(
    buildKeyframeObject(
      declarationsWithInterpolatedValues,
      keyframePercentages,
    ),
  )
}

export default spring
