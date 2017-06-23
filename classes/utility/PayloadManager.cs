﻿using GTANetworkServer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Timers;

namespace Essence.classes.utility
{
    public class PayloadManager : Script
    {
        public PayloadManager()
        {
            API.onResourceStart += API_onResourceStart;
        }

        private void API_onResourceStart()
        {
            Timer timer = new Timer();
            timer.Interval = 30000;
            timer.Elapsed += Time_Elapsed;
            timer.Enabled = true;
        }

        private void Time_Elapsed(object sender, ElapsedEventArgs e)
        {
            Payload.executeQueries();
        }
    }
}