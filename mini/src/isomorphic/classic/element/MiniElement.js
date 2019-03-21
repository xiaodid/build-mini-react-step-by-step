// createElement是给jsx转换用的
function createElement(type, config, children) {
  const props = Object.assign({}, config)

  // build props.chidren
  const count = arguments.length - 2
  if (count === 1) {
    props.children = children
  } else if (count > 1) {
    props.children = Array.prototype.slice.call(arguments, 2)
  }

  // 我们的element只有type和props两个字段
  // 暂不支持：
  // key
  // ref
  // 等等
  return {
    type,
    props,
  }
}

function isValidElement(element) {
  const typeofElement = typeof element
  const typeofType = element.type && typeof element.type

  return typeofElement === 'string' ||
    typeofElement === 'number' ||
    typeofType === 'string' ||
    (typeofType === 'function' && element.type.isMiniClass)
}

export default {
  createElement,
  isValidElement,
}
