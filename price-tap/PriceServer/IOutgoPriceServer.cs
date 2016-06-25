using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace shareshare.PriceServer
{
    public interface IOutgoPriceServer
    {

        void SetCallBack(Action<int ,string> messageTarget);

        void SubscribePrice(int equityId);

        void UnSubscribePrice(int equityId);

        void StartServer();

        void StopServer();
    }
}
