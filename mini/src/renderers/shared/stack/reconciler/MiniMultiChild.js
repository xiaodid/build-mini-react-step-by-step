import Reconciler from './MiniReconciler'
import ChildReconciler from './MiniChildReconciler'
// import traverseAllChildren from '../../../../shared/utils/traverseAllChildren'
import flattenChildren from '../../../../shared/utils/flattenChildren'
import ReactComponentEnvironment from '../../../dom/client/utils/DOMChildrenOperations'

const UPDATE_TYPES = {
  INSERT: 1,
  MOVE: 2,
  REMOVE: 3,
}

const OPERATIONS = {
  insert(component, node, afterNode) {
    return {
      type: UPDATE_TYPES.INSERT,
      content: node,
      toIndex: component._mountIndex,
      afterNode,
    }
  },

  move(component, afterNode, toIndex) {
    return {
      type: UPDATE_TYPES.MOVE,
      fromIndex: component._mountIndex,
      toIndex,
      afterNode,
    }
  },

  remove(component, node) {
    return {
      type: UPDATE_TYPES.REMOVE,
      fromIndex: component._mountIndex,
      fromNode: node,
    }
  },
}

function processQueue(inst, updates) {
  ReactComponentEnvironment.processUpdates(inst, updates)
}

class MultiChild {
  mountChildren(children) {
    const renderedChildren = ChildReconciler.instantiateChildren(children)

    this._renderedChildren = renderedChildren

    const mountImages = Object.keys(renderedChildren).map((childKey, i) => {
      const child = renderedChildren[childKey]

      child._mountIndex = i

      return Reconciler.mountComponent(child)
    })

    return mountImages
  }

  unmountChildren() {
    ChildReconciler.unmountChildren(this._renderedChildren)
  }

  // nextChildren: Element
  updateChildren(nextChildren) {
    const prevRenderedChildren = this._renderedChildren

    const mountImages = []
    const removedNodes = {}

    const nextRenderedChildren = flattenChildren(nextChildren)

    ChildReconciler.updateChildren(
      prevRenderedChildren,
      nextRenderedChildren,
      mountImages,
      removedNodes,
    )

    // 接下来的部分是react的精华
    const updates = []

    // lastIndex是最后一个访问prevRenderedChildren都元素都_mountIndex
    let lastIndex = 0
    let nextMountIndex = 0
    let lastPlacedNode = null

    Object.keys(nextRenderedChildren).forEach((childKey, nextIndex) => {
      const prevChild = prevRenderedChildren[childKey]
      const nextChild = nextRenderedChildren[childKey]

      // 如果前后是一样的
      if (prevChild === nextChild) {
        // 这里不处理往前移动的情况
        // 其他操作会保证最终结果的正确性
        if (prevChild._mountIndex < lastIndex) {
          updates.push(OPERATIONS.move(prevChild, lastPlacedNode, nextIndex))
        }

        lastIndex = Math.max(prevChild._mountIndex, lastIndex)
        // react源码就是这么写的，我觉得写nextChild更容易理解
        // nextChild._mountIndex = nextIndex
        prevChild._mountIndex = nextIndex
      } else {
        if (prevChild) {
          // 在_mountIndex被unmount前更新lastIndex
          lastIndex = Math.max(prevChild._mountIndex, lastIndex)
          // 下面的removedNodes循环会真正删除该节点
        }

        nextChild._mountIndex = nextIndex
        updates.push(
          OPERATIONS.insert(
            nextChild,
            mountImages[nextMountIndex],
            lastPlacedNode,
          ),
        )
        nextMountIndex++
      }

      lastPlacedNode = nextChild._domNode
    })

    // 删除
    Object.keys(removedNodes).forEach((childKey) => {
      updates.push(
        OPERATIONS.remove(
          prevRenderedChildren[childKey],
          removedNodes[childKey],
        ),
      )
    })

    processQueue(this._domNode, updates)

    this._renderedChildren = nextRenderedChildren
  }
}

export default MultiChild
