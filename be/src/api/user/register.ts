import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import zxcvbn from "zxcvbn";

import responsePacking from "../../utils/responsePacking";
import { DBAccessToken, DBUser } from "../../utils/database";
import { SECRET_KEY } from "../../utils/env";


const register = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    let user;

    // Check type to prevent crash
    if (typeof username !== "string" || typeof password !== "string") {
        return next({
            statusCode: 400,
            message: "Bad request",
        });
    }

    // Validate username
    if (username.length < 3 || username.length > 20) {
        return responsePacking(res, {
            statusCode: 400,
            message: "error",
            data: {
                "username": "Tên đăng nhập buộc phải có độ dài từ 3 đến 20 kí tự",
            },
        });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return responsePacking(res, {
            statusCode: 400,
            message: "error",
            data: {
                "username": "Tên đăng nhập chỉ có thể chứa  A-Z, a-z, 0-9, và _",
            },
        });
    }

    // Validate password
    let pwdTest = zxcvbn(password, [username]);
    if (pwdTest.guesses < 3) {
        return responsePacking(res, {
            statusCode: 400,
            message: "error",
            data: {
                // TODO: FORGOT TO CHANGE TO VIETNAMESE
                "password": "Mật khẩu yếu",
                "additional": pwdTest.feedback.warning,
            },
        })
    }

    // Check if user existed
    try {
        user = await DBUser.findOne({ username: username });

        if (user) {
            return responsePacking(res, {
                statusCode: 400,
                message: "error",
                data: { "username": "Tài khoản đã tồn tại!" },
            });
        }

        // Prepare user data
        let UUID = crypto.randomUUID();
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        DBUser.insertOne({
            UUID: UUID,
            username: username,
            name: username,
            password: hashedPassword,
        });

        // Login user
        const accessToken = jwt.sign({ UUID: UUID }, SECRET_KEY, { expiresIn: "3d" });

        DBAccessToken.insertOne({
            UUID: UUID,
            token: accessToken,
            createdAt: Date.now(),
            expiredAt: Date.now() + 3 * 24 * 60 * 60 * 1000,
        })

        // Send success response
        responsePacking(res, {
            data: {
                name: username,
                ac_to: accessToken,
            },
        });
    } catch (err) {
        return next({
            statusCode: 500,
            message: "Internal server error",
        });
    }
}


export default register;