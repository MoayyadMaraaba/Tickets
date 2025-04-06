using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketsMobile.Models
{
    public class Status
    {
        public int ID;
        public string NameEN;
        public string NameAR;

        public Status()
        {
            ID = 0;
            NameEN = string.Empty;
            NameAR = string.Empty;
        }

        public Status(int iD, string nameEN, string nameAR)
        {
            ID = iD;
            NameEN = nameEN;
            NameAR = nameAR;
        }

    }
}
