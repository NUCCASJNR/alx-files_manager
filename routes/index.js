#!/usr/bin/node

/*
Handles All API routes
 */

import AppController from '../controllers/AppController';

const MapRoutes = (app) => {
  app.get('/status', AppController.getStatus);
  app.get('/stats', AppController.getStats);
};

export default MapRoutes;
