function shouldUpdateMiniComponent(prevElement, nextElement) {
  const prevType = typeof prevElement
  const nextType = typeof nextElement

  if (prevType === 'string') {
    return nextType === 'string'
  }

  return prevElement.type === nextElement.type
}

export default shouldUpdateMiniComponent
