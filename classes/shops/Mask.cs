﻿using Essence.classes.utility;
using GTANetworkServer;
using GTANetworkShared;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Essence.classes
{
    class MaskInfo : Script
    {
        private Vector3 location;

        public MaskInfo() { }

        public MaskInfo(Vector3 loc)
        {
            location = loc;
            generatePoint();
        }

        private void generatePoint()
        {
            PointInfo point = PointHelper.addNewPoint();
            point.Position = location;
            point.BlipColor = 3;
            point.BlipType = 362;
            point.Text = "Mask Shop";
            point.DrawLabel = true;
            point.ID = "SHOP_MASK";
            point.InteractionEnabled = true;
        }

        public Vector3 Location
        {
            set
            {
                location = value;
            }
            get
            {
                return location;
            }
        }
    }

    class Mask : Script
    {
        private List<MaskInfo> maskInfos;
        private List<Vector3> locations;

        /** Returns a list of Masks. */
        public List<MaskInfo> Masks
        {
            get
            {
                return maskInfos;
            }
        }

        public Mask()
        {
            locations = new List<Vector3>();
            maskInfos = new List<MaskInfo>();
            API.onResourceStart += API_onResourceStart;
        }

        private void API_onResourceStart()
        {
            loadLocations();
            setupLocations();
        }

        private void loadLocations()
        {
            locations = Utility.pullLocationsFromFile("resources/Essence/data/masks.txt");
        }

        private void setupLocations()
        {
            int count = 0;

            foreach (Vector3 location in locations)
            {
                MaskInfo mask = new MaskInfo(location);
                maskInfos.Add(mask);
                count++;
            }

            API.consoleOutput(string.Format("Added {0} Mask stores.", count));
        }

        public void startMaskShop(Client player)
        {
            API.sendChatMessageToPlayer(player, "~b~Essence: ~r~Fire Mask shop code!.");
            API.triggerClientEvent(player, "OpenMaskShop");
        }
    }

    }