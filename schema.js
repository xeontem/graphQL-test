const fetch = require('node-fetch')
const util = require('util')
const parseXML = util.promisify(require('xml2js').parseString)
const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLInt,
    GraphQLList
} = require('graphql');

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: '...',
    fields: () => ({
        title: {
            type: GraphQLString,
            resolve: xml => xml.title[0]
        },
        isbn: {
            type: GraphQLString,
            resolve: xml => xml.isbn[0]
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: '...',
    fields: () => ({
        name: {
            type: GraphQLString,
            resolve: xml => xml.GoodreadsResponse.author[0].name[0]
        },
        books: {
            type: new GraphQLList(BookType),
            resolve: xml => xml.GoodreadsResponse.author[0].books[0].book
        }    
    })
})

module.exports = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        description: '...',
        fields: () => ({
            author: {
                type: AuthorType,
                args: {
                    id: { type: GraphQLInt },
                    type: { type: GraphQLString }
                },
                resolve: (root, args) => fetch(`https://www.goodreads.com/author/show.xml?id=${args.id}&key=PVLaNIZH2P7BY8lctoKxvw`)
                .then(res => res.text())
                .then(parseXML)
            }
        })
    })
})