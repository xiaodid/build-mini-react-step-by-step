import invariant from 'tiny-invariant'
import Element from '../../../isomorphic/classic/element/MiniElement'
import instantiateComponent from '../../shared/stack/reconciler/instantiateMiniComponent'
import Reconciler from '../../shared/stack/reconciler/MiniReconciler'
import DOM from './utils/Dom'
import shouldUpdateMiniComponent from '../../shared/shared/shouldUpdateMiniComponent';

const ROOT_KEY = 'ROOT_ID'
const instancesByRootID = {}
let rootID = 1

function isRoot(node) {
  return !!node.dataset[ROOT_KEY]
}

function mount(element, node) {
  // 标记这个node为根节点
  node.dataset[ROOT_KEY] = ROOT_KEY

  const component = instantiateComponent(element)

  instancesByRootID[rootID] = component

  const renderedNode = Reconciler.mountComponent(component, node)

  DOM.empty(node)
  DOM.appendChild(node, renderedNode)

  rootID++
}

function update(element, node) {
  invariant(node && isRoot(node))

  const id = node.dataset[ROOT_KEY]
  const instance = instancesByRootID[id]

  if (shouldUpdateMiniComponent(instance, element)) {
    // TODO: do the update
  } else {
    unmountComponentAtNode(node)
    mount(element, node)
  }
}

function unmountComponentAtNode(node) {
  invariant(node && isRoot(node))

  const id = node.dataset[ROOT_KEY]

  const instance = instancesByRootID[id]

  Reconciler.unmountComponent(instance)

  delete instancesByRootID[id]

  DOM.empty(node)
  delete node.dataset[ROOT_KEY]
}

function render(element, node) {
  invariant(Element.isValidElement(element), 'MUST RENDER AN VALID ELEMENT')

  if (isRoot(node)) {
    update(element, node)
  } else {
    mount(element, node)
  }
}

export default {
  render,
  unmountComponentAtNode,
}
