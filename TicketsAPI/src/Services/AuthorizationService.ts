import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import express, { Router, Request, Response } from "express";

dotenv.config();

let authorize = {
    generateToken: function (payload: object, Role: string): string {
        let secret: string = "";

        if (Role == "Admin") {
            secret = String(process.env.secretAdmin);
        } else if (Role == "Agent") {
            secret = String(process.env.secretAgent);
        } else if (Role == "User") {
            secret = String(process.env.secretUser);
        }

        let token = jwt.sign(payload, secret, { expiresIn: "8H" });

        return token;
    },
    verifyToken: async function (token: string, Roles: Array<string>, response: Response) {
        let secret = [];
        if (!Roles.includes("Visitor")) {

            for (let i = 0; i < Roles.length; i++) {
                if (Roles[i] == "Admin") {
                    secret.push(String(process.env.secretAdmin));
                } else if (Roles[i] == "Agent") {
                    secret.push(String(process.env.secretAgent));
                } else if (Roles[i] == "User") {
                    secret.push(String(process.env.secretUser));
                }
            }

            let decoded;
            for (let i = 0; i < secret.length; i++) {
                try {
                    decoded = await jwt.verify(token, secret[i]);
                    break;
                } catch (err) {
                }
            }

            if (decoded != undefined) {
                return decoded;
            } else {
                response.status(401).json({
                    err: "Unauthorized Access"
                })
            }
        } else {
            return true;
        }

    }
}

// function isAuthenticated(token: string): boolean {
//     let secret: any = process.env.secret;

//     let decoded = jwt.verify(token, secret);

//     console.log(decoded);

//     return false;
// }

// function isAuthorized() {
//     let isLoggedIn = isAuthenticated("Token_Here");
//     if (isLoggedIn) {
//         console.log("Give user a role");
//     } else {

//     }
// }

export default authorize;
