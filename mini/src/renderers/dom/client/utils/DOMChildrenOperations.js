import invariant from 'tiny-invariant'
import DOM from './Dom'

function processUpdates(parentNode, updates) {
  updates.forEach((update) => {
    switch (update.type) {
      case 1:
        // insert
        DOM.insertChildAfter(parentNode, update.content, update.afterNode)
        break
      case 2:
        // move
        DOM.insertChildAfter(
          parentNode,
          parentNode.childNodes[update.fromIndex],
          update.afterNode,
        )
        break
      case 3:
        // remove
        DOM.removeChild(parentNode, update.fromNode)
        break
      default:
        invariant(false)
    }
  })
}

export default {
  processUpdates,
}
