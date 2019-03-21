import invariant from 'tiny-invariant'
import Element from '../../../../isomorphic/classic/element/MiniElement'
import MiniHostComponent from './MiniHostComponent'

function instantiateComponent(element) {
  invariant(Element.isValidElement(element), 'CAN NOT INSTANTIATE an INVALID ELEMENT')

  const { type } = element
  let wrapperInstance

  if (typeof type === 'string') {
    wrapperInstance = MiniHostComponent.construct(element)
  } else if (typeof type === 'function') {
    wrapperInstance = new element.type(element.props)
    wrapperInstance._construct(element)
  } else if (typeof element === 'string' || typeof element === 'number') {
    wrapperInstance = MiniHostComponent.constructTextComponent(element)
  }

  return wrapperInstance
}

export default instantiateComponent
