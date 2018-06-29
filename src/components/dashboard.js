import React from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import requiresLogin from './requires-login.js';
import {fetchProtectedData} from '../actions/protected-data.js';
import {clearAuth} from '../actions/auth.js';
import {clearAuthToken} from '../local-storage.js';

export class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      warningTime: 1000 * 5,
      signoutTime: 1000 * 10,
      kickAlert: false
    };
  }

  componentDidMount() {
    this.props.dispatch(fetchProtectedData());
    this.events = [
      'load',
      'mousemove',
      'mousedown',
      'click',
      'scroll',
      'keypress'
    ];
    for (let i in this.events) {
      window.addEventListener(this.events[i], this.resetTimeout);
    }
    this.setTimeout();
  }
  
    componentWillUnmount() {
      this.clearTimeoutFunc();
      for (let i in this.events) {
        window.removeEventListener(this.events[i], this.resetIdleTimer);
      }
    }
  
  clearTimeoutFunc = () => {
    if (this.warnTimeout) clearTimeout(this.warnTimeout);
    if (this.logoutTimeout) clearTimeout(this.logoutTimeout);
  };

  setTimeout = () => {
    this.warnTimeout = setTimeout(this.warn, this.state.warningTime);
    this.logoutTimeout = setTimeout(this.logout, this.state.signoutTime);
  };

  resetTimeout = () => {
    this.clearTimeoutFunc();
    this.setTimeout();
  };

  warn = () => {
    this.setState({kickAlert: true})
  };

  resetWarn = () => {
    this.setState({kickAlert: false});
  }

  logout = () => {
    // send a logout request to the API
    // this.destroy();
    this.props.dispatch(clearAuth());
    clearAuthToken();
    return <Redirect to='/' />;
  };

  // destroy = () => {
  //   // clear the session
  //   browserHistory.push('/');
  //   window.location.assign('/');
  // };

  render() {
    if (this.state.kickAlert) {
      return (
        <div className="dashboard">
          <div className="timeout-warning">
            You will be kicked in the next minute due to inactivity...
            <button onClick={() => this.resetWarn()}>But I'm still here...</button>
          </div>
          <div className="dashboard-username">
            Username: {this.props.username}
          </div>
          <div className="dashboard-name">
            Name: {this.props.name}
          </div>
          <div className="dashboard-protected-data">
            Protected data: {this.props.protectedData}
          </div>
        </div>
      );
    } else {
      return (
        <div className="dashboard">
          <div className="dashboard-username">
            Username: {this.props.username}
          </div>
          <div className="dashboard-name">
            Name: {this.props.name}
          </div>
          <div className="dashboard-protected-data">
            Protected data: {this.props.protectedData}
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = state => {
  const {currentUser} = state.auth;
  return {
    username: state.auth.currentUser.username,
    name: `${currentUser.firstName} ${currentUser.lastName}`,
    protectedData: state.protectedData.data
  };
};

export default requiresLogin()(connect(mapStateToProps)(Dashboard));
