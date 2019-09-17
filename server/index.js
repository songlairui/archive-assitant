const fs = require('fs')
const path = require('path')
const execa = require('execa')
const { GraphQLServer } = require('graphql-yoga')
const SimpleGit = require('simple-git/promise')

const sampleItems = [
  { name: 'Apple' },
  { name: 'Banana' },
  { name: 'Orange' },
  { name: 'Melon' },
]

const typeDefs = `
  type Query {
    items: [Item!]!
    getPaths(fullpath:String!): String!
    dirItems(fullpath:String!): [FileItem]
  }

  type FileItem {
    name: String!
    type: String
    ctime: String
    remotes: [Remote]
    initGit: Boolean
  }
  type Remote {
    name: String
    fetch: String
  }
  type Item {
    name: String!
  }
`

const resolvers = {
  Query: {
    items: () => sampleItems,
    getPaths: (_, { fullpath }) => {
      if (!fullpath) {
        return '/'
      }
      fullpath = path.resolve(fullpath, '.')
      if (fs.existsSync(fullpath)) {
        return fullpath
      } else {
        return '/'
      }
    },
    dirItems: async (_, { fullpath }) => {
      if (!fullpath) {
        return '/'
      }
      fullpath = path.resolve(fullpath, '.')
      if (!fs.existsSync(fullpath)) {
        throw new Error('not exist')
      }
      const stat = fs.statSync(fullpath)
      if (!stat.isDirectory()) {
        throw new Error('not directory')
      }
      return Promise.all(fs.readdirSync(fullpath).map(async name => {
        const currentItem = path.join(fullpath, name)
        const stat = fs.statSync(currentItem)
        let type = 'x'
        let initGit = false
        let remotes = []
        if (stat.isDirectory()) {
          type = 'directory'
          initGit = fs.existsSync(path.join(currentItem, '.git'))
        }
        if (initGit) {
          const simpleGit = SimpleGit(currentItem)
          remotes = (await simpleGit.getRemotes(true)).map(({ name, refs: { fetch } }) => ({ name, fetch }))
        }
        return {
          name,
          initGit,
          type,
          remotes,
          ctime: stat.ctime.toISOString(),
        }
      }))
    }
  },
}

const options = { port: 4000 }
const server = new GraphQLServer({ typeDefs, resolvers })
server.start({ options }, () => console.log('Server is running on localhost:' + options.port))
