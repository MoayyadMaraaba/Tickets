import knex from "knex";
import dotenv from "dotenv";

dotenv.config();

const db = knex({
    client: "mssql",
    connection: {
        server: process.env.Server_Name,
        user: process.env.user,
        password: process.env.password, 
        database: process.env.Database,
    },
});

export default db;