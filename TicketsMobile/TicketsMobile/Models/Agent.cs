using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketsMobile.Models
{
    public class Agent
    {
        public int id {  get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public bool Activation {  get; set; }
        public string Role { get; set; }

        public Agent()
        {
            this.id = 0;
            this.FullName = "";
            this.Email = "";
            this.PhoneNumber = "";
            this.Activation = false;
            this.Role = "";
        }

        public Agent(int id, string FullName, string Email, string PhoneNumber, bool Activation, string Role)
        {
            this.id = id;
            this.FullName = FullName;
            this.Email = Email;
            this.PhoneNumber = PhoneNumber;
            this.Activation = Activation;
            this.Role = Role;
        }

    }
}
