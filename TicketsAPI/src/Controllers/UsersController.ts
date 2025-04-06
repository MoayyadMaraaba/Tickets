import decoded from "../Models/Decoded";
import express, { Router, Request, Response } from "express";
import authorize from "../Services/AuthorizationService";
import functions from "../DB/Functions";

import bcrypt from "bcryptjs";

const router: Router = express.Router();

router.get("/Get", async (request: Request, response: Response) => {
    let token: any = request.headers.authorization;
    let decoded: decoded = await authorize.verifyToken(token, ['User', 'Agent', 'Admin'], response) as decoded;
    if (decoded != undefined) {
        response.status(200).json({ ID: decoded.id });
    }
});

router.get("/Get/Info", async (requrest: Request, response: Response) => {
    let token: any = requrest.headers.authorization;
    let decoded: decoded = await authorize.verifyToken(token, ['User', 'Agent', 'Admin'], response) as decoded;
    if (decoded != undefined) {
        let data = await functions.selectColumns("Users", ['Email', 'FullName', 'PhoneNumber'], 'ID', decoded.id);
        response.status(200).json(data);
    }
});

router.patch("/Update", async (request: Request, response: Response) => {
    let token: any = request.headers.authorization;
    let decoded: decoded = await authorize.verifyToken(token, ['User', 'Agent', 'Admin'], response) as decoded;
    if (decoded != undefined) {
        let body = request.body;
        
        if (request.body.Email != undefined) {
            // Check if Email is already exists
            let isEmailExists: boolean = await functions.isExists("Users", "Email", request.body.Email);
            if (isEmailExists) {
                response.status(400).json({
                    err: "Email already exists"
                });
                return;
            }
        }

        if (request.body.PhoneNumber != undefined) {
            // Check if Phone number is already exists
            let isPhoneNumberExists: boolean = await functions.isExists("Users", "PhoneNumber", request.body.PhoneNumber);
            if (isPhoneNumberExists) {
                response.status(400).json({
                    err: "Phone already exists"
                });
                return;
            }
        }

        let data = await functions.update("Users", body, String(decoded.id));

        if (data.length == 1) {
            response.status(200).json({
                msg: "User Updated"
            });
        } else {
            response.status(400).json({
                err: "Error in updating"
            });
        }
    }
});

router.patch("/Update/Password", async (request: Request, response: Response) => {
    let token: any = request.headers.authorization;
    let decoded: decoded = await authorize.verifyToken(token, ['User', 'Agent', 'Admin'], response) as decoded;
    if (decoded != undefined) {
        let CurrentPassword = request.body.CurrentPassword;
        let data: any = await functions.selectColumns("Users", ['Password'], 'ID', decoded.id);
        let isMatched = await bcrypt.compare(CurrentPassword, data.Password);
        if (isMatched) {
            let hashed = await bcrypt.hash(request.body.NewPassword, 8);

            let isUpdated = await functions.update("Users", { Password: hashed }, String(decoded.id));
            if (isUpdated.length == 1) {
                response.status(200).json({
                    msg: "Password Updated"
                })
            } else {
                response.status(400).json({
                    msg: "Error in updating"
                });
            }
        } else {
            response.status(400).json({
                msg: "Wrong Password"
            })
        }
    }
})

export default router;
