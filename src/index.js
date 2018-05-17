const { GraphQLServer } = require("graphql-yoga");
const { Prisma } = require("prisma-binding");

const resolvers = {
  Query: {
    posts: (_, args, context, info) => {
      return context.prisma.query.posts(
        {
          where: {
            OR: [
              { title_contains: args.searchString },
              { content_contains: args.searchString }
            ]
          }
        },
        info
      );
    },
    user: (_, args, context, info) => {
      return context.prisma.query.user(
        {
          where: {
            id: args.id
          }
        },
        info
      );
    }
  }
};

const server = new GraphQLServer({
  typeDefs: "src/schema.graphql",
  resolvers,
  context: req => ({
    ...req,
    prisma: new Prisma({
      typeDefs: "src/generated/prisma.graphql",
      endpoint: "https://eu1.prisma.sh/makar-7af142/my-blog/dev"
    })
  })
});

server.start(() =>
  console.log(`GraphQL server is running on http://localhost:4000`)
);
