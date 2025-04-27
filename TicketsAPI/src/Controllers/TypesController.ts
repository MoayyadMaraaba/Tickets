import express, { Express, Request, Response, Router } from "express";

/* Database Functions */
import functions from "../DB/Functions";

/* Models(Interfaces) */
import TypeInterface from "../Models/Type";

import authorize from "../Services/AuthorizationService";
import Type from "../Classes/Type";
import validators from "../utils/validation";

const router: Router = express.Router();

/**************************************/
// Endpoint: /api/Types/Get
/**************************************/
router.get("/Get", async (request: Request, response: Response) => {
    let types = await functions.selectObjects('Type', ['ID', 'NameEN', 'NameAR']) as Array<TypeInterface>;
    response.status(200).json(types);
});

/**************************************/
// Endpoint: /api/Types/Add
/**************************************/
router.post("/Add", async (request: Request, response: Response) => {
    let token: any = request.headers.authorization;
    let decoded = await authorize.verifyToken(token, ['Admin'], response);
    let { NameEN, NameAR } = request.body;
    
    if (decoded != undefined) {
        // Verify data 
        for (const [key, value] of Object.entries(request.body)) {
            if (validators.emptyStrings(String(value))) {
                response.status(400).json({
                    err: `${key} value is Required`
                });
                return;
            }
        }

        const type = new Type(NameEN, NameAR);

        let isInserted = await functions.insert("Type", type, ['ID']);
        if (isInserted.success) {
            response.status(201).json({
                msg: "Type Created"
            });
        }
    }
});

/**************************************/
// Endpoint: /api/Types/Update
/**************************************/
router.patch("/Update/:id", async (request: Request, response: Response) => {
    let token: any = request.headers.authorization;
    let id = request.params.id;
    let decoded = await authorize.verifyToken(token, ['Admin'], response);
    let { NameEN, NameAR } = request.body;

    if (decoded != undefined) {
        if (validators.emptyStrings(id)) {
            response.status(400).json({
                err: 'id value is Required'
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

        const newType = new Type(NameEN, NameAR);
        let data = await functions.update("Type", newType, id);


        if (data.length == 1) {
            response.status(200).json({
                msg: "Type Updated"
            });
        } else {
            response.status(400).json({
                msg: "Error in updating"
            });
        }
    }

});

/**************************************/
// Endpoint: /api/Types/Delete
/**************************************/
router.delete("/Delete/:id", async (request: Request, response: Response) => {
    let token: any = request.headers.authorization;
    let id = request.params.id;
    let decoded = await authorize.verifyToken(token, ['Admin'], response);
    if (decoded != undefined) {
        if (validators.emptyStrings(id)) {
            response.status(400).json({
                err: 'id value is Required'
            });
            return;
        }

        let data: any = await functions.delete("Type", id);

        if (data.length == 1) {
            response.status(200).json({
                msg: "Type Deleted"
            });
        } else {
            response.status(400).json({
                msg: "Error in Deleting"
            });
        }
    }
});

export default router;