#!/usr/bin/node

/*
Handles All express connections
 */
import express from 'express';
import MapRoutes from './routes';

const app = express();
const port = process.env.PORT || 5000;

MapRoutes(app);
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

export default app;
