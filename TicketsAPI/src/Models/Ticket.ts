interface Ticket {
    ID: number;
    Subject: string;
    UserID: number;
    Status: number;
    Type: number;
    AgentID: number;
    Priority: string;
    Closed: number;
    Date: Date;
}

export default Ticket;