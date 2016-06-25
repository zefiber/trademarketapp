using System;
using System.Threading;
using System.Net.Sockets;
using System.Text;
using System.Collections.Generic;
using System.Net;
using System.Collections.Concurrent;
using Newtonsoft.Json;
namespace shareshare.PriceServer
{


    public class IncomeClient
    {
        TcpClient _clientSocket;
        int  _clientNoo;

        public const int BufferSize = 1024;
        // Receive buffer.
        public byte[] buffer = new byte[BufferSize];
        // Received data string.
        public StringBuilder sb = new StringBuilder();

        IncomeServer _iServer;

        public void startClient(IncomeServer iServer, TcpClient inClientSocket, int clineNo)
        {
            _iServer = iServer;
            _clientSocket = inClientSocket;
            _clientNoo = clineNo;
            Thread ctThread = new Thread(startCommu);
            ctThread.Start();

        }


        private string ReceiveOneMessage()
        {

            string content = sb.ToString();

            int index = content.IndexOf("@@");
            if (index > -1)
            {
                string ret = sb.ToString(0, index);
                sb.Remove(0, index + 2);
                return ret;

            }
            else
            {
                NetworkStream networkStream = _clientSocket.GetStream();
                int size = networkStream.Read(buffer, 0, BufferSize);
                sb.Append(Encoding.ASCII.GetString(buffer, 0, size));
                return ReceiveOneMessage();
            }
        }

        public void SendMessage(string msg)
        {
            try
            {
                NetworkStream networkStream = _clientSocket.GetStream();
                byte[] sendBytes = Encoding.ASCII.GetBytes(msg);
                networkStream.Write(sendBytes, 0, sendBytes.Length);
            }
            catch (Exception e) //problem
            {
                Stop();
            }
        }

        public void Stop()
        {
            try
            {
                _clientSocket.Close();
            }
            catch (Exception e)
            {
            }
            _iServer.RemoveClient(_clientNoo);

        }

        private void startCommu()
        {
            
            try
            {
                for (;;)
                {
                    string msg = ReceiveOneMessage();

                    GeneralMessage gm = JsonConvert.DeserializeObject<GeneralMessage>(msg, new MessageConverter());
                    if (gm is MarketRequestMessage)
                    {
                        MarketRequestMessage mrm = (MarketRequestMessage)gm;
                        _iServer.Subscribe(_clientNoo, mrm.equityid);
                    }
                    else if (gm is MarketCancelMessage)
                    {
                        MarketCancelMessage mcm = (MarketCancelMessage)gm;
                        _iServer.Subscribe(_clientNoo, mcm.equityid);
                    }
                    else
                    {
                        break;
                    }

                }

            }

            catch (Exception e) //log error
            {
                
            }
            Stop();

        }

    } 

    public class IncomeServer
    {

        bool _stop = false;

        private ConcurrentDictionary<int, ConcurrentHashSet<int>> _equityClientMap = new ConcurrentDictionary<int, ConcurrentHashSet<int>>();
        private ConcurrentDictionary<int, ConcurrentHashSet<int>> _clientEquityMap = new ConcurrentDictionary<int, ConcurrentHashSet<int>>();
        private ConcurrentDictionary<int, IncomeClient> _idClientMap = new ConcurrentDictionary<int, IncomeClient>();

        private IOutgoPriceServer _outGoServer;
        public IncomeServer(IOutgoPriceServer outgoserver)
        {
            _outGoServer = outgoserver;
            _outGoServer.SetCallBack(UpdatePrice);
        }


        public void Subscribe(int clientid, int equityid)
        {
            if (_equityClientMap.ContainsKey(equityid))
            {
                _equityClientMap[equityid].Add(clientid);
            }
            else
            {
                _equityClientMap[equityid] = new ConcurrentHashSet<int>();
                _equityClientMap[equityid].Add(clientid);
                _outGoServer.SubscribePrice(equityid);
            }

        }


        public void UnSubscribe(int clientid, int equityid)
        {
            if (_equityClientMap.ContainsKey(equityid))
            {
                _equityClientMap[equityid].Remove(clientid);

                if (_equityClientMap[equityid].Count == 0)
                {
                    _outGoServer.UnSubscribePrice(equityid);
                }
            }

        }

        private void UpdatePrice(int equityid, string msg)
        {
            ConcurrentHashSet<int> set = null;
            if (_equityClientMap.TryGetValue(equityid, out set))
            {
                foreach (var v in set)
                {
                    IncomeClient ic;
                    if (_idClientMap.TryGetValue(v, out ic))
                    {
                        ic.SendMessage(msg);
                    }

                }
            }
        }



        public void AddClient(int clientid, IncomeClient client)
        {
            _idClientMap.TryAdd(clientid, client);
        }

        public void RemoveClient(int clientid)
        {
            IncomeClient oc;
            _idClientMap.TryRemove(clientid,out oc);

            if (_clientEquityMap.ContainsKey(clientid))
            {
                if(_clientEquityMap[clientid].Count > 0)
                {
                    foreach(var v in _clientEquityMap[clientid])
                    {
                        UnSubscribe(clientid, v); 
                    }
                }
            }
            
        }

        public void Start(string url, int port)
        {

            IPAddress address = IPAddress.Parse(url);
            TcpListener serverSocket = new TcpListener(address, port);
            TcpClient clientSocket = default(TcpClient);
            int counter = 0;

            serverSocket.Start();
            Console.WriteLine(" >> " + "Server Started");

            counter = 0;
            while (true)
            {
                counter += 1;
                clientSocket = serverSocket.AcceptTcpClient();
                Console.WriteLine(" >> " + "Client No:" + Convert.ToString(counter) + " started!");
                IncomeClient client = new IncomeClient();
                AddClient(counter, client);
                client.startClient(this,clientSocket, counter);
            }

        }



    }
}
