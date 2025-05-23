import express from "express";
import {
  getUser,
  createUser,
  editUser,
  deleteUser,
} from "../controllers/userController.js";

const userRouter = express.Router();
userRouter.route("/").get(getUser).post(createUser);
userRouter.route("/:id").put(editUser).delete(deleteUser);

export default userRouter;
