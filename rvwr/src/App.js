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
  login = async(formData) => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_ADDRESS}/auth/login`, {
        credentials: 'include',
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const parsedResponse = await response.json();
    if(parsedResponse.status === 200){
        this.setState({
          loggedIn: true
        })
    }
}
  render() {
    return (
      <div className="App">
      { this.props.loggedIn ?
        <ReviewsContainer />
        :
        <AuthGateway  login = {this.login}
        />
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