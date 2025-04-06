using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketsMobile.Models
{
    public class Message
    {
        public int ID;
        public string message;
        public int MessageUserID;
        public int TicketID;
        public string FullName;
        public string Attachments;


        public Message(int iD, string message, int messageUserID, int ticketID, string fullName, string attachments)
        {
            ID = iD;
            this.message = message;
            MessageUserID = messageUserID;
            TicketID = ticketID;
            FullName = fullName;
            Attachments = attachments;
        }   
    }
}
