const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Author = require('./models/author')
const Book = require('./models/book')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })


const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks (author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      //let filtered = books
//
      //if (args.author) {
      //  filtered = filtered.filter(b => b.author === args.author)
      //}
//
      //if (args.genre) {
      //  filtered = filtered.filter(b => b.genres.includes(args.genre))
      //}

      return Book.find({})
    },
    allAuthors: async () => Author.find({})
  },

  Author: {
    bookCount: (root) => {
      return //books.filter(b => b.author == root.name).length
    }
  },

  Mutation: {
    addBook: async (root, args) => {
      const book = new Book({ ...args })
      await book.save()

      const author = Author.findOne({ name: args.author })
      if (!author) {
        const newAuthor = new Author({
          name: args.author,
          bookCount: 1,
        })

        await author.save()
      }

      return book
    },
    editAuthor: (root, args) => {
      const author = Author.findOne({ name: args.name })
      if(!author) {
        return null
      }

      const updatedAuthor = {...author, born: args.setBornTo}
      //authors = authors.map(a => a.name === args.name ? updatedAuthor : a)
      return updatedAuthor
    }
   }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})