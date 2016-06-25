using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;


namespace shareshare.PriceServer
{

    public class MessageConverter : JsonCreationConverter<GeneralMessage>
    {
        protected override GeneralMessage Create(Type objectType, JObject jObject)
        {
            string value = ActionValue("action", jObject);
            if (value == Constant.MSG_SUBSCRIBE)
            {
                return new MarketRequestMessage();
            }
            else if (value == Constant.MSG_UNSUBSCRIBE)
            {
                return new MarketCancelMessage();
            }
            else
            {
                return new GeneralMessage();
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
}
