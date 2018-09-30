## How to start the application

1. Start the mock server `npm run json:server` (http://localhost:3000/users);
1. Start the GraphiQL server `npm run dev`;


## GraphiQL query sample:
```
{
  user(id:"2") {
    firstName
    company {
      id
      name
      description
    }
  }
}
```
