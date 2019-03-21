import Mini from '../mini'

class Root extends Mini.Component {
  constructor(props) {
    super(props)

    this.onClick = this.onClick.bind(this)

    this.state = {
      name: 'dxd'
    }

    setTimeout(() => {
      this.setState({
        name: 'world'
      })
    }, 3000)
  }

  onClick() {
    console.log('hello')
    this.setState({
      name: 'xxx'
    })
  }

  render() {
    return (
      <div>
        <h1>Hello {this.state.name}</h1>
        <button onClick={this.onClick}>change</button>
      </div>

    )
  }
}

export default Root
