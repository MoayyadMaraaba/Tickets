using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketsMobile.Models
{
    public class Type
    {
        public int ID { get; set; }
        public string NameEN { get; set; }
        public string NameAR { get; set; }

        public Type()
        {
            ID = 0;
            NameEN = string.Empty;
            NameAR = string.Empty;
        }

        public Type(int ID, string NameEN, string NameAR)
        {
            this.ID = ID;
            this.NameEN = NameEN;
            this.NameAR = NameAR;
        }

    }
}
