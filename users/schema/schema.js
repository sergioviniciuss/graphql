const graphql = require('graphql');
const axios = require('axios');

const URL = {
    USERS_ENDPOINT: "http://localhost:3000/users/"
}

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,

} = graphql;

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLString}  ,
        firstName: { type: GraphQLString} ,
        age: { type: GraphQLInt} ,
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
        }
    }
});
module.exports = new GraphQLSchema({
    query: RootQuery,
})