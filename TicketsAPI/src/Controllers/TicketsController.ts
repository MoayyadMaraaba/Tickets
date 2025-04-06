import express, { Router, Request, Response } from "express";

/* Packages */
import multer from "multer";
import path from "path";

/* Classes */
import Ticket from "../Classes/Ticket";
import Message from "../Classes/Message";
import Attachment from "../Classes/Attachment";

/* Models(Interfaces) */
import TicketInterface from "../Models/Ticket";
import decoded from "../Models/Decoded";

/* Database Functions */
import functions from "../DB/Functions";

/* Validation Functions */
import validators from "../utils/validation";

/* Authroization Functions */
import authorize from "../Services/AuthorizationService";

const router: Router = express.Router();

// Set The Storage Engine
const storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname +
            "-" +
            Date.now() +
            Math.floor(Math.random() * 1000) +
            path.extname(file.originalname)
        );
    },
});

// Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 30000000 },
    fileFilter: function (req, file, cb) {
        return checkFileType(file, cb);
    },
});

// Check File Type
function checkFileType(file: any, cb: any) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif|svg/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb("Error: Images Only!");
    }
}

/**************************************/
// Endpoint: /api/Tickets/Get
/**************************************/
router.get("/Get", async (request: Request, response: Response) => {
    let token: any = request.headers.authorization;
    let data: decoded = await authorize.verifyToken(token, ['User', 'Agent', 'Admin'], response) as decoded;

    if (data != undefined) {
        if (data.role == "Admin") {
            let tickets = await functions.getTickets(' WHERE t.[Closed] = 0');
            response.status(200).json(tickets);

        } else if (data.role == "Agent") {
            let tickets = await functions.getTickets(` WHERE t.[Closed] = 0 AND (UserID = ${data.id} OR AgentID = ${data.id}) `);
            response.status(200).json(tickets);

        } else if (data.role == "User") {
            let tickets = await functions.getTickets(` WHERE t.[Closed] = 0 AND UserID = ${data.id}`);
            response.status(200).json(tickets);

        }
    }
});

/**************************************/
// Endpoint: /api/Tickets/Get/:id
/**************************************/
router.get("/Get/:id", async (request: Request, response: Response) => {
    let token: any = request.headers.authorization;
    let data: decoded = await authorize.verifyToken(token, ['User', 'Agent', 'Admin'], response) as decoded;
    if (data != undefined) {
        let ticketID = request.params.id;

        if (data.role == "Admin") {
            let ticket = await functions.getTicket(`WHERE t.[ID] = ${ticketID}`);
            response.status(200).json(ticket);
        } else if (data.role == "Agent") {
            let ticket = await functions.getTicket(`WHERE t.[ID] = ${ticketID} AND (UserID = ${data.id} OR AgentID = ${data.id}) `);
            response.status(200).json(ticket);
        } else if (data.role == "User") {
            let ticket = await functions.getTicket(`WHERE t.[ID] = ${ticketID} AND UserID = ${data.id}`);
            response.status(200).json(ticket);
        }
    }
});

/**************************************/
// Endpoint: /api/Tickets/Filter
/**************************************/
router.post("/Filter", async (request: Request, response: Response) => {
    let token: any = request.headers.authorization;
    let decoded: decoded = await authorize.verifyToken(token, ['User', 'Agent', 'Admin'], response) as decoded;
    if (decoded != undefined) {
        let searchQuery = request.body.searchQuery;
        let type = request.body.Type;
        let status = request.body.Status;
        let priority = request.body.Priority;
        let date = request.body.Date;
        let Closed = request.body.Closed;

        let fiString = "";

        if(Closed != 0 && Closed != 1) {
            Closed = 0;
        }


        if (decoded.role == "Admin") {
            fiString += ` WHERE t.[Closed] = ${Closed} AND `;
        } else if (decoded.role == "Agent") {
            fiString += ` WHERE t.[Closed] = ${Closed} AND UserID = ${decoded.id} OR AgentID = ${decoded.id} AND `;
        } else if (decoded.role == "User") {
            fiString += ` WHERE t.[Closed] = ${Closed} AND UserID = ${decoded.id} AND `;
        }


        if (searchQuery != undefined) {
            fiString += `t.Subject Like '%${searchQuery}%'`;
        } else {
            fiString += `t.Subject Like '%%'`;
        }

        if (type != undefined) {
            fiString += ` AND t.Type = ${type}`;
        }

        if (status != undefined) {
            fiString += ` AND t.Status = ${status}`;
        }

        if (priority != undefined && priority != '') {
            fiString += ` AND t.Priority = '${priority}'`;
        }


        if (date != '' && (date == "Newest" || date == "Oldest")) {
            if (date == "Newest") {
                fiString += ` ORDER BY t.Date DESC`;
            } else {
                fiString += ` ORDER BY t.Date ASC`;
            }
        }

        let tickets = await functions.getTickets(fiString);

        response.status(200).json(tickets);
    }
})

/**************************************/
// Endpoint: /api/Tickets/Create
/**************************************/
router.post("/Create", upload.array("Attachment", 4), async (request: Request, response: Response) => {
    let token: any = request.headers.authorization;

    let decoded: decoded = await authorize.verifyToken(token, ['User', 'Agent', 'Admin'], response) as decoded;

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

        let message = request.body.message;
        delete request.body.message;

        const date = new Date();

        request.body.UserID = decoded.id;
        request.body.Date = date;

        let ticket = request.body as Ticket;

        let isAdded = await functions.insert("Tickets", ticket, ['ID']);

        if (isAdded.success) {
            let ticketID = isAdded.result[0].ID;

            const msg = new Message(message, ticketID, decoded.id, date);

            let isTicketCreated = await functions.insert("Messages", msg, ['ID']);

            let messageID = isTicketCreated.result[0].ID;


            if (request.files != undefined) {
                for (const [key, value] of Object.entries(request.files)) {
                    let attachment: Attachment = new Attachment(value.filename, messageID);

                    await functions.insert("Attachments", attachment, ['ID']);
                }
            }


            if (isTicketCreated.success) {
                response.status(201).json({
                    msg: "Ticket Created"
                });
            }
        }
    }
});

/**************************************/
// Endpoint: /api/Tickets/Assign
/**************************************/
router.patch("/Assign", async (request: Request, response: Response) => {
    let token: any = request.headers.authorization;
    let decoded = await authorize.verifyToken(token, ['Agent', 'Admin'], response);

    if (decoded != undefined) {

        for (const [key, value] of Object.entries(request.body)) {
            if (validators.emptyStrings(String(value))) {
                response.status(400).json({
                    err: `${key} value is Required`
                });
                return;
            }
        }

        let TicketID = request.body.TicketID;
        let AgentID = request.body.AgentID;

        let data = await functions.update("Tickets", { AgentID: AgentID }, TicketID);

        if (data.length == 1) {
            response.status(200).json({
                msg: "Ticket Assigned"
            });
        } else {
            response.status(400).json({
                msg: "Error in updating"
            });
        }
    }
});

/**************************************/
// Endpoint: /api/Tickets/Update
/**************************************/
router.patch("/Update", async (request: Request, response: Response) => {
    let token: any = request.headers.authorization;
    let decoded = await authorize.verifyToken(token, ['Agent', 'Admin'], response);

    if (decoded != undefined) {
        for (const [key, value] of Object.entries(request.body)) {
            if (validators.emptyStrings(String(value))) {
                response.status(400).json({
                    err: `${key} value is Required`
                });
                return;
            }
        }

        let type = request.body.type;
        if (type == "Type") {
            let typeID = request.body.typeID;
            let TicketID = request.body.TicketID;
            let isUpdated = await functions.update("Tickets", { Type: typeID }, TicketID);

            if (isUpdated.length == 1) {
                response.status(200).json({
                    msg: "Ticket Type is updated"
                });
            } else {
                response.status(400).json({
                    msg: "Error in updating"
                });
            }
        } else if (type == "Status") {
            let statusID = request.body.statusID;
            let TicketID = request.body.TicketID;
            let isUpdated = await functions.update("Tickets", { Status: statusID }, TicketID);

            if (isUpdated.length == 1) {
                response.status(200).json({
                    msg: "Ticket Status is updated"
                });
            } else {
                response.status(400).json({
                    msg: "Error in updating"
                });
            }
        } else if (type == "Priority") {
            let priority = request.body.Priority;
            let TicketID = request.body.TicketID;


            if (priority != 'Low' && priority != 'Normal' && priority != 'High') {
                priority = 'Low';
            }


            let isUpdated = await functions.update("Tickets", { Priority: priority }, TicketID);

            if (isUpdated.length == 1) {
                response.status(200).json({
                    msg: "Ticket Priority is updated"
                });
            } else {
                response.status(400).json({
                    msg: "Error in updating"
                });
            }
        }
    }
});

/**************************************/
// Endpoint: /api/Tickets/Close
/**************************************/
router.patch("/Close", async(request: Request, response: Response) => {
    let token:any = request.headers.authorization;
    let decoded = await authorize.verifyToken(token, ['Agent', 'Admin'], response);
    if(decoded != undefined) {
        let ticketID = request.body.ticketID;
        let closed = request.body.Closed;

        let isUpdated = await functions.update("Tickets", { Closed: !closed }, ticketID);

        if (isUpdated.length == 1) {
            response.status(200).json({
                msg: "Ticket is updated"
            });
        } else {
            response.status(400).json({
                msg: "Error in updating"
            });
        }
    }
});

export default router;