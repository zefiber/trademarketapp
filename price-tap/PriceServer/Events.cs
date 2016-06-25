using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Practices.Prism.Events;

namespace shareshare.PriceServer
{

    public class MarketFeedBackMessage
    {
        public int Id;
        public string Message;

    }

    public class MarketFeedBackEvent : CompositePresentationEvent<MarketFeedBackMessage>
    {
        public MarketFeedBackEvent() { }
    }
}
