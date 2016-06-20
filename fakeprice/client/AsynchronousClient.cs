using System;
using System.Net;
using System.Net.Sockets;
using System.Threading;
using System.Text;
using client;
using System.Collections.Generic;


public class AsynchronousClient
{
    public const int BufferSize = 256;
    // Receive buffer.
    public byte[] buffer = new byte[BufferSize];
    // Received data string.
    public StringBuilder sb = new StringBuilder();


    // The response from the remote device.
    private static String response = String.Empty;
    Socket _client = null;
    MainWindow _mainWin;
    private string _username;
    private string _password;

    public AsynchronousClient(string ip, int port, MainWindow mwin, string user, string pass)
    {
        _mainWin = mwin;
        IPAddress address = IPAddress.Parse(ip);
        IPEndPoint remoteEP = new IPEndPoint(address, port);
        _client = new Socket(AddressFamily.InterNetwork,SocketType.Stream, ProtocolType.Tcp);
        _username = user;
        _password = pass;
        _client.BeginConnect(remoteEP, new AsyncCallback(ConnectCallback), _client);
    }

    public void Close()
    {
        _client.Shutdown(SocketShutdown.Both);
        _client.Close();

    }


    public void subscribe(string symbol)
    {
        Send(messageParser.GetJsonMessage("subscribe", symbol));

    }


    public void unsubscribe(string symbol)
    {
        Send(messageParser.GetJsonMessage("unsubscribe", symbol));

    }

    private  void ConnectCallback(IAsyncResult ar)
    {
        try
        {
            // Retrieve the socket from the state object.
            Socket client = (Socket)ar.AsyncState;

            // Complete the connection.
            client.EndConnect(ar);

            Send(messageParser.GetJsonLoginMessage(_username, _password));
            

            Receive();
        }
        catch (Exception e)
        {
            Console.WriteLine(e.ToString());
        }
    }

    private void Receive()
    {
        try
        {
            for (; ; )
            {
                int size = _client.Receive(buffer);
                sb.Append(Encoding.ASCII.GetString(buffer, 0, size));
                
                for (; ; )
                {
                    string content = sb.ToString();
                    int index = content.IndexOf("@@");
                    if (index > -1)
                    {
                        string ret = sb.ToString(0, index);
                        List<DataFeed> list = messageParser.GetPriceMessage(ret);
                        _mainWin.SetGridData(list,ret);
                        sb.Remove(0, index + 2);
                        
                        //handle message
                    }
                    else
                    {
                        break;
                    }

                }
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(e.ToString());
        }
    }

   

    public bool Send(String data)
    {
        // Convert the string data to byte data using ASCII encoding.
        _mainWin.SetSendData(data);
        byte[] byteData = Encoding.ASCII.GetBytes(data);

        // Begin sending the data to the remote device.
        int bytes = _client.Send(byteData);
        if (bytes != byteData.Length)
        {
            return false;
        }
        return true;
    }

   

  
}