const express = require('express');
const graphqlHTTP = require('express-graphql')
const schema = require('./schema/schema')
const mongoose = require('mongoose');

const app = express();

mongoose.
connect('mongodb+srv://admin:test123@cluster0-4kavq.mongodb.net/test?retryWrites=true&w=majority', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
})

mongoose.connection.once('open', () => {
    console.log('connected to database');
});

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(4000, () => {
    console.log('now listening for requests for port 4000')
});