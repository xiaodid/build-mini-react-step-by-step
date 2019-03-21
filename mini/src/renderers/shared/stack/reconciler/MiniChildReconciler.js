import instantiateMiniComponent from './instantiateMiniComponent'
import traverseAllChildren from '../../../../shared/utils/traverseAllChildren'
import shouldUpdateMiniComponent from '../../shared/shouldUpdateMiniComponent'
import Reconciler from './MiniReconciler'

function instantiateChild(childInstances, child, name) {
  const isUnique = childInstances[name] === undefined

  if (isUnique) {
    childInstances[name] = instantiateMiniComponent(child)
  }
}

function instantiateChildren(children) {
  const childInstances = {}

  traverseAllChildren(children, instantiateChild, childInstances)

  return childInstances
}

function updateChildren(
  prevChildren,
  nextChildren, // is a Object: {name: child_element}
  mountImages,
  removedChildren,
) {
  prevChildren = prevChildren || {}

  Object.keys(nextChildren).forEach((childKey) => {
    let prevChild = prevChildren[childKey]
    const prevElement = prevChild && prevChild._currentElement
    const nextElement = nextChildren[childKey]

    // update
    if (prevChild && shouldUpdateMiniComponent(prevElement, nextElement)) {
      Reconciler.receiveComponent(prevChild, nextElement)

      nextChildren[childKey] = prevChild
    } else {
      // re-mount

      // 删除原来的child
      if (prevChild) {
        removedChildren[childKey] = prevChild._domNode
        Reconciler.unmountComponent(prevChild)
      }

      const nextChild = instantiateMiniComponent(nextElement)
      nextChildren[childKey] = nextChild

      mountImages.push(Reconciler.mountComponent(nextChild))
    }

    Object.keys(prevChildren).forEach((ck) => {
      if (!nextChildren.hasOwnProperty(ck)) {
        prevChild = prevChildren[ck]
        removedChildren[ck] = prevChild._domNode
        Reconciler.unmountComponent(prevChild)
      }
    })
  })
}

function unmountChildren(renderedChildren) {
  if (!renderedChildren) {
    return
  }

  Object.keys(renderedChildren).forEach((childKey) => {
    Reconciler.unmountComponent(renderedChildren[childKey])
  })
}

export default {
  unmountChildren,
  updateChildren,
  instantiateChildren,
}
