using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using Microsoft.Maui.ApplicationModel.Communication;
using System.Diagnostics;
using System.Text.Json;
using System.Collections.Generic;
using TicketsMobile.Models;
using Type = TicketsMobile.Models.Type;
using System.Net;
//using GoogleGson;
using Newtonsoft.Json;
using JsonException = Newtonsoft.Json.JsonException;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.Maui.Controls.PlatformConfiguration;

namespace TicketsMobile.API
{
    public class Fetch
    {
        private readonly RestClient client;
        public static readonly string url = "http://192.168.1.109:4040";
        public Fetch()
        {
            client = new RestClient(url);
        }

        public async Task<Dictionary<string, object>> GetData(string endpoint, object body, string FileName, List<IBrowserFile> FileNames, Dictionary<string, string> headers, Method method)
        {

            var request = new RestRequest(endpoint, method);

            if (body != null && FileName == null)
            {
                request.AddBody(body);
            }

            if(FileName != null && FileNames != null)
            {
                Dictionary<string, object> data = (Dictionary<string,object>)body;

                foreach (var kvp in data)
                {
                    request.AddParameter(kvp.Key, kvp.Value.ToString());
                }

                foreach (var file in FileNames)
                {
                    byte[] fileBytes = await ConvertStreamToByteArray(file.OpenReadStream());
                    int x = fileBytes.Length;


                    request.AddFile(FileName, fileBytes, file.Name, file.ContentType);
                }
            }

            if (headers != null)
            {
                request.AddHeaders(headers);
            }

            var response = await client.ExecuteAsync(request);


            if (response.Content != null)
            {
                var data = new Dictionary<string, object>
                {
                    { "StatusCode", response.StatusCode },
                };


                var s = ParseJson(response.Content);

                data.Add("Data", s);

                return data;
            }
            else
            {
                return new Dictionary<string, object>();
            }
        }

        private async Task<byte[]> ConvertStreamToByteArray(Stream stream)
        {
            using (var memoryStream = new MemoryStream())
            {
                await stream.CopyToAsync(memoryStream);
                return memoryStream.ToArray();
            }
        }


        public object ParseJson(string json)
        {
            try
            {
                var obj = JsonConvert.DeserializeObject<Dictionary<string, object>>(json);
                return obj;
            }
            catch (JsonException)
            {
                try
                {
                    var arr = JsonConvert.DeserializeObject<List<Dictionary<string, object>>>(json);
                    return arr;
                }
                catch (JsonException ex)
                {
                    return null;
                }
            }
        }


        public async Task<List<Type>> GetTypes()
        {
            var request = new RestRequest("api/Types/Get", RestSharp.Method.Get);
            var response = await client.ExecuteAsync(request);

            List<Type> types = new List<Type>();

            if (response.Content != null)
            {
                types = JsonConvert.DeserializeObject<List<Type>>(response.Content);
            }

            return types;
        }

        public async Task<List<Status>> GetStatus()
        {
            var request = new RestRequest("api/Status/Get", RestSharp.Method.Get);
            var response = await client.ExecuteAsync(request);

            List<Status> status = new List<Status>();

            if (response.Content != null)
            {
                status = JsonConvert.DeserializeObject<List<Status>>(response.Content);
            }

            return status;
        }

        public async Task<List<Message>> GetMessages(string ID, string token)
        {
            Dictionary<string, string> headers = new Dictionary<string, string>
            {
                {"authorization", token}
            };

            var request = new RestRequest("api/Messages/Get/"+ID, RestSharp.Method.Get);
            request.AddHeaders(headers);

            var response = await client.ExecuteAsync(request);

            List<Message> messages = new List<Message>();   

            if(response.Content != null)
            {
                messages = JsonConvert.DeserializeObject<List<Message>>(response.Content);
            }

            return messages;
        }

        public async Task<List<Agent>> GetAgents(string token)
        {
            Dictionary<string, string> headers = new Dictionary<string, string>
            {
                {"authorization", token}
            };

            var request = new RestRequest("api/Agents/Get/", RestSharp.Method.Get);
            request.AddHeaders(headers);

            var response = await client.ExecuteAsync(request);

            List<Agent> agents = new List<Agent>();

            if (response.Content != null)
            {
                agents = JsonConvert.DeserializeObject<List<Agent>>(response.Content);
            }

            return agents;

        }

        public async Task<int> Verify(string token)
        {
            Dictionary<string, string> headers = new Dictionary<string, string>
            {
                {"authorization", token}
            };

            var response = await GetData("api/Authentication/Verify", null, null, null, headers, RestSharp.Method.Get);

            int StatusCode = (int)response["StatusCode"];

            return StatusCode;
        }

    }
}
