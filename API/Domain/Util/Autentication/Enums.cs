using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;

namespace Domain.Util.Autentication
{
    public class Enums
    {
        #region Definições

        public class EnumBase<T>
        {
            public static string GetNameOrDescriptionByValue(string value)
            {
                foreach (var field in typeof(T).GetFields())
                {
                    if (!Convert.ToString(field.GetValue(field)).Equals(value)) continue;
                    var att = (DescriptionAttribute[])field.GetCustomAttributes(typeof(DescriptionAttribute), false);
                    return att.Length > 0 ? att[0].Description ?? "Nulo" : field.Name;
                }

                return "";
            }

            public static string GetNameOrDescriptionByValue(int value)
            {
                return GetNameOrDescriptionByValue(value.ToString());
            }

            public static List<string> GetNamesOrDescriptions()
            {
                return (from field in typeof(T).GetFields() let att = (DescriptionAttribute[])field.GetCustomAttributes(typeof(DescriptionAttribute), false) select att.Length > 0 ? att[0].Description ?? "Nulo" : field.Name).ToList();
            }

            public static List<KeyValuePair<string, string>> ToListKeyValuePair()
            {
                return (from field in typeof(T).GetFields() let att = (DescriptionAttribute[])field.GetCustomAttributes(typeof(DescriptionAttribute), false) let key = field.GetValue(field).ToString() let value = att.Length > 0 ? att[0].Description ?? "Nulo" : field.Name select new KeyValuePair<string, string>(key, value)).ToList();
            }
        }

        #endregion

        public class EnumEnderecoApiIntervan : EnumBase<EnumEnderecoApiIntervan>
        {
            [Description("/app/v1/token/")]
            public const int Qaut2_0 = 1;
        }
    }
}
