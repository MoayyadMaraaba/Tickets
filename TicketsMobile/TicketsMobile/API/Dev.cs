using Microsoft.Maui.ApplicationModel.Communication;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace TicketsMobile.API
{
    internal class Dev
    {
        public async Task<(int, dynamic)> DirectLogin()
        {
            Fetch fetch = new Fetch();

            var body = new Dictionary<string, object>
            {
                { "Email", "1" },
                { "Password", "1" }
            };

            var data = await fetch.GetData("api/Authentication/Login", body,null,null, null,RestSharp.Method.Post);

            int StatusCode = (int)data["StatusCode"];
            Dictionary<string, object> res = (Dictionary<string, object>)data["Data"];

            return (StatusCode, res);
        }
    }
}
