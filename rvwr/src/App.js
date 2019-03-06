import React, { Component } from 'react';
import './App.css';
import AuthGateway from './AuthGateway/AuthGateway';
import ReviewsContainer from './ReviewsContainer/ReviewsContainer';

class App extends Component {
  constructor(){
    super();
    this.state = {
      loggedIn: false,
      user: {}
    }
  }
  register = async(formData) => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_ADDRESS}/users`, {
        method: "POST",
        body: JSON.stringify(formData),
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const parsedResponse = await response.json();
      if(parsedResponse.status === 200){
          this.setState({
            loggedIn: true,
            user: parsedResponse.user
          })
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
      { this.state.loggedIn ?
        <ReviewsContainer />
        :
        <AuthGateway register = {this.register} 
                     login = {this.login}
        />
        }
      </div>
    );
  }
}

export default App