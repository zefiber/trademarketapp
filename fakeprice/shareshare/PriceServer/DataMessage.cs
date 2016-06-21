using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;
namespace shareshare.PriceServer
{
    [JsonObject(MemberSerialization.OptIn)]
    public abstract class GeneralMessage
    {
        [JsonProperty]
        public string action { get; set; }
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

        [JsonProperty]
        public Equity stock { get; set; }

        [JsonProperty]
        public int clientid { get; set; }

    }


    [JsonObject(MemberSerialization.OptIn)]
    public class MarketAskResponseMessage : GeneralMessage
    {

        [JsonProperty]
        public int clientid { get; set; }

        [JsonProperty]
        public double ask { get; set; }

    }

    [JsonObject(MemberSerialization.OptIn)]
    public class MarketBidResponseMessage : GeneralMessage
    {

        [JsonProperty]
        public int clientid { get; set; }


        [JsonProperty]
        public double bid { get; set; }


    }

    [JsonObject(MemberSerialization.OptIn)]
    public class MarketAskSizeResponseMessage : GeneralMessage
    {

        [JsonProperty]
        public int clientid { get; set; }


        [JsonProperty]
        public int bidsize { get; set; }

    }

    [JsonObject(MemberSerialization.OptIn)]
    public class MarketBidSizeResponseMessage : GeneralMessage
    {

        [JsonProperty]
        public int clientid { get; set; }
  
        [JsonProperty]
        public int bidsize { get; set; }


    }

    [JsonObject(MemberSerialization.OptIn)]
    public class MarketDataResponseMessage : GeneralMessage
    {

        [JsonProperty]
        public int clientid { get; set; }

        [JsonProperty]
        public double ask { get; set; }

        [JsonProperty]
        public double bid { get; set; }


        [JsonProperty]
        public int bidsize { get; set; }


        [JsonProperty]
        public int asksize { get; set; }

    }

}
