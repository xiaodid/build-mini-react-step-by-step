function mountComponent(component) {
  // 生成将被插入到DOM中的DOM节点
  return component.mountComponent()
}

function unmountComponent(component, node) {
  component.unmountComponent()
}

function receiveComponent(component, element) {
  const prevElement = component._currentElement
  if (prevElement === element) {
    return
  }

  component.receiveComponent(element)
}

function performUpdateIfNecessary(component) {
  component.performUpdateInNecessary()
}

export default {
  mountComponent,
  unmountComponent,
  receiveComponent,
  performUpdateIfNecessary,
}
