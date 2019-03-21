import hyphenateStyleName from '../../shared/hyphenateStyleName'

function empty(node) {
  [].slice.call(node.childNodes).forEach(node.removeChild, node)
}

function setProperty(node, attr, value) {
  // 不设置children
  if (attr === 'children') {
    return
  }

  if (attr === 'className') {
    attr = 'class'
  }

  if (attr.match(/^on.+/)) {
    const name = attr.toLowerCase().substring(2)
    if (value) {
      node.addEventListener(name, value)
    }
    return
  }

  node.setAttribute(attr, value)
}

function removeProperty(node, attr) {
  node.removeAttribute(attr)
}

function updateStyle(node, styles) {
  Object.keys(styles).forEach((style) => {
    node.style[hyphenateStyleName(style)] = styles[style]
  })
}

function appendChild(node, child) {
  node.appendChild(child)
}

function appendChildren(node, children) {
  if (Array.isArray(children)) {
    children.forEach(child => appendChild(node, child))
  } else {
    appendChild(node, children)
  }
}

function insertChildAfter(node, child, afterChild) {
  node.insertBefore(
    child,
    afterChild ? afterChild.nextSibling : node.firstChild,
  )
}

function removeChild(node, child) {
  node.removeChild(child)
}

function replaceNode(node, child) {
  node.parentNode.replaceNode(child, node)
}

function eventProxy(e) {
  return this._listener[e.type](options.event ? options.event(e) : e)
}

export default {
  empty,
  setProperty,
  removeProperty,
  updateStyle,
  appendChild,
  appendChildren,
  insertChildAfter,
  removeChild,
  replaceNode,
}
