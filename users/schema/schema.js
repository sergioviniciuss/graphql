const graphql = require('graphql');
const axios = require('axios');

const URL = {
    BASE_URL: "http://localhost:3000/",
    USERS_ENDPOINT: "users/",
    COMPANIES_ENDPOINT: "companies/",
}

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,

} = graphql;

const CompanyType = new GraphQLObjectType({
    name: "Company",
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        users: { 
            type: new GraphQLList(UserType), 
            resolve(parentValue, args) {
                return axios.get(`${URL.BASE_URL}${URL.COMPANIES_ENDPOINT}${parentValue.id}/users`)
                .then(resp => resp.data);
            }
        },
    }),
})

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: {
            type: CompanyType,
            resolve(parentValue, args) {
                return axios.get(`${URL.BASE_URL}${URL.COMPANIES_ENDPOINT}${parentValue.companyId}`)
                    .then(resp => resp.data);
            }
        }
    }),
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        user: {
            type: UserType,
            args: {
                id: { 
                    type: GraphQLString,
                }
            },
            resolve(parentValue, args) {
                return axios.get(`${URL.BASE_URL}${URL.USERS_ENDPOINT}${args.id}`)
                .then(resp => resp.data);
            }
        },
        company: {
            type: CompanyType,
            args:{
                id: {
                    type: GraphQLString,
                }
            },
            resolve(parentValue, args) {
                return axios.get(`${URL.BASE_URL}${URL.COMPANIES_ENDPOINT}${args.id}`)
                .then(resp => resp.data);
            }
        }
    }
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                firstName: {
                    type: new GraphQLNonNull(GraphQLString),
                },
                age: {
                    type: new GraphQLNonNull(GraphQLInt),
                },
                companyId: {
                    type: GraphQLString,
                }
            },
            resolve(parentValue, {firstName, age}) {
                return axios.post(`${URL.BASE_URL}${URL.USERS_ENDPOINT}`,{ firstName, age })
                .then(resp => resp.data);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});
