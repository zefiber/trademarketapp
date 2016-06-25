using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;
namespace shareshare.PriceServer
{
    [JsonObject(MemberSerialization.OptIn)]
    public class GeneralMessage
    {

        public GeneralMessage() { }
        [JsonProperty]
        public string action { get; set; }
        public abstract string GetMessage();
    }

    [JsonObject(MemberSerialization.OptIn)]
    public class Equity
    {
        [JsonProperty]
        public string symbol { get; set; }

        [JsonProperty]
        public string currency { get; set; }

        [JsonProperty]
        public string exchange { get; set; }

        [JsonProperty]
        public string sectype { get; set; }

        public Equity()
        {

        }

        public override int GetHashCode()
        {
            return symbol.Length;
        }

        public override bool Equals(object obj)
        {
            Equity other = obj as Equity;
            return other != null && (symbol == other.symbol);
        }
    }


    [JsonObject(MemberSerialization.OptIn)]
    public class MarketRequestMessage : GeneralMessage
    {
        public MarketRequestMessage() { }


        public MarketRequestMessage(int id)
        {
            action = Constant.MSG_SUBSCRIBE;
            equityid = id;
        }

        [JsonProperty]
        public int equityid { get; set; }

        public override string GetMessage()
        {
            return JsonConvert.SerializeObject(this) + Constant.MSG_DELIMETER;
        }
    }


    [JsonObject(MemberSerialization.OptIn)]
    public class MarketCancelMessage : GeneralMessage
    {
        public MarketCancelMessage() { }

        public MarketCancelMessage(int id)
        {
            action = Constant.MSG_UNSUBSCRIBE;
            equityid = id;
        }

        [JsonProperty]
        public int equityid { get; set; }

        public override string GetMessage()
        {
            return JsonConvert.SerializeObject(this) + Constant.MSG_DELIMETER;
        }

    }
    
    [JsonObject(MemberSerialization.OptIn)]
    public class MarketBidResponseMessage : GeneralMessage
    {

        [JsonProperty]
        public int equityid { get; set; }


        [JsonProperty]
        public double bid { get; set; }

        public override string GetMessage()
        {
            return JsonConvert.SerializeObject(this) + Constant.MSG_DELIMETER;
        }
    }

    [JsonObject(MemberSerialization.OptIn)]
    public class MarketAskSizeResponseMessage : GeneralMessage
    {

        [JsonProperty]
        public int equityid { get; set; }


        [JsonProperty]
        public int bidsize { get; set; }
        public override string GetMessage()
        {
            return JsonConvert.SerializeObject(this) + Constant.MSG_DELIMETER;
        }
    }

    [JsonObject(MemberSerialization.OptIn)]
    public class MarketBidSizeResponseMessage : GeneralMessage
    {

        [JsonProperty]
        public int equityid { get; set; }
  
        [JsonProperty]
        public int bidsize { get; set; }

        public override string GetMessage()
        {
            return JsonConvert.SerializeObject(this) + Constant.MSG_DELIMETER;
        }
    }

    [JsonObject(MemberSerialization.OptIn)]
    public class MarketDataResponseMessage : GeneralMessage
    {

        [JsonProperty]
        public int equityid { get; set; }

        [JsonProperty]
        public double ask { get; set; }

        [JsonProperty]
        public double bid { get; set; }


        [JsonProperty]
        public int bidsize { get; set; }


        [JsonProperty]
        public int asksize { get; set; }

        public override string GetMessage()
        {
            return JsonConvert.SerializeObject(this) + Constant.MSG_DELIMETER;
        }

    }

    public class MessageDecoder
    {

        public static string GetMessageAction(string msg)
        {
            string ret = string.Empty;
            try
            {
                dynamic stuff = JsonConvert.DeserializeObject(msg);
                ret = stuff.action;
            }
            catch (Exception e)
            {

            }
            return ret;
        }

        public static int GetEquityId(string msg)
        {
            int ret = -1;
            try
            {
                dynamic stuff = JsonConvert.DeserializeObject(msg);
                ret = stuff.equityid;
            }
            catch(Exception e)
            {
                
            }
            return ret;
        }

    }

}
