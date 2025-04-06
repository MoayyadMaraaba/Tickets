import express, { Router, Request, Response } from "express";

/* Packages */
import bcrypt from "bcryptjs";

/* Classes */
import User from "../Classes/User";

/* Models(Interfaces) */
import UserInterface from "../Models/User";
import decoded from "../Models/Decoded";

/* Database Functions */
import functions from "../DB/Functions";

/* Validation Functions */
import validators from "../utils/validation";

/* Authroization Functions */
import authorize from "../Services/AuthorizationService"

const router: Router = express.Router();

/**************************************/
// Endpoint: /api/Authentication/Register
/**************************************/
router.post("/Register", async (request: Request, response: Response) => {

    // Data from front-end
    let { FullName, Email, password, phonenumber } = request.body;

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
    let isPhoneNumberExists: boolean = await functions.isExists("Users", "PhoneNumber", phonenumber);
    if (isPhoneNumberExists) {
        response.status(400).json({
            err: "Number already exists"
        });
        return;
    }

    // Encrypt password
    let hashed = await bcrypt.hash(password, 8);

    // Create User and save it to database
    const user = new User(FullName, Email, hashed, phonenumber, "User", 1);


    let isInserted = await functions.insert("Users", user, ['ID']);
    if (isInserted.success) {
        response.status(201).json({
            msg: "User Created"
        });
    }
});


/**************************************/
// Endpoint: /api/Authentication/Login
/**************************************/
router.post("/Login", async (request: Request, response: Response) => {
    let { Email, Password } = request.body;
    
    if (Email == undefined || Password == undefined) {
        response.status(400).json({
            err: 'Wrong Data'
        });
        return;
    }

    // Verify data 
    for (const [key, value] of Object.entries(request.body)) {
        if (validators.emptyStrings(String(value))) {
            response.status(400).json({
                err: `${key} value is Required`
            });
            return;
        }
    }

    let isEmailExists: boolean = await functions.isExists("Users", "Email", Email);
    if (isEmailExists) {
        let user = await functions.selectColumns('Users', ['id', 'Password', 'Activation', 'Role'], 'Email', Email) as UserInterface;
        let isMatched = await bcrypt.compare(Password, user.Password);
        if (isMatched) {
            if (user.Activation == 1) {
                let token = authorize.generateToken({ id: user.id, role: user.Role }, user.Role);
                
                response.status(200).json({
                    role: user.Role,
                    msg: `${user.Role} Logged In`,
                    token
                });
            } else {
                response.status(400).json({
                    err: "User is not activated"
                })
            }
        } else {
            response.status(400).json({
                err: "Password is Wrong"
            })
        }
    } else {
        response.status(400).json({
            err: "No Email Found"
        })
    }
});

/**************************************/
// Endpoint: /api/Authentication/Verify
/**************************************/
router.get("/Verify", async(request: Request, response: Response) => {
    let token:any = request.headers.authorization;
    let decoded: decoded = await authorize.verifyToken(token, ['User', 'Agent', 'Admin'], response) as decoded;
    if(decoded != undefined) {
        response.status(200).json({
            msg: "Everything is Good"
        }) 
    } 
});


export default router;