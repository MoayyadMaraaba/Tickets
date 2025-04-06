import express, { Express, Request, Response } from "express";

import AuthenticationController from "./Controllers/AuthenticationController";
import TicketsController from "./Controllers/TicketsController";
import StatusController from "./Controllers/StatusController";
import TypesController from "./Controllers/TypesController";
import MessagesController from "./Controllers/MessagesController";
import UsersController from "./Controllers/UsersController";
import AgentsController from "./Controllers/AgentsController";
import db from "./DB/Connect";

import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";

dotenv.config();

const app: Express = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static("public"));

app.get("/", (req, res) => res.sendFile(__dirname + "/public/index.html"));

app.use("/api/Authentication", AuthenticationController);
app.use("/api/Tickets", TicketsController);
app.use("/api/Status", StatusController);
app.use("/api/Types", TypesController);
app.use("/api/Messages", MessagesController);
app.use("/api/Users", UsersController);
app.use("/api/Agents", AgentsController);

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Creating Tables
db.schema.hasTable("Status").then(function (exists) {
  if (!exists) {
    db.schema.createTable("Status", (table) => {
      table.increments('ID');
      table.string('NameAR', 50).notNullable();
      table.string('NameEN', 50).notNullable();
    }).then(() => {
      console.log('Status Table Creating --> Done');
    }).catch((error) => {
      console.error('Error Creating table:', error);
    })
  }
});

db.schema.hasTable('Type').then(function (exists) {
  if (!exists) {
    db.schema.createTable("Type", (table) => {
      table.increments('ID');
      table.string('NameAR', 50).notNullable();
      table.string('NameEN', 50).notNullable();
    }).then(() => {
      console.log('Type Table Creating --> Done');
    }).catch((error) => {
      console.error('Error Creating table:', error);
    })
  }
});

db.schema.hasTable('Users').then(function (exists) {
  if (!exists) {
    db.schema.createTable("Users", (table) => {
      table.increments('id');
      table.string('FullName', 50).notNullable();
      table.string('Email', 50).notNullable();
      table.string('Password', 4000).notNullable();
      table.boolean('Activation').defaultTo(false);
      table.string('Role', 50).notNullable();
      table.string("PhoneNumber", 50).notNullable();
    }).then(async () => {
      console.log('Users Table Creating --> Done');

      let Password = "Yom@1234";
      let hashed = await bcrypt.hash(Password, 8);
      await db("Users").insert({FullName: "Admin", Email: "Admin", Password: hashed, Phonenumber: "", Role: "Admin", Activation: 1});

    }).catch((error) => {
      console.error('Error Creating table:', error);
    })
  }
});

db.schema.hasTable("Tickets").then(function (exists) {
  if (!exists) {
    db.schema.createTable("Tickets", (table) => {
      table.increments('ID');
      table.string("Subject", 50).notNullable();
      table.integer("UserID").notNullable();
      table.integer("Status").notNullable();
      table.integer("Type").notNullable();
      table.integer("AgentID");
      table.string("Priority", 50).notNullable();
      table.boolean("Closed").defaultTo(false);
      table.date("Date").notNullable();
    }).then(() => {
      console.log('Tickets Table Creating --> Done');
    }).catch((error) => {
      console.error('Error Creating table:', error);
    })
  }
});

db.schema.hasTable("Messages").then(function (exists) {
  if (!exists) {
    db.schema.createTable("Messages", (table) => {
      table.increments('ID');
      table.string("Message", 4000).notNullable();
      table.integer("TicketID").notNullable();
      table.integer("UserID").notNullable();
      table.datetime("Date").notNullable();
    }).then(() => {
      console.log('Messages Table Creating --> Done');
    }).catch((error) => {
      console.error('Error Creating table:', error);
    })
  }
});

db.schema.hasTable("Attachments").then(function (exists) {
  if (!exists) {
    db.schema.createTable("Attachments", (table) => {
      table.increments('ID');
      table.string("DocumentName", 4000).notNullable();
      table.integer("MessageID").notNullable();
    }).then(() => {
      console.log('Attachments Table Creating --> Done');
    }).catch((error) => {
      console.error('Error Creating table:', error);
    })
  }
});

const port: any = process.env.PORT || 4040;

if (process.env.mode == "development") {
  app.listen(port, "192.168.1.109", () => {
    console.log(`[server]: Server is running.`);
  });
} else {
  app.listen(port, () => {                                                           
    console.log(`[server]: Server is running.`);
  });
}


