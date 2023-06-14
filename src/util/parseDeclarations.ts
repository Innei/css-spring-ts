import parse from 'css-tree/lib/parser' // function
import { walk } from 'css-tree/lib/walker'

// 由于 css-tree 库没有提供完整的类型定义，我们需要定义一些基本类型
interface CssNode {
  type: string;
}

const parseDeclarations = (styles: string): CssNode[] => {
  const result: CssNode[] = []
  const randomNumber = Math.floor(Math.random() * 1e5)

  walk(parse(`#random${randomNumber}{${styles}}`), function (node: CssNode) {
    if (node.type === 'Declaration') {
      result.push(node)
    }
  })

  return result
}

export default parseDeclarations
