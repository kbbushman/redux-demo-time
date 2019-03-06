import React, {Component} from 'react';
import { connect } from 'react-redux';
import { register, login } from '../reduxStuff/actions/authActions';

class AuthGateway extends Component{
    constructor(){
        super();
        this.state = {
            registerForm: {
                username: "",
                password: ""
            },
            loginForm: {
                username: "",
                password: ""
            }
        }
    }
    handleRegisterInput = (e) => {
        this.setState({
            registerForm: {
                ...this.state.registerForm,
                [e.currentTarget.name] : e.currentTarget.value
            }
        })
    }
    handleRegister = (e) => {
        e.preventDefault();
        this.props.register(this.state.registerForm);
    }
    handleLoginInput = (e) => {
        this.setState({
            loginForm: {
                ...this.state.loginForm,
                [e.currentTarget.name] : e.currentTarget.value
            }
        })
    }
    handleLogin = (e) => {
        e.preventDefault();
        this.props.login(this.state.loginForm);
    }
    render(){
        return(
            <div>
                <h1>You must log in or register to pass judgment</h1>
                <form onSubmit={this.handleRegister}>
                    <h5>REGISTER AS A NEW USER</h5>
                    username: <input type="text" name="username" onChange={this.handleRegisterInput}/>
                    password: <input type="text" name="password" onChange={this.handleRegisterInput}/>
                    <input type="submit"/>
                </form>
                <form onSubmit={this.handleLogin}>
                    <h5>LOGIN</h5>
                    username: <input type="text" name="username" onChange={this.handleLoginInput}/>
                    password: <input type="text" name="password" onChange={this.handleLoginInput}/>
                    <input type="submit"/>
                </form>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return{
        register: (formData) => { register(dispatch, formData)},
        login: (formData) => { login(dispatch, formData)}
    }
}

export default connect(null, mapDispatchToProps)(AuthGateway);