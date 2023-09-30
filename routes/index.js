#!/usr/bin/node

/*
Handles All API routes
 */

import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';

const MapRoutes = (app) => {
  app.get('/status', AppController.getStatus);
  app.get('/stats', AppController.getStats);
  app.post('/users', UsersController.PostNewUser);
};

export default MapRoutes;
