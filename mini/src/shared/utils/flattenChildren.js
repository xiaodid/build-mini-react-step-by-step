import traverseAllChildren from './traverseAllChildren'

function flattenChildren(children) {
  const flattenedChildren = {}

  traverseAllChildren(
    children,
    (context, child, name) => (context[name] = child),
    flattenedChildren,
  )

  return flattenedChildren
}

export default flattenChildren
