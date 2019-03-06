# Redux Intro

---

#### What is it?

Redux is a state management tool popularly used with React, but able to be used with any front-end framework. 

---

#### The problem

Does this look familiar?

```javascript
<PostContainer createPost={this.createPost} />
```

```javascript
<NewPost createPost={this.props.createPost} />
```

```javascript
<NewPostForm createPost={this.props.createPost} />
```

---

#### Too much plumbing!

As a React app grows, the amount of connections seems to increase exponentially. Passing props and functions through multiple components, having to wire a function through several generations of components, and massively increasing amounts of props given through each new layer can be a headache to manage.

---

#### The solution

Redux will provide us with one centralized location for state. While you can still have localized state inside your components, anything part of state you think might effect multiple components can be refactored to be stored in the globalized state object managed by redux.

---

#### Let's break it down

We will create a globalized object to store the state of our application. Redux calls this a `store`.

---

#### Reducers modify the state

We will write functions that can mutate parts the global state object. These will be called `reducers`. A reducer is given an `action` object that tells it what type of change will be made to state, and any data that might be needed to make that change.

---

#### Actions trigger the reducers

So, if a `reducer` is given an action, the logical next step is defining these actions. Actions are where you'll make any fetch calls to the server and, depending on the response, you will `dispatch` an action to the reducer. 

---

#### Actions are pulled directly into components

Of course, these actions have to be triggered from somewhere. Actions are given directly into components as props using the `mapDispatchToProps` function. We import the action function from our actions file, and inject it into the component that wants to call the action using `mapDispatchToProps`.

---

#### State is also pulled into components

So far, we've described how a component can change state- it is given an action function, which will dispatch information to the reducers that manage the state object. For components that want to subscribe to this global state, we can use `mapStateToProps` to directly pull in the current state to any component that wants it.

---

#### Recap Before We Try It

1. Global state is stored in the store.
2. Reducers are responsible for managing slices of state.
3. Actions execute functionality and send an action object up to the reducers.
4. Actions are pulled directly into components using `mapDispatchToProps`
5. State is pulled directly into components using `mapStateToProps`

---

## Refactoring to Use Redux

Let's take the Reviewer app from this repo and refactor it to use Redux to manage the state of the application. You'll need to create .env files for the app to access environment variables. Create one at the root level of the entire project, as a sibling to server.js, to define the variables used by express.

---

#### Server-side .env

The specific values may change, but you'll have to define these three variables in the root-level .env file.

```
REACT_APP_ADDRESS=http://localhost:3000
SESSION_SECRET=newsecretissupersafe
MONGODB_URI=mongodb://localhost/fullMERN
```

---

#### React .env

Luckily our react app only uses one environment variable for the location of the server to make fetch calls. Create another .env file inside of the react folder, as a sibling to src and public.

```
REACT_APP_BACKEND_ADDRESS="http://localhost:9001/api/v1"
```

___

#### Review the Review App

Take a few minutes to absorb what's going on in the app, in both the server and client side. You can see that authentication is handled at the root level of the app, which passes down functions to login and register to the AuthGateway Component. Let's use the registration functionality to implement redux into this project, then try to add login on your own using the same pattern.

---

#### Step One: The Store

I recommend making a separate folder for `reduxStuff` inside of the react app's `src` folder. The first file you'll need in this folder is `configureStore.js` which defines and sets up the store which will hold our redux-managed state.

```javascript
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';

export default function configureStore(initialState = {}) {
    return createStore(
        rootReducer,
        applyMiddleware(thunk)
    );
}
``` 

---

#### Configuring the App to use the Store

We will have to modify the `index.js` file to include the Provider in our app. Your imports may vary if you didn't name the folder `reduxStuff` like I did.

```javascript
import { Provider } from 'react-redux';
import configureStore from './reduxStuff/configureStore';

ReactDOM.render(
    <Provider store={configureStore()}>
        <App />
        </Provider>
        , document.getElementById('root'));
```

---

#### The Root Reducer

Notice how the store is importing a `rootReducer` ? Let's create that by creating a folder named `reducers` and a file inside of it named `rootReducer.js`. The rootReducer allows us to split off the state tree into separate slices, each managed by their own, more specific reducer. We'll start with an authReducer to handle our authentication state.

Inside of `rootReducer.js`

```javascript
import {combineReducers} from 'redux';
import authReducer from './authReducer';
const rootReducer = combineReducers({
    auth: authReducer,
});

export default rootReducer;
```

---

Same folder, new file: `authReducer.js`

```javascript
const initialState = {
    loggedIn: false,
    currentUser: {
        "username": null,
        "_id": null
    }
}
```

A reducer file will define the intialState of our application, before any actions have been taken by the user. In this case, we start with loggedIn as false and a currentUser with no information.

---

Add to `authReducer.js`

```javascript
const authReducer = (state = initialState, action) => {
    switch(action.type){
        case "REGISTER":
            return{
                ...state,
                loggedIn: true,
                currentUser: action.payload
            }
        default:
            return state
    }
}
export default authReducer;
```

A reducer is defined as a function that takes in the previous state object and an action that will be used to return a new version of state. The action object will have `type` and `payload` properties, representing what type of mutation we want to make to state, and the payload will carry any data necessary to make that mutation.

---

#### Quick Recap

So far, we've set up the store in our application. The store is configured to accept modifications from the rootReducer, which, in turn, has designated the authReducer as being the function in charge of the `auth` section of the state tree. The authReducer will only be able to make changes to the `state.auth` sub-section of the global state, so the `loggedIn` property we defined will be accessed through `state.auth.loggedIn`. On to creating an Action, then giving that action to the AuthGateway component!

---

#### Babby's First Action

Inside the reduxStuff folder, as a sibling to the reducers folder, let's make an `actions` folder, and an `authActions.js` file inside of that folder. In this file, we'll define action functions- an action takes in the redux-defined `dispatch` function, which is responsible for dispatching, or sending, action objects to the reducers. Again, the action objects will look like so:

```javascript
    {   
        type: "REGISTER",
        payload: data
    }
```

---

The following function defines our register action. In this demo we'll only concern ourselves with a successful response, but adding a REGISTER_FAILURE action to provide error messages to users would be a great exercise to expand your redux skills.

```javascript
export const register = async(dispatch, formData) => {
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
        dispatch({
            type: "REGISTER",
            payload: parsedResponse.data
        })
    }else{
        //TODO: REGISTER_FAILURE
    }
}
```

---

#### Providing the Action to a Component

Now that we have an action function, all that's left is to hook up the AuthGateway Component to allow it to call this register action. After that, we'll allow the root component in App.js to subscribe to the auth state, allowing it to access the `state.auth.loggedIn` property.

---

Add the following to our AuthGateway.jsx component:

```javascript
import { connect } from 'react-redux';
import { register } from '../reduxStuff/actions/authActions';

// component stuff, then at the bottom...

const mapDispatchToProps = (dispatch) => {
    return{
        register: (formData) => { register(dispatch, formData)}
    }
}
```

And modify the export statement:

```javascript
export default connect(null, mapDispatchToProps)(AuthGateway);
```

---

#### Getting the redux state into App.js

Last step! We add a few lines to App.js to allow it to read from the redux state, in the form of props. This will allow the App.js to have a `this.props.loggedIn` property that gets pulled from the redux store. We can therefore eliminate the local state object in the constructor, and change `this.state.loggedIn` to `this.props.loggedIn`

```javascript
import { connect } from 'react-redux';

// component stuff, then at the bottom...

const mapStateToProps = (state) => {
  return{
    loggedIn : state.auth.loggedIn
  }
}
export default connect(mapStateToProps)(App);
```

---

#### Try it out!

At this point, hopefully everything works! Our register action should automatically log in a new user, updating state and providing the loggedIn property to the App.js component. 

One really nice feature is that everything else (except login) still works! The redux-managed state and the localized state in ReviewsContainer can live side by side in peace. Redux doesn't demand management of every possible bit of state in your application, so things like the internal state of a form never need to get hooked up to Redux. You can choose how much of state makes sense to refactor to Redux- if a portion of state is potentially modified or read by several components, it's a good candidate to use Redux. If state is only held temporarily in a form, however, it's probably not worth the trouble.

---

#### You do it!

With this pattern established, we've done a lot of the foundational work to set up Redux. Try following the same pattern to implement the login functionality to use Redux as well. You can work back-to-front by starting in the reducer and working your way forward, or start in the AuthGateway comopnent and work your way back.

---

# Conclusion

This was a lot of work for this app. Is it even worth it? According to the creator of Redux, most often the answer is NO. For a smaller application, Redux can be overkill and provide a lot more complexity without much gain. However, as an application grows and more parts of state are being managed and passed through more and more components, Redux can dramatically simplify the code written in Components, and allow re-usability of actions throughout multiple components.

![A diagram of the redux process](./redux_diagram.gif)
