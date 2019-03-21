import MiniElement from './src/isomorphic/classic/element/MiniElement'
import MiniMount from './src/renderers/dom/client/MiniMount'
import MiniDOMComponent from './src/renderers/dom/shared/MiniDOMComponent'
import MiniHostComponent from './src/renderers/shared/stack/reconciler/MiniHostComponent'
import MiniComponent from './src/renderers/shared/stack/reconciler/MiniCompositeComponent'

MiniHostComponent.inject(MiniDOMComponent)

export default {
  createElement: MiniElement.createElement,
  render: MiniMount.render,
  unmountComponentAtNode: MiniMount.unmountComponentAtNode,
  Component: MiniComponent,
}
