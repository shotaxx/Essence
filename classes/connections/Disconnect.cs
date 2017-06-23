﻿using GTANetworkServer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Essence.classes
{
    class Disconnect : Script
    {
        Database db = new Database();

        public Disconnect()
        {
            API.onPlayerDisconnected += API_onPlayerDisconnected;
        }

        private void API_onPlayerDisconnected(Client player, string reason)
        {
            if (!API.hasEntityData(player, "Instance"))
            {
                API.consoleOutput(string.Format("Disconnected unknown user, {0}", player.name));
                return;
            }

            API.consoleOutput(string.Format("Disconnected registered user, {0}", player.name));
            Player instance = (Player)API.getEntityData(player, "Instance");
            instance.updatePlayerPosition();
            instance.PlayerClothing.savePlayerClothes();
            instance.removePlayerVehicles();
        }

        private void removePlayerVehicles(Player instance)
        {
            instance.removePlayerVehicles();
        }
    }
}
