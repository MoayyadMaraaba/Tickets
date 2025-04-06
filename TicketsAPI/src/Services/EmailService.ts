import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "",
    port: 25,
    auth: {
        user: "",
        pass: "",
    },
});



let email = {
    send: function (to: string, subject: string, html: string) {

        transporter.verify(function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log("Server is ready");
            }
        });

        const mailOptions = {
            from: "",
            to: to,
            subject: subject,
            html: html
        };

        const info = transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
        });
    }
}

export default email;
