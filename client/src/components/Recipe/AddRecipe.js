import React from "react";
import { Mutation } from "react-apollo";
import { ADD_RECIPE, GET_ALL_RECIPES, GET_USER_RECIPES } from "../../queries";
import Error from "../Error";

import { withRouter } from "react-router-dom";
import withAuth from "../withAuth";

const initialState = {
  name: "",
  instructions: "",
  category: "Snack",
  description: "",
  username: ""
};

class AddRecipe extends React.Component {
  state = { ...initialState };

  componentDidMount() {
    this.setState({
      username: this.props.session.getCurrentUser.username
    });
  }

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleSubmit = (event, addRecipe) => {
    event.preventDefault();
    addRecipe().then(({ data }) => {
      console.log(data);
      this.clearState();
      this.props.history.push("/");
    });
  };

  handleFileUpload = event => {
    console.log(event.target.files[0]);
  };

  validateForm = () => {
    const { name, category, description, instructions } = this.state;
    const isInvalid = !name || !category || !description || !instructions;
    return isInvalid;
  };

  updateCache = (cache, { data: { addRecipe } }) => {
    const { getAllRecipes } = cache.readQuery({ query: GET_ALL_RECIPES });

    cache.writeQuery({
      query: GET_ALL_RECIPES,
      data: {
        getAllRecipes: [addRecipe, ...getAllRecipes]
      }
    });
  };

  clearState = () => {
    this.setState({ ...initialState });
  };

  render() {
    const { name, category, description, instructions, username } = this.state;
    return (
      <Mutation
        mutation={ADD_RECIPE}
        variables={{ name, category, description, instructions, username }}
        refetchQueries={() => [
          { query: GET_USER_RECIPES, variables: { username } }
        ]}
        update={this.updateCache}
      >
        {(addRecipe, { data, loading, error }) => {
          return (
            <div className="App">
              <h2 className="App">Add Recipe</h2>
              <form
                className="form"
                onSubmit={event => this.handleSubmit(event, addRecipe)}
              >
                <input
                  type="text"
                  name="name"
                  onChange={this.handleChange}
                  placeholder="Recipe Name"
                  value={name}
                />
                <select
                  style={{ width: 148 }}
                  name="category"
                  onChange={this.handleChange}
                  value={category}
                >
                  <option value="Snack">Snack</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Appetizer">Appetizer</option>
                  <option value="Soup">Soup</option>
                  <option value="Salad">Salad</option>
                  <option value="Sandwich">Sandwich</option>
                  <option value="Entree">Entree</option>
                  <option value="Dessert">Dessert</option>
                </select>
                <input
                  type="text"
                  name="description"
                  onChange={this.handleChange}
                  placeholder="Add Description"
                  value={description}
                />
                <textarea
                  name="instructions"
                  onChange={this.handleChange}
                  placeholder="Add Instructions"
                  value={instructions}
                />
                <input type="file" onChange={this.handleFileUpload} />
                <button
                  disabled={loading || this.validateForm()}
                  type="submit"
                  className="button-primary"
                >
                  Submit
                </button>
                {error && <Error error={error} />}
              </form>
            </div>
          );
        }}
      </Mutation>
    );
  }
}

export default withAuth(session => session && session.getCurrentUser)(
  withRouter(AddRecipe)
);
