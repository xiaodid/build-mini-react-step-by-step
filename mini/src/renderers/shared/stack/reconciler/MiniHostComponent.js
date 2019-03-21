import invariant from 'tiny-invariant'

// 基于平台的component
// DOM or native
let Implementation

function construct(element) {
  invariant(Implementation)

  return new Implementation(element)
}

function constructTextComponent(element) {
  return construct({
    type: 'span',
    props: {
      children: element,
    },
  })
}

function inject(impl) {
  Implementation = impl
}

export default {
  inject,
  constructTextComponent,
  construct,
}
