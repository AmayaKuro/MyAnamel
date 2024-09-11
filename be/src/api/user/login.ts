import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import responsePacking from "../../utils/responsePacking";
import { DBAccessToken, DBUser } from "../../utils/database";
import { SECRET_KEY } from "../../utils/env";


const login = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    if ((typeof username !== "string") || (typeof password !== "string") || username.length < 1 || password.length < 1) {
        return next({
            statusCode: 400,
            message: "Bad request",
        });
    }
    const user = await DBUser.findOne({ username: username });

    if (!user) {
        return responsePacking(res, {
            statusCode: 400,
            message: "error",
            data: { "username": "Tài khoản không tồn tại!" },
        });
    }

    // TODO: should this be async?
    if (!await bcrypt.compare(password, user.password)) {
        return responsePacking(res, {
            statusCode: 400,
            message: "error",
            // TODO: should error helper messages be in data or message?
            data: { "password": "Mật khẩu sai!" },
        });
    }

    // This jwt is optional, but need for CV lmao (also decoding jwt takes resources)
    const accessToken = jwt.sign({ UUID: user.UUID }, SECRET_KEY, { expiresIn: "3d" });

    DBAccessToken.insertOne({
        UUID: user.UUID,
        token: accessToken,
        createdAt: Date.now(),
        expiredAt: Date.now() + 3 * 24 * 60 * 60 * 1000,
    });

    // Send success response
    responsePacking(res, {
        data: {
            name: user.name,
            ac_to: accessToken,
        },
    });
}


export default login;