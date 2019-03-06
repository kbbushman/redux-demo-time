import React, { Component } from 'react';
import './App.css';
import AuthGateway from './AuthGateway/AuthGateway';
import ReviewsContainer from './ReviewsContainer/ReviewsContainer';
import { connect } from 'react-redux';

class App extends Component {
  constructor(){
    super();
    this.state = {
      loggedIn: false,
      user: {}
    }
  }

  render() {
    return (
      <div className="App">
      { this.props.loggedIn ?
        <ReviewsContainer />
        :
        <AuthGateway  />
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return{
    loggedIn : state.auth.loggedIn
  }
}
export default connect(mapStateToProps)(App);