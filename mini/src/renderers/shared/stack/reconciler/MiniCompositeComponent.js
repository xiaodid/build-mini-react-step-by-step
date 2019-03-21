import invariant from 'tiny-invariant'
import Reconciler from './MiniReconciler'
import UpdateQueue from './MiniUpdateQueue'
import instantiateComponent from './instantiateMiniComponent'
import DOM from '../../../dom/client/utils/Dom'
import shouldUpdateMiniComponent from '../../shared/shouldUpdateMiniComponent'

class Component {
  constructor(props) {
    this.props = props
    this._currentElement = null
    this._pendingState = null

    // 当前component的render返回的element的component
    // 如果render返回一个<div>
    // 那么renderedComponent是一个DOMComponent
    this._renderedComponent = null
    this._renderedNode = null

    invariant(typeof this.render === 'function')
  }

  setState(partialState) {
    this._pendingState = partialState

    UpdateQueue.enqueueSetState(this, partialState)
  }

  _construct(element) {
    this._currentElement = element
  }

  mountComponent() {
    const renderedElement = this.render()



    // TODO: componentWillMount
    const renderedComponent = instantiateComponent(renderedElement)
    this._renderedComponent = renderedComponent

    const markup = Reconciler.mountComponent(renderedComponent)

    return markup
  }

  receiveComponent(nextElement) {
    this.updateComponent(this._currentElement, nextElement)
  }

  updateComponent(prevElement, nextElement) {
    if (prevElement !== nextElement) {
      // TODO: call componentWillReceiveProps
    }

    // TODO: call shouldComponentUpdate

    // TODO: call componentWillUpdate

    this._currentElement = nextElement
    this.props = nextElement.props
    this.state = this._pendingState
    this._pendingState = null

    const prevRenderedElement = this._renderedComponent._currentElement
    const nextRenderedElement = this.render()

    if (shouldUpdateMiniComponent(prevRenderedElement, nextRenderedElement)) {
      Reconciler.receiveComponent(this._renderedComponent, nextRenderedElement)
    } else {
      Reconciler.unmountComponent(this._renderedComponent)
      const nextRenderedComponent = instantiateComponent(nextRenderedElement)
      const nextMarkup = Reconciler.mountComponent(nextRenderedComponent)

      DOM.replaceNode(this._renderedComponent._domNode, nextMarkup)
      this._renderedComponent = nextRenderedComponent
    }
  }

  performUpdateInNecessary() {
    this.updateComponent(this._currentElement, this._currentElement)
  }

  unmountComponent() {
    if (!this._renderedComponent) {
      return
    }

    // TODO: call componentWillUnmount

    Reconciler.unmountComponent(this._renderedComponent)

    // TODO: 重置所有字段
  }
}

Component.isMiniClass = true

export default Component
