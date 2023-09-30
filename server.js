#!/usr/bin/node

/*
Handles All express connections
 */
import MapRoutes from './routes';

import express from 'express';

const app = express();
const port = process.env.PORT || 5000;

MapRoutes(app);
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

module.exports = app;
