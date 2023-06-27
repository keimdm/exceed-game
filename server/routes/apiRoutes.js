import { Router } from "express";
import models from '../models/index.js';
import { signToken, auth } from "../utils/auth.js";

const router = Router();

// /api/test/
router.get('/test', (req, res) => {
    res.json({ message: "hello from server" });
});

// /api/testAuth/
router.get('/testAuth', auth, (req, res) => {
  res.json({ message: "hello from server with Auth" });
});

// /api/users/
router.get('/users', (req, res) => {
    models.User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
})

// /api/users/:id
router.get('/users/:id', (req, res) => {
    models.User.findOne({ _id: req.params.id })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
})

// /api/users/
router.post('/users/', (req, res) => {
  models.User.create(req.body)
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => res.status(500).json(err));
})

// /api/users/login/
router.post('/users/login/', async (req, res) => {
    try {
      let { email, password } = req.body;
      email = email.toLowerCase();

      const user = await models.User.findOne({ email });

      if (!user) {
        return res.status(400).send("Email not found");
      }
      console.log(user);
      const verified = await user.isCorrectPassword(password);
      console.log(email);
      console.log(password);
      console.log(verified);
      if (!verified) {
        return res.status(400).send("Invalid password");
      }

      const token = signToken(user);
      res.json({ message: `User with name ${user.username} logged in`, token});
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
})

// /api/users/:id
router.put('/users/:id', (req, res) => {
    models.User.findOneAndUpdate({ _id: req.params.id }, { username: req.body.username, email: req.body.email }, { new: true} )
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => res.status(500).json(err));
})

// /api/users/:id
router.delete('/users/:id',  (req, res) => {
    models.User.findOneAndDelete({_id: req.params.id})
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => res.status(500).json(err));
})

export default router;