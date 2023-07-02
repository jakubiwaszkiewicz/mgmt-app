// This file is the schema of the graphql, it's like the database schema but for graphql
const { projects, clients } = require('../sampleData');

// Moongoose models for the database (work with MongoDB like schemas)
const Project = require('../models/Project');
const Client = require('../models/Client');

// We need to import some things from graphql
const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLSchema,
    GraphQLList
} = require('graphql');

// Creating a type for Client data which is in the sampleData.js 
const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString }
    }
});

// Creating a type for Project data which is in the sampleData.js 
const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        clientId: {
            type: GraphQLID,
            // Parent is just the project object
            resolve(parent, args) {
                return Client.findById(parent.clientId);
            }
        },
    }
});

// The RootQuery do for us some queries that bring back a list of clients, and some that bring back a single client.
const RootQuery = new GraphQLObjectType({
    // The name of the query
    name: 'RootQueryType',
    // The fields of the query
    fields: {
        // The client field will return a single client depends on the id
        client: {
            type: ClientType,
            args: {
                id: { type: GraphQLID }
            },
            // The resolve function will return the client with the id that we pass in the args
            resolve(parent, args) { 
                // findById is a mongoose method that find the client by id
                return Client.findById(args.id);
            }
        },
        // The project field will return a single client depends on the id
        project: {
            type: ProjectType,
            args: {
                id: { type: GraphQLID }
            },
            // The resolve function will return the project with the id that we pass in the args
            resolve (parent, args) {
                // findById is a mongoose method that find the project by id
                return Project.findById(args.id);
            }
        },
        // The clients field will return a list of clients so the type is GraphQLList of ClientType
        clients: {
            type: new GraphQLList(ClientType),
            // The resolve function will return the list of clients
            resolve (parent, args) {
                // Returning the clients from the database
                return Client.find();
            }
        },
        // The clients field will return a list of clients so the type is GraphQLList of ClientType
        projects: {
            types: new GraphQLList(ProjectType),
            // The resolve function will return the list of projects
            resolve (parent, args) {
                // Returning the projects from the database
                return Project.find();
            }
        }
    }
});
/*
RootQuery is the entry point for the graphql queries, so if we want to get the data from the database we need to use the following code (example based on the projects data):

    // How to get a single project by id
        {
            project(id: "1") {
                name
                status
                description
            }
        }
    // How to get all projects
        {
            project {
                name
                status
                description
            }
        }
    // How to get a single client name by project id
        {
            project {
                client {
                    name
                }
            }
        }
*/


module.exports = new GraphQLSchema({
    query: RootQuery
});