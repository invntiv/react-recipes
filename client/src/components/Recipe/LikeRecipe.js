import React from "react";
import withSession from "../withSession";

import { Mutation } from "react-apollo";

class LikeRecipe extends React.Component {
  state = {
    username: ""
  };

  componentDidMount() {
    if (this.props.session.getCurrentUser) {
      const { username } = this.props.session.getCurrentUser;
      console.log(username);
      this.setState({ username });
    }
  }

  render() {
    const { username } = this.state;
    const { _id } = this.props;
    <Mutation mutation={LIKE_RECIPE} variables={{ _id, username }}>
      {() => {
        return username && <button>Like</button>;
      }}
    </Mutation>;
  }
}
export default withSession(LikeRecipe);
