// This file is the schema of the graphql, it's like the database schema but for graphql
const { projects, clients } = require('../sampleData');

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
        clientId: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString }
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
                return clients.find(client => client.id === args.id);
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
                return projects.find(project => project.id === args.id);
            }
        },
        // The clients field will return a list of clients so the type is GraphQLList of ClientType
        clients: {
            type: new GraphQLList(ClientType),
            // The resolve function will return the list of clients
            resolve (parent, args) {
                return clients;
            }
        },
        // The clients field will return a list of clients so the type is GraphQLList of ClientType
        projects: {
            types: new GraphQLList(ProjectType),
            // The resolve function will return the list of projects
            resolve (parent, args) {
                return projects;
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