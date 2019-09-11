const fs = require('fs')
const path = require('path')
const { GraphQLServer } = require('graphql-yoga')

const sampleItems = [
  { name: 'Apple' },
  { name: 'Banana' },
  { name: 'Orange' },
  { name: 'Melon' },
]

const typeDefs = `
  type Query {
    items: [Item!]!
    getPaths(fullPath:String!): String!
  }

  type Item {
    name: String!
  }
`

const resolvers = {
  Query: {
    items: () => sampleItems,
    getPaths: (_, { fullPath }) => {
      if (!fullPath) {
        return '/'
      }
      fullPath = path.resolve(fullPath, '.')
      if (fs.existsSync(fullPath)) {
        return fullPath
      } else {
        return '/'
      }
    }
  },
}

const options = { port: 4000 }
const server = new GraphQLServer({ typeDefs, resolvers })
server.start({ options }, () => console.log('Server is running on localhost:' + options.port))
