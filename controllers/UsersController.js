/* eslint-disable import/no-named-as-default */
/* eslint-disable space-before-function-paren */
/*
@author: Al-Areef
User controller
 */

import dbClient from '../utils/db';

class UsersController {
  static async PostNewUser(req, res) {
    const { email, password } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Missing email' });
      return;
    }
    if (!password) {
      res.status(400).json({ error: 'Missing password' });
      return;
    }
    const searchUser = await dbClient.findUser({ email });
    if (searchUser) {
      res.status(400).json({ error: 'Already exist' });
      return;
    }
    const newUser = await dbClient.addUser(email, password);
    res.status(201).json(newUser);
  }
}
export default UsersController;
