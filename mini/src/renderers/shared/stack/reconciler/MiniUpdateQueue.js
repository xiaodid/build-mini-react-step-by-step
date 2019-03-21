import Reconciler from './MiniReconciler'

function enqueueSetState(instance, partialState) {
  instance._pendingState = Object.assign({}, instance.state, partialState)

  Reconciler.performUpdateIfNecessary(instance)
}

export default {
  enqueueSetState,
}
