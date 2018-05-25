import React, { Component } from 'react';
import './App.css';
import axios from 'axios'
import _ from 'lodash'

class App extends Component {
  state = {
    shape: '',
    active: 0,
    choice: Math.random() * (5 - 1) + 1,
  }
  data = []
  onFetch = () => {
    axios.get(`/shape?shape=${this.state.choice}`)
      .then(result => this.setState({ shape: result.data.shape }))
  }
  renderShape = (shape) => {
    let divIndex = 0
    this.data = []
    return  _.times(shape.length, (colIndex) => {
      this.data.push([])
      return (
        <div style={{ flex: 1, height:600, display: 'flex', flexDirection: 'column' }}  key={colIndex}>
          {_.times(Number(shape[colIndex]), (index) => {
            const key = divIndex += 1
            this.data[colIndex].push(key)
            return (
              <div
                style={{ flex: 1, background: this.state.active === key ? 'red' : '#eee', border: '1px solid green', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={() => this.setState({ active: key })}
                key={key}
              >
                {key}
              </div>
            )
          })}
        </div>
      )
    })
  }
  sendData = (shape) => {
    const answer = []
    const maxLength = _.max(this.data.map(item => item.length))
    _.times(maxLength, () => {
      this.data.forEach(item => {
        const [popItem] = item.splice(0, 1)
        popItem && answer.push(popItem)
      })
    })
   axios.post(`/shape?shape=${this.state.choice}`, { answer })
   console.log(answer)
   this.setState({ shape: '', choice: Math.random() * (5 - 1) + 1, active: 0 })
  }
  render() {
    return (
      <div style={{ textAlign: 'center' }} >
        <div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }} >
          {!this.state.shape && <button onClick={this.onFetch} style={{ height: 50, width: 100, background: 'coral' }} >fetch data</button>}
          {this.state.shape && this.renderShape(this.state.shape)}
        </div>
        {this.state.shape && <button onClick={() => this.sendData(this.state.shape)} style={{ height: 50, width: 100, background: 'coral' }} >send</button>}
      </div>

    );
  }
}

export default App;
