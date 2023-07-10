// This file is the schema of the graphql, it's like the database schema but for graphql
// This module was used to test the graphql queries without connected Mdb
// const { projects, clients } = require('../sampleData');

// Moongoose models for the database (work with MongoDB like schemas in GraphQL)
const Project = require('../models/Project');
const Client = require('../models/Client');

// We need to import some conversion tools from graphql
const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
    GraphQLEnumType
} = require('graphql');

// Creating a GraphQL type for "Client" object
const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString }
    }
});

// Creating a GraphQL type for "Project" object
const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        clientId: {
            type: ClientType,
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
            type: new GraphQLList(ProjectType),
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
// The mutation is the place where we write the code to add, update or delete data from the database (GraphQL is not only for getting data, it's also for adding, updating and deleting data like RestAPI)
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        // The addClient field will add a new client to the database
        addClient: {
            type: ClientType,
            // The args are the fields that we need to add a new client
            args: {
                // The GraphQLNonNull is a validation that the field is required
                name: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                phone: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                // Creating a new client object which will be saved in the database
                const client = new Client({
                    name: args.name,
                    email: args.email,
                    phone: args.phone
                });
                // Saving the client in the database
                return client.save();
            }
        },
        // The addProject field will add a new project to the database
        addProject: {
            type: ProjectType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
                status: {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatus',
                        values: {
                            'NOT_STARTED': { value: 'Not Started' },
                            'IN_PROGRESS': { value: 'In Progress' },
                            'COMPLETED': { value: 'Completed' },
                        }
                    }),
                    defaultValue: 'Not Started'
                },
                clientId: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                const project = new Project({
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientId: args.clientId
                });
                return project.save();
            }
        },
        // The updateClient field will update a client in the database
        deleteClient: {
            type: ClientType,
            // The args are the fields that we need to update a client
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            // The resolve function will return the client with the id that we pass in the args
            resolve(parent, args) {
                return Client.findByIdAndRemove(args.id);
            }
        },
        deleteProject: {
            type: ProjectType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                return Project.findByIdAndRemove(args.id);
            }
        },
        // The updateClient field will update a client in the database
        updateProject: {
            type: ProjectType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                // The status field is an enum type so we need to define it
                status: {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatusUpdate',
                        values: {
                            'NOT_STARTED': { value: 'Not Started' },
                            'IN_PROGRESS': { value: 'In Progress' },
                            'COMPLETED': { value: 'Completed' },
                        }
                    }),
                },
                clientId: { type: GraphQLID },
            },
            // The resolve function will return the client with the id that we pass in the args will be updated with the new name, desc. and status
            resolve(parent, args) {
                return Project.findByIdAndUpdate(
                    args.id,
                    {
                        // $set is a mongoose method that will update the fields that we pass
                        $set: {
                            name: args.name,
                            description: args.description,
                            status: args.status,
                            clientId: args.clientId
                        }
                    },
                    { new: true }
                );
            }
        }
    }
})


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});