/* eslint-disable import/no-named-as-default */
/* eslint-disable space-before-function-paren */
/*
@author: Al-Areef
User controller
 */

import authClient from '../utils/auth';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Missing email' });
      return;
    }
    if (!password) {
      res.status(400).json({ error: 'Missing password' });
      return;
    }
    const searchUser = await authClient.findUser({ email });
    if (searchUser) {
      res.status(400).json({ error: 'Already exist' });
      return;
    }
    const newUser = await authClient.addUser(email, password);
    res.status(201).json(newUser);
  }

  static async getMe(req, res) {
    const token = req.headers['x-token'];
    const user = await authClient.FindUserWithToken(token);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  }
}
export default UsersController;
