import { GraphQLError } from 'graphql'
import jwt from 'jsonwebtoken'
import Author from './models/author.js'
import Book from './models/book.js'
import User from './models/user.js'

import { PubSub } from 'graphql-subscriptions'
const pubsub = new PubSub()

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const filter = {};

      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        if (author) {
          filter.author = author._id;
        } else {
          return [];
        }
      }

      if (args.genre) {
        filter.genres = args.genre;
      }

      return Book.find(filter).populate('author')
    },
    allAuthors: async () => Author.find({}),
    me: (root, args, context) => {
      return context.currentUser
    }
  },

  Author: {
    bookCount: (root) => {
      return Book.collection.countDocuments({ author: root._id })
    }
  },

  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      let author = await Author.findOne({ name: args.author })

      if (!author) {
        author = new Author({
          name: args.author,
          bookCount: 0,
        })

        try {
          await author.save()
        } catch (error) {
          throw new GraphQLError('Creating the author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error
            }
          })
        }
      }

      const book = new Book({ ...args, author: author._id })

      try {
        await book.save()
      } catch (error) {
        throw new GraphQLError('Saving the book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error
          }
        })
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: book })

      return book.populate('author')
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      const author = await Author.findOne({ name: args.name })

      if (!author) {
        throw new GraphQLError('Author not found', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name
          }
        })
      }

      author.born = args.setBornTo;

      return await author.save()
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })

      return user.save()
        .catch(error => {
          throw new GraphQLError('Creating the user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args,
              error
            }
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if ( !user || args.password !== 'secret' ) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })        
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED')
    },
  },
}

export default resolvers