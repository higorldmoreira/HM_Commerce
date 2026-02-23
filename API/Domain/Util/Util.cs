using MySqlConnector;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using static Domain.Enums.Enums;

namespace Domain.Util
{
    public static class Util
    {
        public static string RemoverCaracteresCodificados(string entrada, string substituicao = " ")
        {
            if (entrada == null) return null;
            const string pattern = @"[^0-9a-zA-Z]+";
            var rgx = new Regex(pattern);
            return rgx.Replace(entrada, substituicao);
        }

        public static bool ValidaEmailEstrutura(string email)
        {
            if (string.IsNullOrWhiteSpace(email)) return false;

            var regExpEmail = new Regex("^[A-Za-z0-9](([_.-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([.-]?[a-zA-Z0-9]+)*)([.][A-Za-z]{2,4})$");
            return regExpEmail.IsMatch(email);
        }

        public static List<List<T>> SplitList<T>(List<T> source, int numberLists)
        {
            if (source == null || numberLists <= 0) return new List<List<T>>();

            return source
                .Select((x, i) => new { Index = i / numberLists, Value = x })
                .GroupBy(x => x.Index)
                .Select(g => g.Select(v => v.Value).ToList())
                .ToList();
        }

        public static bool ToBool(this string s)
        {
            return s?.ToLower() == "true";
        }

        public static bool OperacoesEntrada(int operacao)
        {
            return operacao switch
            {
                7 or 8 or 9 or 10 or 11 or 12 or 13 or 15 or 19 or 21 => true,
                _ => false,
            };
        }

        public static void GravaLogEnvio<T>(T objeto, int jobId, string appName = "Default")
        {
            if (objeto == null) return;

            try
            {
                var path = Path.Combine("C:\\LogMbaIntegration", appName, EnumBase<EnumTipoLog>.GetNameOrDescriptionByValue(jobId),
                                         DateTime.Now.Year.ToString(), DateTime.Now.Month.ToString());

                Directory.CreateDirectory(path);

                var fileName = $"{EnumBase<EnumTipoLog>.GetNameOrDescriptionByValue(jobId)}_{DateTime.Now:yyyy_MM_dd}.txt";
                var fullPath = Path.Combine(path, fileName);

                using var sw = new StreamWriter(new FileStream(fullPath, FileMode.Append, FileAccess.Write, FileShare.ReadWrite));
                sw.WriteLine($"{DateTime.Now:yyyy-MM-dd HH:mm:ss} - Objeto de Envio:");
                sw.WriteLine(JsonConvert.SerializeObject(objeto));
                sw.Flush();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao gravar log de envio: {ex.Message}");
            }
        }

        public static T? GetFieldValueOrDefault<T>(this MySqlDataReader reader, string fieldName) where T : struct
        {
            var value = reader[fieldName];
            return value == DBNull.Value ? (T?)null : (T)Convert.ChangeType(value, typeof(T));
        }
        public static void GravaLogRetorno<T>(T objeto, int jobId, string appName = "Default")
        {
            if (objeto == null) return;

            try
            {
                var path = Path.Combine("C:\\LogMbaIntegration", appName, EnumBase<EnumTipoLog>.GetNameOrDescriptionByValue(jobId),
                                         DateTime.Now.Year.ToString(), DateTime.Now.Month.ToString());

                Directory.CreateDirectory(path);

                var fileName = $"{EnumBase<EnumTipoLog>.GetNameOrDescriptionByValue(jobId)}_{DateTime.Now:yyyy_MM_dd}.txt";
                var fullPath = Path.Combine(path, fileName);

                using var sw = new StreamWriter(new FileStream(fullPath, FileMode.Append, FileAccess.Write, FileShare.ReadWrite));
                sw.WriteLine($"{DateTime.Now:yyyy-MM-dd HH:mm:ss} - Retorno:");
                sw.WriteLine(JsonConvert.SerializeObject(objeto));
                sw.WriteLine();
                sw.Flush();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao gravar log de retorno: {ex.Message}");
            }
        }
    }
}
