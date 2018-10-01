const graphql = require('graphql');
const axios = require('axios');

const URL = {
    USERS_ENDPOINT: "http://localhost:3000/users/",
    COMPANIES_ENDPOINT: "http://localhost:3000/companies/",
}

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,

} = graphql;

const CompanyType = new GraphQLObjectType({
    name: "Company",
    fields: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
    }
})

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: {
            type: CompanyType,
            resolve(parentValue, args) {
                return axios.get(`${URL.COMPANIES_ENDPOINT}${parentValue.companyId}`)
                    .then(resp => resp.data);
            }
        }
    }

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
                return axios.get(`${URL.USERS_ENDPOINT}${args.id}`)
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
                return axios.get(`${URL.COMPANIES_ENDPOINT}${args.id}`)
                .then(resp => resp.data);
            }
        }
    }
});
module.exports = new GraphQLSchema({
    query: RootQuery,
})