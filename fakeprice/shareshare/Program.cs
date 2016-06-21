using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using System.Net.Sockets;
using System.Net;

// Add using statements to access AWS SDK for .NET services. 
// Both the Service and its Model namespace need to be added 
// in order to gain access to a service. For example, to access
// the EC2 service, add:
// using Amazon.EC2;
// using Amazon.EC2.Model;

namespace shareshare
{
    class Program
    {
        public static void Main(string[] args)
        {

            if (args.Length != 2)
            {
                Console.WriteLine("expect ip and port as parameters");
                return;
            }

            IPAddress address = IPAddress.Parse(args[0]);
            int port = Convert.ToInt32(args[1]);

           // IPAddress ipAddress = Dns.GetHostEntry("localhost").AddressList[0];
            TcpListener serverSocket = new TcpListener(address,port);
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
                handleClinet client = new handleClinet();
                client.startClient(clientSocket, Convert.ToString(counter));
            }

            

            /*
            //IAmazonS3 s3Client = new AmazonS3Client();
            AmazonDynamoDBConfig cf = new AmazonDynamoDBConfig();
            cf.ServiceURL = "http://localhost:8000";
            // IAmazonS3 s3Client = new AmazonS3Client();
            AmazonDynamoDBClient client = new AmazonDynamoDBClient(cf);

            var res = client.DescribeTable(new DescribeTableRequest { TableName = "ProductCatalog" });
            */
            /*
            string tableName = "ProductCatalog";

            var request = new CreateTableRequest
            {
                TableName = tableName,
                AttributeDefinitions = new List<AttributeDefinition>()
                {
                    new AttributeDefinition
                     {
                         AttributeName = "Id",
                          AttributeType = "N"
                     }
                 },
                KeySchema = new List<KeySchemaElement>()
  {
    new KeySchemaElement
    {
      AttributeName = "Id",
      KeyType = "HASH"  //Partition key
    }
  },
                ProvisionedThroughput = new ProvisionedThroughput
                {
                    ReadCapacityUnits = 10,
                    WriteCapacityUnits = 5
                }
            };

            var response = client.CreateTable(request);


            Console.Read();*/
        }
    }
}