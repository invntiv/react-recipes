const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config({
  path: "variables.env"
});

const Recipe = require("./models/Recipe");
const User = require("./models/User");

// Bring in GraphQL-Express Middleware
const { graphiqlExpress, graphqlExpress } = require("apollo-server-express");

const { makeExecutableSchema } = require("graphql-tools");

const { typeDefs } = require("./schema");

const { resolvers } = require("./resolvers");

// Create schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

// Connects to Database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected!"))
  .catch(err => console.error(err));

// Initializes application
const app = express();

/* Enable Cross-Origin Resource Sharing
  to prevent Access-Control errors */
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true
};
app.use(cors(corsOptions));

// Create GraphiQL application
app.use(
  "/graphiql",
  graphiqlExpress({
    endpointURL: "/graphql"
  })
);

// Connect Schemas with GraphQL
app.use(
  "/graphql",
  bodyParser.json(),
  graphqlExpress({
    schema,
    context: {
      Recipe,
      User
    }
  })
);

const PORT = process.env.PORT || 4444;
app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});
