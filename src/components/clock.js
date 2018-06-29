import React from 'react';

export default class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  //this hook runs after component is renedered to DOM
  componentDidMount() {
    this.timerID = setInterval( // timerID right onto "this", as if adding timerID as a new prop to the Clock object
      () => this.tick(),
      1000 // this is one second
    );
  }

  // tear down the timer in this hook
  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
