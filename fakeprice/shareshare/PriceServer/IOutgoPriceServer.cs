using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace shareshare.PriceServer
{
    interface IOutgoPriceServer
    {
        void SubscribePrice(MarketRequestMessage req);

        void UnSubscribePrice(int secId);

        void StartServer();


        void StopServer();
    }
}
