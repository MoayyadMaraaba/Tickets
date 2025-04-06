class Message {
    Message: string;
    TicketID: number;
    UserID: number;
    Date: Date;

    constructor(Message: string, TicketID: number, UserID: number, Date: Date) {
        this.Message = Message;
        this.TicketID = TicketID;
        this.UserID = UserID;
        this.Date = Date;
    }
}

export default Message;