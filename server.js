#!/usr/bin/node

/*
Handles All express connections
 */
import MapRoutes from './routes';

const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

MapRoutes(app);
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

module.exports = app;
