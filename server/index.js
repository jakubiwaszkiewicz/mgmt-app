// Entry point for the server
const express = require('express');
const colors = require('colors');
// Adding the dotenv package to use the .env file
require('dotenv').config();
// The express-graphql module provides a simple way to create an Express server that runs a GraphQL API.
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema.js');
const connectDB = require('./config/db.js');
const port = process.env.PORT || 5000;

// Creating the express app
const app = express();

connectDB();

// Creating the graphql endpoint dev: http://localhost:5000/graphql
app.use('/graphql',
    // The graphqlHTTP is a middleware function, constructs an Express application based on a GraphQL schema.
    graphqlHTTP({
        schema,
        // The graphiql is a graphical interactive in-browser GraphQL IDE which you can find in link above
        graphiql: process.env.NODE_ENV === 'development',
    })
);

// Starting the server on port 5000 or the port in the .env file
app.listen(port, () => {console.log(`Server is running on port ${port}`)});

// 48:33