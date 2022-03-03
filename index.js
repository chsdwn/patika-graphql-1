const { ApolloServer, gql } = require('apollo-server')
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core')
const { users, events, locations, participants } = require('./data.json')

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    events: [Event!]
  }

  type Event {
    id: ID!
    title: String!
    desc: String
    date: String
    from: String
    to: String
    location_id: ID!
    location: Location!
    user_id: ID!
    user: User!
    participants: [Participant!]
  }

  type Location {
    id: ID!
    name: String!
    desc: String
    lat: Float
    lng: Float
  }

  type Participant {
    id: ID!
    user_id: ID!
    event_id: ID!
  }

  type Query {
    user(id: ID!): User
    users: [User!]

    event(id: ID!): Event
    events: [Event!]

    location(id: ID!): Location
    locations: [Location!]

    participant(id: ID!): Participant
    participants: [Participant!]
  }
`

const resolvers = {
  Query: {
    user: (_, args) => users.find((u) => u.id === Number(args.id)),
    users: () => users,

    event: (_, args) => events.find((e) => e.id === Number(args.id)),
    events: () => events,

    location: (_, args) => locations.find((l) => l.id === Number(args.id)),
    locations: () => locations,

    participant: (_, args) => participants.find((p) => p.id === Number(args.id)),
    participants: () => participants
  },

  User: {
    events: (parent) => events.filter((e) => e.user_id === parent.id)
  },

  Event: {
    location: (parent) => locations.find((l) => l.id === parent.location_id),
    user: (parent) => users.find((u) => u.id === parent.user_id),
    participants: (parent) => participants.filter((p) => p.event_id === parent.id)
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})]
})

const port = process.env.PORT || 3000
server.listen(port, () => console.log(`Listening on port ${port}`))
