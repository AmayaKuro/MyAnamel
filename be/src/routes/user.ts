import express from "express";

import login from "../api/user/login";
import register from "../api/user/register";
import refresh from "../api/user/refreshToken";
import logout from "../api/user/logout";

import authorize from "../middlewares/authorize";

const userRouter = express.Router();

userRouter.post("/login", login);
userRouter.post("/register", register);
userRouter.post("/refresh", authorize, refresh);
userRouter.post("/logout", authorize, logout);

export default userRouter;