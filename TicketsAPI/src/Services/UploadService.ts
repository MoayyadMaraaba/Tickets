import multer from "multer";
import path from "path";
import express, { Router, Request, Response } from "express";
import authorize from "./AuthorizationService";

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
    limits: { fileSize: 30000 },
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

router.post("/:type/:fieldName", async (request: Request, response: Response) => {
    let token: any = request.headers.authorization;
    let decoded = await authorize.verifyToken(token, ['User', 'Agent', 'Admin'], response);
    if (decoded != undefined) {
        let type = request.params.type;
        let fieldName = request.params.fieldName;
        
        if (type == "single") {
            let handleFile = upload.single(fieldName);
            handleFile(request, response, function (err) {
                if (err) {
                    response.status(400).json({
                        err: "Error Uploading File"
                    })
                }
                console.log(request.file?.filename);
            });
        } else if (type == "multiple") {

        }
    }
});

export default router;
