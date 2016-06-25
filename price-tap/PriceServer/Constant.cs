using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace shareshare.PriceServer
{
    public class Constant
    {
        public static readonly string MSG_SUBSCRIBE = "subscribe";
        public static readonly string MSG_UNSUBSCRIBE = "unsubscribe";
        public static readonly string MSG_STOPSERVICE = "stopservice";
        public static readonly string MSG_DELIMETER = "@@";
        public static readonly int BUFFER_SIZE = 256;
    }
}
