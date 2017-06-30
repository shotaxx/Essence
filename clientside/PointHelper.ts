﻿var list: BlipTextPoint[] = new Array<BlipTextPoint>();
var keyboardPath = "clientside/images/keyboard_e.png";
var actionCooldown: number = Date.now() + 3000;

class BlipTextPoint {
    private position: Vector3;
    private type: number;
    private color: number;
    private text: string;
    private draw: boolean;
    private blip: any;
    private id: any;
    private interactable: boolean;
    private blipEnabled: boolean;
    constructor(position, type, color, text, draw, id, interactable, blipEnabled) {
        this.position = position;
        this.type = type;
        this.color = color;
        this.text = text;
        this.draw = draw;
        this.id = id;
        this.interactable = interactable;
        if (blipEnabled) {
            this.blip = API.createBlip(this.position);
            API.setBlipSprite(this.blip, this.type);
            API.setBlipColor(this.blip, this.color);
            API.setBlipShortRange(this.blip, true);
            API.setBlipName(this.blip, this.text);
        }
    }

    run() {
        if (!this.draw) {
            return;
        }

        var point = Point.Round(API.worldToScreenMantainRatio(this.position.Add(new Vector3(0, 0, 2))));
        if (point.X <= 0 && point.Y <= 0) {
            return;
        }

        API.drawText(this.text, point.X, point.Y - 20, 0.5, 255, 255, 255, 255, 4, 1, true, true, 600);
        if (this.interactable) {
            API.dxDrawTexture(keyboardPath, new Point(point.X - 25, point.Y + 40), new Size(50, 50), 0, 255, 255, 255, 255);
        }
    }

    set Text(value: string) {
        this.text = value;
    }

    get Position(): Vector3 {
        return this.position;
    }

    get Blip(): any {
        return this.blip;
    }

    get ID(): any {
        return this.id;
    }

    get Interactable(): boolean {
        return this.interactable;
    }

    // Used to interact with pretty much everything ever.
    triggerServerEvent() {
        API.triggerServerEvent(this.id);
    }
}

API.onUpdate.connect(() => {
    if (list.length <= 0) {
        return;
    }

    var playerPos = API.getEntityPosition(API.getLocalPlayer());
    drawText();
});

// Draws the text if the player is near it.
function drawText() {
    var playerPos = API.getEntityPosition(API.getLocalPlayer());
    for (var i = 0; i < list.length; i++) {
        if (list[i].Position.DistanceTo(playerPos) <= 10) {
            list[i].run();
        }
    }
}

// Adds a new point to the list.
function addNewPoint(position, type, color, text, draw, id, interactable, blipEnabled) {
    var newPoint = new BlipTextPoint(position, type, color, text, draw, id, interactable, blipEnabled);
    list.push(newPoint);
}

function updateStashPoint(id, newText: string) {
    for (var i = 0; i < list.length; i++) {
        if (list[i].ID == id) {
            list[i].Text = newText;
            break;
        }
    }
}

function checkIfNearPointOnce() {
    var playerPos = API.getEntityPosition(API.getLocalPlayer());
    if (Date.now() > actionCooldown) {
        actionCooldown = Date.now() + 3000;
        for (var i = 0; i < list.length; i++) {
            if (!list[i].Interactable) {
                continue;
            }

            if (list[i].Position.DistanceTo(playerPos) <= 5) {
                list[i].triggerServerEvent();
                return;
            }
        }
    }
    
}