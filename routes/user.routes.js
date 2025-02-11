import { Router } from 'express';
import {getUsers, getUser, deleteUser, deleteAllUsers} from "../controllers/user.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const userRouter = Router();

// Path: /api/v1/users (GET)
userRouter.get('/', getUsers);

// Path: /api/v1/users/:id (GET)
userRouter.get('/:id', authorize, getUser);

userRouter.post('/', (req, res) =>
  res.send({title: 'CREATE new user'}));

userRouter.put('/:id', (req, res) =>
  res.send({title: 'UPDATE user'}));

// Path: /api/v1/users/:id (Delete)
userRouter.delete('/:id', authorize, deleteUser);

// Path: /api/v1/users/ (Delete)
userRouter.delete('/', deleteAllUsers);


export  {userRouter};