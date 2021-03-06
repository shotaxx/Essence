﻿using GrandTheftMultiplayer.Server.API;
using GrandTheftMultiplayer.Server.Constant;
using GrandTheftMultiplayer.Server.Elements;
using GrandTheftMultiplayer.Server.Managers;
using GrandTheftMultiplayer.Shared;
using GrandTheftMultiplayer.Shared.Math;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Essence.classes.commands
{
    class VehicleCommands : Script
    {
        public VehicleCommands() { }

        [Command("findvehicles")]
        public void cmdFindVehicles(Client player)
        {
            if (!API.hasEntityData(player, "Instance"))
            {
                return;
            }

            Player instance = (Player)API.getEntityData(player, "Instance");

            int count = 0;

            foreach (Vehicle vehInfo in instance.Vehicles)
            {
                API.triggerClientEvent(player, "Temp_Blip", API.getEntityPosition(vehInfo.VehicleHandle));
                count++;
            }

            API.sendChatMessageToPlayer(player, string.Format("~b~Essence: ~w~Found a total of {0} vehicles.", count));
        }

        public void ToggleEngine(Client player, params object[] arguments)
        {
            if (!player.isInVehicle)
            {
                return;
            }

            NetHandle playerVehicle = player.vehicle;

            if (player.vehicleSeat != -1)
            {
                return;
            }

            if (API.getVehicleEngineStatus(playerVehicle))
            {
                API.setVehicleEngineStatus(playerVehicle, false);
            } else
            {
                API.setVehicleEngineStatus(playerVehicle, true);
            }
        }

        public void ToggleHood(Client player, params object[] arguments)
        {
            if (!player.isInVehicle)
            {
                return;
            }

            NetHandle playerVehicle = player.vehicle;

            if (player.vehicleSeat != -1)
            {
                return;
            }

            if (API.getVehicleDoorState(playerVehicle, 4))
            {
                API.setVehicleDoorState(playerVehicle, 4, false);
            }
            else
            {
                API.setVehicleDoorState(playerVehicle, 4, true);
            }
        }

        public void ToggleTrunk(Client player, params object[] arguments)
        {
            if (!player.isInVehicle)
            {
                return;
            }

            NetHandle playerVehicle = player.vehicle;

            if (player.vehicleSeat != -1)
            {
                return;
            }

            if (API.getVehicleDoorState(playerVehicle, 5))
            {
                API.setVehicleDoorState(playerVehicle, 5, false);
            }
            else
            {
                API.setVehicleDoorState(playerVehicle, 5, true);
            }
        }

        public void ToggleDoor(Client player, params object[] arguments)
        {
            int door = Convert.ToInt32(arguments[0]);

            if (!player.isInVehicle)
            {
                return;
            }

            NetHandle playerVehicle = player.vehicle;

            if (player.vehicleSeat != -1)
            {
                return;
            }

            if (API.getVehicleDoorState(playerVehicle, door))
            {
                API.setVehicleDoorState(playerVehicle, door, false);
            }
            else
            {
                API.setVehicleDoorState(playerVehicle, door, true);
            }
        }

        public void WindowState(Client player, params object[] arguments)
        {
            bool status = Convert.ToBoolean(arguments[0]);
                
            if (!player.isInVehicle)
            {
                return;
            }

            NetHandle playerVehicle = player.vehicle;

            if (status)
            {
                API.sendNativeToPlayersInRange(player.position, 50f, (ulong)Hash.ROLL_DOWN_WINDOWS, playerVehicle);
            } else
            {
                API.sendNativeToPlayersInRange(player.position, 50f, (ulong)Hash.ROLL_UP_WINDOW, playerVehicle, 0);
                API.sendNativeToPlayersInRange(player.position, 50f, (ulong)Hash.ROLL_UP_WINDOW, playerVehicle, 1);
                API.sendNativeToPlayersInRange(player.position, 50f, (ulong)Hash.ROLL_UP_WINDOW, playerVehicle, 2);
                API.sendNativeToPlayersInRange(player.position, 50f, (ulong)Hash.ROLL_UP_WINDOW, playerVehicle, 3);
            }
        }
    }
}
