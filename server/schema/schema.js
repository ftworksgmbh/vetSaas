const graphql = require('graphql');
const _ = require('lodash')
const Customer = require('../models/customer')
const Vet = require('../models/vet')

const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema,
    GraphQLID,
    GraphQLList
} = graphql;

// var vets = [
//     {name: 'Mr. Vet', email: 'vet@vet.com', phone:'9902260669', id: '919902260669', customerId: '919902260660'},
//     {name: 'Mr. V', email: 'v@vet.com', phone:'9904460669', id: '919904460669', customerId: '919904460660'},
//     {name: 'Mr. T', email: 't@vet.com', phone:'9902255555', id: '91990225555', customerId: '919902255550'}
// ]

// var customers = [
//     {name: 'Mr. A', email: 'A@vet.com', phone:'9902260660', id: '919902260660', vetId: '919902260669'},
//     {name: 'Mr. B', email: 'B@vet.com', phone:'9904460660', id: '919904460660', vetId: '919904460669'},
//     {name: 'Mr. C', email: 'C@vet.com', phone:'9902255550', id: '919902255550', vetId: '91990225555'}
// ]

const VetType = new GraphQLObjectType({
    name:'Vet',
    fields:() => ({
        id: { type: GraphQLID},
        name: { type: GraphQLString},
        email: { type: GraphQLString},
        phone: { type: GraphQLString},
        customers: {
            type: new GraphQLList(CustomerType),
            resolve(parent, args) {
                return Customer.find({customerId: parent.id});
            }
        }
    })
})

const CustomerType = new GraphQLObjectType({
    name:'Customer',
    fields:() => ({
        _id: { type: GraphQLID},
        name: { type: GraphQLString},
        email: { type: GraphQLString},
        phone: { type: GraphQLString},
        vets: {
            type: new GraphQLList(VetType),
            resolve(parent, args) {
                // return _.filter(vets, {id: parent.vetId})
                return Vet.find({vetId: parent.id})
            }
        }
    })
})


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        vet:{
            type: VetType,
            args: {id:{type: GraphQLID}},
            resolve(parent, args){
                // code to get data from db/ other source
                // return _.find(vets, {id:args.id});
                return Vet.findById(args.id)
            }
        },
        customer: {
            type: CustomerType,
            args: {id:{type: GraphQLID}},
            resolve(parents,args) {
                // return_find(customers, {id:args.id})
                return Customer.findById(args.id)
            }
        },

        vets: {
            type: new GraphQLList(VetType),
            resolve(parents, args) {
                // return vets
                return Vet.find({})
            }
        },

        customers: {
            type: new GraphQLList(CustomerType),
            resolve(parent, args) {
                // return customers
                return Author.find({})
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name:'Mutation',
    fields: {
        addCustomer: {
            type: CustomerType,
            args: {
                // _id: {type: GraphQLID},
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                phone: { type: GraphQLString }
            },
            resolve(parent, args) {
                let customer = new Customer({
                    // _id: args.id,
                    name: args.name,
                    email: args.email,
                    phone: args.phone
                });
                return customer.save()
            }
        },
        addVet: {
            type: VetType,
            args: {
                // id: {type: GraphQLID},
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                phone: { type: GraphQLString }
            },
            resolve(parent, args) {
                let vet = new Vet({
                    // id: args.id,
                    name: args.name,
                    email: args.email,
                    phone: args.phone
                })
                return vet.save()
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})