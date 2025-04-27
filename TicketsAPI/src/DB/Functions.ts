import db from "../DB/Connect";

interface result {
    success: boolean;
    result: Array<any>
}

let functions = {
    isExists: async function (tableName: string, columnName: string, value: string): Promise<boolean> {
        let result = await db(tableName).where(`${columnName}`, value).count(columnName, { as: 'count' });

        if (result[0].count == 0) {
            return false;
        } else {
            return true;
        }
    },
    insert: async function (tableName: string, value: Object, returning: Array<string>): Promise<result> {
        let r = await db(tableName).insert(value).returning(returning);

        if (r.length == 1) {
            let data = { success: true, result: r } as result;
            return data;
        } else {
            let failed = { success: false, result: [] } as result;
            return failed;
        }
    },
    selectColumns: async function (tableName: string, columns: Array<string>, columnName: string, value: any): Promise<Object> {
        let data = await db(tableName).column(columns).where(`${columnName}`, value);

        return data[0];
    },
    selectObjects: async function (tableName: string, columns: Array<string>): Promise<Object> {
        let data = await db(tableName).column(columns);

        return data;
    },
    select: async function (tableName: string, columns: string, where: string): Promise<Object> {
        let data = await db.raw(`SELECT ${columns} FROM ${tableName} ${where}`);
        
        return data;
    },
    update: async function (tableName: string, value: Object, where: string) {
        let data = await db(tableName).where({ id: where }).update(value, ['ID']);

        return data;
    },
    delete: async function (tableName: string, where: string) {
        try {
            let data = await db(tableName).where({ id: where }).del(['ID']);

            return data;
        } catch (error) {
            return error;
        }
    },
    getTickets: async function (where: string) {
        let data = await db.raw(`SELECT 
                t.[ID] AS TicketID,
                t.[Subject],
                t.[UserID],
                t.[Status],
                s.[NameAR] AS StatusNameAR,
                s.[NameEN] AS StatusNameEN,
                t.[Type],
                ty.[NameAR] AS TypeNameAR,
                ty.[NameEN] AS TypeNameEN,
                t.[AgentID],
                t.[Priority],
                t.[Closed],
                t.[Date],
                us.[FullName],
                agent.FullName AS AgentFullName
                FROM 
                [Tickets].[dbo].[Tickets] t
                LEFT JOIN 
                [Tickets].[dbo].[Status] s ON t.[Status] = s.[ID]
                LEFT JOIN 
                [Tickets].[dbo].[Users] us ON t.[UserID] = us.[id]
                LEFT JOIN
                [Tickets].[dbo].[Type] ty ON t.[Type] = ty.[ID]
                LEFT JOIN
                [Tickets].[dbo].[Users] agent ON t.[AgentID] = agent.[id]
                ${where}`);
        return data;
    },
    getTicket: async function (where: string) {
        let data = await db.raw(`SELECT 
                t.[ID] AS TicketID,
                t.[Subject],
                t.[Status],
                s.[NameAR] AS StatusNameAR,
                s.[NameEN] AS StatusNameEN,
                t.[Type],
                ty.[NameAR] AS TypeNameAR,
                ty.[NameEN] AS TypeNameEN,
                t.[Priority],
                t.[Closed],
                t.[Date],
                us.[FullName] AS UserFullName,
                agent.[FullName] AS AgentFullName
                FROM 
                [Tickets].[dbo].[Tickets] t
                LEFT JOIN 
                [Tickets].[dbo].[Status] s ON t.[Status] = s.[ID]
                LEFT JOIN 
                [Tickets].[dbo].[Type] ty ON t.[Type] = ty.[ID]
                LEFT JOIN
                [Tickets].[dbo].[Users] us ON t.[UserID] = us.[id]
                LEFT JOIN
                [Tickets].[dbo].[Users] agent ON t.[AgentID] = agent.[id]
                ${where}`);

        return data;
    },
    getMessage: async function (where: string) {
        let data = await db.raw(`SELECT [Messages].[ID]
            ,[Messages].[Message]
            ,[Messages].[TicketID]
            ,[Messages].[UserID] AS MessageUserID
            ,[Messages].[Date]
	        ,'[' + STRING_AGG('"' + attachment.DocumentName + '"', ',') + ']' AS Attachments
            FROM [dbo].[Messages]
            LEFT JOIN 
            [dbo].Attachments attachment ON Messages.ID = attachment.MessageID
            where Messages.[ID] = ${where}
            GROUP BY Messages.ID, Messages.Message, Messages.UserID, Messages.Date, Messages.TicketID `);

        return data;
    },
    getMessages: async function (where: string) {
        let data = await db.raw(`SELECT 
            Messages.ID AS MessageID, 
            Messages.Message, 
			Messages.UserID AS MessageUserID,
            Messages.Date AS MessageDate,
			Messages.TicketID,
			u.FullName,
			'[' + STRING_AGG('"' + attachment.DocumentName + '"', ',') + ']' AS Attachments
            FROM Messages
			LEFT JOIN
			[Tickets].dbo.Tickets ticket ON Messages.TicketID = ticket.ID
			LEFT JOIN
			[Tickets].dbo.Users u ON Messages.UserID = u.id
			LEFT JOIN
			[Tickets].dbo.Attachments attachment ON attachment.MessageID = Messages.ID 
            ${where}
            GROUP BY Messages.ID, Messages.Message, Messages.UserID, Messages.Date, Messages.TicketID,u.FullName
            `);

        return data;
    },
    getAttachments: async function (where: string) {
        let data = await db.raw(`SELECT 
            [Attachments].[ID],
            [DocumentName],
            [MessageID]
            FROM [dbo].[Attachments]
            LEFT JOIN
            [Tickets].dbo.Messages messages ON Attachments.MessageID = Messages.ID
            WHERE messages.TicketID = ${where}`);

        return data;
    }
}


export default functions;