// react/src/shared/traverseAllChildren.js
// react使用这个工具来遍历某个节点的所有child
// 对每一个child做特定的操作(callback)

const SEPARATOR = '.'
const SUBSEPARATOR = ':'

function getComponentKey(componnet, index) {
  // 如果组件定义了key，这里会生成一个唯一id
  // 否则使用index
  return index.toString(36)
}

function traverseAllChildrenImpl(
  children,
  nameSoFar,
  callback,
  traverseContext,
) {
  if (typeof children === 'string' || !Array.isArray(children)) {
    callback(
      traverseContext,
      children,
      nameSoFar + SEPARATOR + getComponentKey(children, 0),
    )
    return 1
  }

  let subTreeCount = 0
  const nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR

  children.forEach((child, i) => {
    const nextName = nextNamePrefix + getComponentKey(child, i)
    subTreeCount += traverseAllChildrenImpl(
      child,
      nextName,
      callback,
      traverseContext,
    )
  })

  return subTreeCount
}

function traverseAllChildren(children, callback, traverseContext) {
  return traverseAllChildrenImpl(children, '', callback, traverseContext)
}

export default traverseAllChildren
