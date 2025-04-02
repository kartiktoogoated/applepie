// import { ApolloServer, gql } from "apollo-server-express";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// const typeDefs = gql`
//   type User {
//     id: String
//     email: String
//   }

//   type Query {
//     users: [User]
//   }
// `;

// const resolvers = {
//   Query: {
//     users: async () => await prisma.user.findMany(),
//   },
// };

// const server = new ApolloServer({ typeDefs, resolvers });
// await server.start();
// server.applyMiddleware({ app });
