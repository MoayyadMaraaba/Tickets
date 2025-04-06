import express, { Router, Request, Response } from "express";

/* Packages */
import bcrypt from "bcryptjs";

/* Classes */
import User from "../Classes/User";

/* Database Functions */
import functions from "../DB/Functions";

/* Models(Interfaces) */
import decoded from "../Models/Decoded";

/* Validation Functions */
import validators from "../utils/validation";

/* Authroization Functions */
import authorize from "../Services/AuthorizationService"
import email from "../Services/EmailService";


import dotenv from "dotenv";

dotenv.config();

const router: Router = express.Router();

/**************************************/
// Endpoint: /api/Agents/Get
/**************************************/
router.get("/Get", async (request: Request, response: Response) => {
    let token: any = request.headers.authorization;
    let decoded: decoded = await authorize.verifyToken(token, ['Agent', 'Admin'], response) as decoded;
    if (decoded != undefined) {
        let agents = await functions.select("Users", 'id, FullName, Email, PhoneNumber, Activation, Role', "WHERE Role = 'Agent' OR Role = 'Admin'");
        response.status(200).json(agents);
    }
});

/**************************************/
// Endpoint: /api/Agents/Add
/**************************************/
router.post("/Add", async (request: Request, response: Response) => {
    let token: any = request.headers.authorization;
    let decoded: decoded = await authorize.verifyToken(token, ['Admin'], response) as decoded;
    if (decoded != undefined) {
        let { FullName, Email, Password, PhoneNumber, Activation, Role } = request.body;
        // Verify data 
        for (const [key, value] of Object.entries(request.body)) {
            if (validators.emptyStrings(String(value))) {
                response.status(400).json({
                    err: `${key} value is Required`
                });
                return;
            }
        }

        // Check if Email is already exists
        let isEmailExists: boolean = await functions.isExists("Users", "Email", Email);
        if (isEmailExists) {
            response.status(400).json({
                err: "Email already exists"
            });
            return;
        }

        // Check if Phone number is already exists
        let isPhoneNumberExists: boolean = await functions.isExists("Users", "PhoneNumber", PhoneNumber);
        if (isPhoneNumberExists) {
            response.status(400).json({
                err: "Number already exists"
            });
            return;
        }

        let act = 0;
        if (Activation == true) {
            act = 1;
        }

        if (Role != "Admin" || Role != "Agent") {
            Role = "Agent";
        }

        let hashed = await bcrypt.hash(Password, 8);

        const user = new User(FullName, Email, hashed, PhoneNumber, Role, act);

        let isInserted = await functions.insert("Users", user, ['ID']);

        // Send Email to activate agnet
        // email.send(Email, "New Agent", `<h1><a href="${process.env.url}/en/Agent/Configure">Setup your account</a></h1>`);

        if (isInserted.success) {
            response.status(201).json({
                msg: "Agent Created"
            });
        }
    }
});


/**************************************/
// Endpoint: /api/Agents/Update
/**************************************/
router.patch("/Update", async (request: Request, response: Response) => {
    let token: any = request.headers.authorization;
    let decoded: decoded = await authorize.verifyToken(token, ['Admin'], response) as decoded;
    if (decoded != undefined) {

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
                    err: "Number already exists"
                });
                return;
            }
        }

        let act = 0;

        if (request.body.Activation != undefined) {
            if (request.body.Activation == true) {
                act = 1;
            }
        }

        let Role;
        if (request.body.Role != undefined) {
            Role = request.body.Role
            if (Role != "Admin" || Role != "Agent") {
                Role = "Agent";
            }
        }
        
        let body = request.body;
        let userId = request.body.id;
        delete body.id;

        let hashed;

        if (request.body.Password != undefined) {
            hashed = await bcrypt.hash(request.body.Password, 8);
            body.Password = hashed;
        }


        let data = await functions.update("Users", body, String(userId));

        if (data.length == 1) {
            response.status(200).json({
                msg: "Agent Updated"
            });
        } else {
            response.status(400).json({
                err: "Error in updating"
            });
        }

    }
});

/**************************************/
// Endpoint: /api/Agents/Deactivate
/**************************************/
router.patch("/Deactivate", async (request: Request, response: Response) => {
    let token: any = request.headers.authorization;
    let decoded: decoded = await authorize.verifyToken(token, ['Admin'], response) as decoded;
    if (decoded != undefined) {
        let Activation = 0;
        if (request.body.Activation) {
            Activation = 0;
        } else {
            Activation = 1;
        }

        console.log(Activation);

        let data = await functions.update("Users", { Activation: Activation }, String(request.body.id));

        if (data.length == 1) {
            response.status(200).json({
                msg: "Agent Updated"
            });
        } else {
            response.status(400).json({
                err: "Error in updating"
            });
        }
    }
})

export default router;