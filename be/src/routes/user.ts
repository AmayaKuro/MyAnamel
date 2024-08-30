import express from "express";

import login from "../api/user/login";
import register from "../api/user/register";

const userRouter = express.Router();

userRouter.post("/login", login);
userRouter.post("/register", register);

export default userRouter;