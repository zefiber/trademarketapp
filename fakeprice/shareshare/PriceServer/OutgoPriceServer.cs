using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Net.Sockets;
using System.Net;

namespace shareshare.PriceServer
{
    public class OutgoPriceServer : IOutgoPriceServer
    {

        private Queue<MarketRequestMessage> _queue = new Queue<MarketRequestMessage>();
        private Object _thisLock = new Object();
        private ManualResetEvent _hasReq = new ManualResetEvent(false);
        Socket _client = null;
        IPEndPoint _remoteEP;
        bool _stop = false;
        public OutgoPriceServer(string outip, int outport)
        {
            IPAddress address = IPAddress.Parse(outip);
            _remoteEP = new IPEndPoint(address, outport);
            _client = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
        }

        public void SubscribePrice(MarketRequestMessage req)
        {
            lock (_thisLock)
            {
                _queue.Enqueue(req);
            }
            _hasReq.Set();
        }

        public void UnSubscribePrice(int secId)
        {
            throw new NotImplementedException();
        }


        public void StartServer()
        {
            _client.BeginConnect(_remoteEP, new AsyncCallback(ConnectCallback), _client);
        }


        private void ConnectCallback(IAsyncResult ar)
        {
            try
            {
                // Retrieve the socket from the state object.
                Socket client = (Socket)ar.AsyncState;

                // Complete the connection.
                client.EndConnect(ar);

                while (!_stop)
                {
                    _hasReq.WaitOne();
                    lock (_thisLock)
                    {
                        while (_queue.Count > 0)
                        {
                            MarketRequestMessage rm = _queue.Dequeue();

                        }
                        
                    }
                    Thread.Sleep(1000);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }
        }

        public void StopServer()
        {
            throw new NotImplementedException();
        }
    }
}
