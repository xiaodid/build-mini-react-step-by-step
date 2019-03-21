import invariant from 'tiny-invariant'
import MiniMultiChild from '../../shared/stack/reconciler/MiniMultiChild'
import DOM from '../client/utils/Dom'

class MiniDOMComponent extends MiniMultiChild {
  constructor(element) {
    super()
    this._currentElement = element
    this._domNode = null
  }

  mountComponent() {
    // TODO: 针对不同类型都元素进行特殊处理
    const el = document.createElement(this._currentElement.type)
    this._domNode = el

    this._updateDOMProperties({}, this._currentElement.props)
    this._createInitialDOMChildren(this._currentElement.props)
    return el
  }

  unmountComponent() {
    // react对于一些特殊的node类型做了特殊处理，
    // 特别是移除那些必须绑定当前节点的event handler
    this.unmountChildren()
  }

  receiveComponent(nextElement) {
    this.updateComponent(this._currentElement, nextElement)
  }

  updateComponent(prevElement, nextElement) {
    this._currentElement = nextElement

    this._updateDOMProperties(prevElement.props, nextElement.props)

    this._updateDOMChildren(prevElement.props, nextElement.props)
  }

  _createInitialDOMChildren(props) {
    let children = null
    if (
      typeof props.children === 'string' ||
      typeof props.children === 'number'
    ) {
      // TODO: 验证element type是否可以以text作为子元素
      this._domNode.textContent = props.children

    } else if (props.children) {
      const mountImages = this.mountChildren(props.children)
      DOM.appendChildren(this._domNode, mountImages)
    }

    return children
  }

  _updateDOMChildren(prevProps, nextProps) {
    // 在这，react做了很多工作来支持dangerouslySetInnerHTML
    const prevType = typeof prevProps.children
    const nextType = typeof nextProps.children

    invariant(prevType === nextType)

    if (nextType === 'undefined') {
      return
    }

    if (nextType === 'string' || nextType === 'number') {
      this._domNode.textContent = nextProps.children
    } else {
      this.updateChildren(nextProps.children)
    }
  }

  _updateDOMProperties(prevProps, nextProps) {
    let styleUpdates = {}

    Object.keys(prevProps).forEach((prop) => {
      if (nextProps.hasOwnProperty(prop) || prevProps[prop] == null) {
        return
      }

      if (prop === 'style') {
        Object.keys(prevProps[prop]).forEach(((style) => {
          styleUpdates[style] = ''
        }))
      } else {
        DOM._removeProperty(this._domNode, prop)
      }
    })

    Object.keys(nextProps).forEach((prop) => {
      const prevValue = prevProps[prop]
      const nextValue = nextProps[prop]

      // 如果值没变，则什么也不做
      if (Object.is(prevValue, nextValue)) {
        return
      }

      if (prop === 'style') {
        if (prevValue) {
          Object.keys(prevValue).forEach((style) => {
            if (!nextValue || !nextValue.hasOwnProperty(style)) {
              styleUpdates[style] = ''
            }
          })

          Object.keys(nextValue).forEach((style) => {
            if (prevValue[style] !== nextValue[style]) {
              styleUpdates[style] = nextValue[style]
            }
          })
        } else {
          styleUpdates = nextValue
        }
      } else {
        DOM.setProperty(this._domNode, prop, nextValue)
      }

      DOM.updateStyle(this._domNode, styleUpdates)
    })
  }
}

export default MiniDOMComponent
