using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;
namespace client
{
    [JsonObject(MemberSerialization.OptIn)]
    public class DataMessage
    {
        public DataMessage() { }
        [JsonProperty]
        public string action;
        [JsonProperty]
        public string symbol;
    }

    [JsonObject(MemberSerialization.OptIn)]
    public class LoginMessage
    {
        public LoginMessage() { }
        [JsonProperty]
        public string action;
        [JsonProperty]
        public string username;
        [JsonProperty]
        public string password;

        public LoginMessage(string u, string p)
        {
            action = "login";
            username = u;
            password = p;
        }
    }

    [JsonObject(MemberSerialization.OptIn)]
    public class DataFeed
    {
        public static Random _r = new Random();

        // "John Smith"
        [JsonProperty]
        public string symbol { get; set; }

        [JsonProperty]
        public double ask { get; set; }

        [JsonProperty]
        public double bid { get; set; }


        [JsonProperty]
        public int bidsize { get; set; }


        [JsonProperty]
        public int asksize { get; set; }


        public DataFeed()
        {

        }


    }

    public class messageParser
    {

        

        public static string GetJsonLoginMessage(string u, string p)
        {
            LoginMessage ms = new LoginMessage(u,p);
            return JsonConvert.SerializeObject(ms) + "@@";
        }

        public static string GetJsonMessage(string action, string symbol)
        {
            DataMessage dm = new DataMessage();
            dm.action = action;
            dm.symbol = symbol;
            return JsonConvert.SerializeObject(dm) + "@@";
        }

        public static List<DataFeed> GetPriceMessage(string action)
        {
            return JsonConvert.DeserializeObject<List<DataFeed>>(action);
        }


    }
}
