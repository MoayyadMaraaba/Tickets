class Ticket {
    Subject: string;
    UserID: number;
    Status: number;
    Type: number;
    AgentID: number;
    Priority: string;
    Closed: number;
    Date: Date;

    constructor(Subject: string, UserID: number, Status: number, Type: number, AgentID: number, Priority: string, Closed: number, Date: Date) {
        this.Subject = Subject;
        this.UserID = UserID;
        this.Status = Status;
        this.Type = Type;
        this.AgentID = AgentID;
        this.Priority = Priority;
        this.Closed = Closed;
        this.Date = Date;
    }

}

export default Ticket;