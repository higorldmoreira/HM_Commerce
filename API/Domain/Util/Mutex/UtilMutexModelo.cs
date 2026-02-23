using System.Threading;

namespace Domain.Util.Mutex
{

    public static class UtilMutexModelo
    {
        private static System.Threading.Mutex m_mutex = new System.Threading.Mutex(false, "Global\\PedidoVendaJob");

        public static void MutexTake()
        {
            try
            {
                m_mutex.WaitOne();
            }
            catch (AbandonedMutexException)
            {

            }
        }

        public static void MutexLeave()
        {
            m_mutex.ReleaseMutex();
        }
    }
}

