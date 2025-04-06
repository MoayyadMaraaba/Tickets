class Attachment {
    DocumentName: string;
    MessageID: string;

    constructor(DocumentName: string, MessageID: string) {
        this.DocumentName = DocumentName;
        this.MessageID = MessageID;
    }
}

export default Attachment;