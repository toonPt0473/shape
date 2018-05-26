import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import styled from 'styled-components';
import './App.css';

const Container = styled.div`
display: flex;
width: 100%;
justify-content: center;
align-items: center;
min-height: 60vh;
`;
const Btn = styled.button`
  height: 50px;
  width: 100px;
  background-color: coral;
`;
const Column = styled.div`
  flex: 1;
  display: flex;
  height: 600px;
  flex-direction: column;
`;
const Square = styled.div`
  flex: 1;
  border: 1px solid #777;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const randomChoice = () => Math.floor((Math.random() * (6 - 1)) + 1);
class App extends Component {
  state = {
    shape: '',
    active: 0,
    choice: randomChoice(),
  }
  onFetch = () => {
    axios.get(`/shape?shape=${this.state.choice}`)
      .then((result) => this.setState({ shape: result.data.shape }));
  }
  data = []

  sendData = () => {
    const answer = [];
    const maxLength = _.max(this.data.map((item) => item.length));
    _.times(maxLength, () => {
      this.data.forEach((item) => {
        const [popItem] = item.splice(0, 1);
        popItem && answer.push(popItem); // eslint-disable-line
      });
    });
    axios.post(`/shape?shape=${this.state.choice}`, { answer });
    this.setState({ shape: '', choice: randomChoice(), active: 0 });
  }
  renderShape = (shape) => {
    let divIndex = 0;
    this.data = [];
    return _.times(shape.length, (colIndex) => {
      this.data.push([]);
      return (
        <Column key={colIndex}>
          {_.times(Number(shape[colIndex]), () => {
            const key = divIndex += 1;
            this.data[colIndex].push(key);
            return (
              <Square
                style={{ background: this.state.active === key ? 'red' : '#dadada' }}
                onMouseDown={() => this.setState({ active: key })}
                onMouseUp={() => this.setState({ active: 0 })}
                key={key}
              >
                {key}
              </Square>
            );
          })}
        </Column>
      );
    });
  }

  render() {
    return (
      <div style={{ textAlign: 'center' }} >
        <Container>
          {!this.state.shape && <Btn onClick={this.onFetch}>fetch data</Btn>}
          {this.state.shape && this.renderShape(this.state.shape)}
        </Container>
        {this.state.shape && <Btn onClick={() => this.sendData(this.state.shape)}>send</Btn>}
      </div>

    );
  }
}

export default App;
