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
using shareshare.PriceServer;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

// Add using statements to access AWS SDK for .NET services. 
// Both the Service and its Model namespace need to be added 
// in order to gain access to a service. For example, to access
// the EC2 service, add:
// using Amazon.EC2;
// using Amazon.EC2.Model;

namespace shareshare
{

    public class Person
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime BirthDate { get; set; }
        public string action { get; set; }
        public Person()
        {
            action = "person";
        }
    }

    public class Employee : Person
    {
        public string Department { get; set; }
        public string JobTitle { get; set; }
        public Employee()
        {
            action = "employee";
        }
    }

    public class PersonConverter : JsonCreationConverter<Person>
    {
        protected override Person Create(Type objectType, JObject jObject)
        {
            string value = ActionValue("action", jObject);
            if (value == "person")
            {
                return new Person();
            }
            else if (value == "employee")
            {
                return new Employee();
            }
            else
            {
                return new Person();
            }
        }

        private string ActionValue(string fieldName, JObject jObject)
        {
            if (jObject[fieldName] != null)
            {
                return jObject[fieldName].Value<string>();
            }
            return "";
        }
    }

    public abstract class JsonCreationConverter<T> : JsonConverter
    {
        /// <summary>
        /// Create an instance of objectType, based properties in the JSON object
        /// </summary>
        /// <param name="objectType">type of object expected</param>
        /// <param name="jObject">
        /// contents of JSON object that will be deserialized
        /// </param>
        /// <returns></returns>
        protected abstract T Create(Type objectType, JObject jObject);

        public override bool CanConvert(Type objectType)
        {
            return typeof(T).IsAssignableFrom(objectType);
        }

        public override object ReadJson(JsonReader reader,
                                        Type objectType,
                                         object existingValue,
                                         JsonSerializer serializer)
        {
            // Load JObject from stream
            JObject jObject = JObject.Load(reader);

            // Create target object based on JObject
            T target = Create(objectType, jObject);

            // Populate the object properties
            serializer.Populate(jObject.CreateReader(), target);

            return target;
        }

        public override void WriteJson(JsonWriter writer,
                                       object value,
                                       JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }
    }

    class Program
    {
        public static void Main(string[] args)
        {
            /*
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

            */


            string json = @"{
   
   'Department': 'Furniture',
   'JobTitle': 'Carpenter',
   'FirstName': 'John',
   'LastName': 'Joinery',
   'BirthDate': '1983-02-02T00:00:00',
   'action'  : 'person'
 }";

            Person person = JsonConvert.DeserializeObject<Person>(json, new PersonConverter());
            Console.WriteLine(person.GetType().Name);
            Employee employee = (Employee)person;
            Console.WriteLine(employee.JobTitle);

            /*
            ConcurrentHashSet<int> test = new ConcurrentHashSet<int>();
            test.Add(1);
            test.Add(1);
            test.Add(2);
            test.Add(3);
            test.Add(4);
            foreach (var v in test)
            {
                Console.WriteLine(v);
            }*/

            Console.ReadLine();
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