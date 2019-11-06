import "./index.css";
import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "react-apollo";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import ApolloClient from "apollo-boost";

import App from "./components/App";
import SignIn from "./components/Auth/Signin";
import SignUp from "./components/Auth/Signup";
import withSession from "./components/withSession";
import Navbar from "./components/navbar";
import Search from "./components/Recipe/Search";

const client = new ApolloClient({
  uri: "http://localhost:4444/graphql",
  fetchOptions: {
    credentials: "include"
  },
  request: operation => {
    const token = localStorage.getItem("token");
    operation.setContext({
      headers: {
        authorization: token
      }
    });
  },
  onError: ({ networkError }) => {
    if (networkError) {
      console.log("Network Error", networkError);
    }

    if (networkError.statusCode === 401) {
      // localStorage.removeItem('token');
    }
  }
});

const Root = ({ refetch }) => (
  <Router>
    <Fragment>
      <Navbar />
      <Switch>
        <Route path="/" exact component={App} />
        <Route path="/search" exact component={Search} />
        <Route path="/signin" render={() => <SignIn refetch={refetch} />} />
        <Route path="/signup" component={SignUp} />
        <Redirect to="/" />
      </Switch>
    </Fragment>
  </Router>
);

const RootWithSession = withSession(Root);

ReactDOM.render(
  <ApolloProvider client={client}>
    <RootWithSession />
  </ApolloProvider>,
  document.getElementById("root")
);
