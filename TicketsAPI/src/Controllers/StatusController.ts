import express, { Express, Request, Response, Router } from "express";

/* Classes */
import Status from "../Classes/Status";

/* Models(Interfaces) */
import StatusInterface from "../Models/Status";

/* Database Functions */
import functions from "../DB/Functions";

/* Validation Functions */
import validators from "../utils/validation";

/* Authroization Functions */
import authorize from "../Services/AuthorizationService";


const router: Router = express.Router();

/**************************************/
// Endpoint: /api/Status/Get
/**************************************/
router.get("/Get", async (request: Request, response: Response) => {
    let status = await functions.selectObjects('Status', ['ID', 'NameEN', 'NameAR']) as Array<StatusInterface>;
    response.status(200).json(status);
});

/**************************************/
// Endpoint: /api/Status/Add
/**************************************/
router.post("/Add", async (request: Request, response: Response) => {
    let token: any = request.headers.authorization;
    let { NameEN, NameAR } = request.body;

    let decoded = await authorize.verifyToken(token, ['Admin'], response);
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

        const status = new Status(NameEN, NameAR);

        let isInserted = await functions.insert("Status", status, ['ID']);
        if (isInserted.success) {
            response.status(201).json({
                msg: "Status Created"
            });
        }
    }
});

/**************************************/
// Endpoint: /api/Status/Update
/**************************************/
router.patch("/Update/:id", async (request: Request, response: Response) => {
    let token: any = request.headers.authorization;
    let id = request.params.id;
    let { NameEN, NameAR } = request.body;

    let decoded = await authorize.verifyToken(token, ['Admin'], response);
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

        const newStatus = new Status(NameEN, NameAR);
        let data = await functions.update("Status", newStatus, id);


        if (data.length == 1) {
            response.status(200).json({
                msg: "Status Updated"
            });
        } else {
            response.status(400).json({
                msg: "Error in updating"
            });
        }
    }
});

/**************************************/
// Endpoint: /api/Status/Delete
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

        let data: any = await functions.delete("Status", id);

        if (data.length == 1) {
            response.status(200).json({
                msg: "Status Deleted"
            });
        } else {
            response.status(400).json({
                msg: "Error in Deleting"
            });
        }
    }
})


export default router;