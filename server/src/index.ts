import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import bodyParser from 'body-parser';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';
import { initDatabase } from './database/connection';

async function startServer() {
  const app = express();
  const port = process.env.PORT || 4000;

  // Initialize database
  await initDatabase();
  console.log('✅ Database initialized');

  // Create Apollo Server instance
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // Start Apollo Server
  await server.start();
  console.log('✅ Apollo Server started');

  // Apply middleware
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({
        token: req.headers.authorization || '',
      }),
    })
  );

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // Start Express server
  app.listen(port, () => {
    console.log('🚀 GraphQL Server is running!');
    console.log(`📍 GraphQL endpoint: http://localhost:${port}/graphql`);
    console.log(`🏥 Health check: http://localhost:${port}/health`);
  });
}

// Start the server
startServer().catch((error) => {
  console.error('❌ Error starting server:', error);
  process.exit(1);
});
