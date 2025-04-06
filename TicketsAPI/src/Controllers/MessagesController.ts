import express, { Router, Request, Response } from "express";

import authorize from "../Services/AuthorizationService";
import decoded from "../Models/Decoded";
import validators from "../utils/validation";
import functions from "../DB/Functions";
import Message from "../Classes/Message";
import multer from "multer";
import path from "path";
import Attachment from "../Classes/Attachment";

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
// Endpoint: /api/Messages/Get/:TicketID
/**************************************/
router.get("/Get/:ticketID", async (request: Request, response: Response) => {
    let token: any = request.headers.authorization;
    let decoded: decoded = await authorize.verifyToken(token, ['User', 'Agent', 'Admin'], response) as decoded;
    if (decoded != undefined) {
        let ticketID = request.params.ticketID;
        if (validators.checkParams(ticketID)) {
            let messages;

            if (decoded.role == "Admin") {
                messages = await functions.getMessages(`WHERE ticket.ID = ${ticketID}`);
            } else if (decoded.role == "Agent") {
                messages = await functions.getMessages(`WHERE ticket.ID = ${ticketID} AND (ticket.UserID = ${decoded.id} OR ticket.AgentID = ${decoded.id})`);
            } else if (decoded.role == "User") {
                messages = await functions.getMessages(`WHERE ticket.ID = ${ticketID} AND ticket.UserID = ${decoded.id}`);
            }

            response.status(200).json(messages);
        } else {
            response.status(400).json({
                err: "Error In request"
            })
        }
    }
})


/**************************************/
// Endpoint: /api/Messages/Add/:TicketID
/**************************************/
router.post("/Add/:ticketID", upload.array("Attachment", 4), async (request: Request, response: Response) => {
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


        let ticketID = request.params.ticketID;
        const date = new Date();

        const msg = new Message(request.body.Message, parseInt(ticketID), decoded.id, date);

        let isMessageSent = await functions.insert("Messages", msg, ['ID']);

        if (isMessageSent.success) {
            let messageID = isMessageSent.result[0].ID;

            if (request.files != undefined) {
                for (const [key, value] of Object.entries(request.files)) {
                    let attachment: Attachment = new Attachment(value.filename, messageID);

                    await functions.insert("Attachments", attachment, ['ID']);
                }
            }

            let newMessage = await functions.getMessage(messageID);

            response.status(201).json({
                msg: "Message Sent",
                Message: newMessage
            })
        } else {
            response.status(400).json({
                err: "Error in sending"
            })
        }
    }
});


/**************************************/
// Endpoint: /api/Messages/Get/Attachments/:TicketID
/**************************************/
router.get("/Get/Attachments/:TicketID", async (request: Request, response: Response) => {
    let token: any = request.headers.authorization;
    let decoded: decoded = await authorize.verifyToken(token, ['User', 'Agent', 'Admin'], response) as decoded;
    if (decoded != undefined) {
        let ticketID = request.params.TicketID;
        if (validators.checkParams(ticketID)) {
            let attachments = await functions.getAttachments(ticketID);

            response.status(200).json(attachments);
        } else {
            response.status(400).json({
                err: "Error In request"
            })
        }

    }
});

export default router