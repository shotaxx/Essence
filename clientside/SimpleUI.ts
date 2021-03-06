﻿// Default sizes.
var height = 50;
var width = 500;
var headerHeight = 100;
// Current Menu Draw
var contentHolder: ContentHolder = null;

API.onKeyDown.connect((sender, e) => {
    if (contentHolder === null) {
        return;
    }

    if (e.KeyCode == Keys.W || e.KeyCode == Keys.Up) {
        contentHolder.scrollDown();
        API.playSoundFrontEnd("NAV_UP_DOWN", "HUD_FRONTEND_DEFAULT_SOUNDSET");
    }

    if (e.KeyCode == Keys.S || e.KeyCode == Keys.Down) {
        contentHolder.scrollUp();
        API.playSoundFrontEnd("NAV_UP_DOWN", "HUD_FRONTEND_DEFAULT_SOUNDSET");
    }

    if (e.KeyCode == Keys.Enter || e.KeyCode == Keys.F) {
        contentHolder.ContentItems[contentHolder.CurrentSelection].runSelectFunction();
        API.playSoundFrontEnd("SELECT", "HUD_FRONTEND_DEFAULT_SOUNDSET");
    }

    if (e.KeyCode == Keys.A || e.KeyCode == Keys.Left) {
        contentHolder.ContentItems[contentHolder.CurrentSelection].previousContent();
        
    }

    if (e.KeyCode == Keys.D || e.KeyCode == Keys.Right) {
        contentHolder.ContentItems[contentHolder.CurrentSelection].nextContent();
    }
});

API.onUpdate.connect(() => {
    if (contentHolder != null) {
        API.disableAllControlsThisFrame();
        contentHolder.draw();
    }
});

// Return a ContentHolder for a menu.
function setupContent() {
    contentHolder = new ContentHolder();
    return contentHolder;
}
// Get the current content holder as a return.
function getContentHolder() {
    return contentHolder;
}
// Clear Menu
function clearContent() {
    contentHolder = null;
}

class ContentHolder {
    private point: Point;
    private contentHeader: ContentHeader;
    private contentItems: Array<ContentItem>;
    private currentSelection: number;
    private isReady: boolean;
    constructor(point: Point = new Point(0, 0)) {
        this.point = point;
        this.contentHeader = null;
        this.contentItems = new Array<ContentItem>();
        this.currentSelection = 0;
        this.isReady = false;
    }
    draw() {
        if (!this.isReady) {
            return;
        }

        if (this.contentHeader != null) {
            this.contentHeader.draw();
        }

        if (this.contentItems.length <= 0) {
            return;
        }

        if (this.contentItems.length >= 10) {
            if (this.currentSelection + 10 >= this.contentItems.length) {
                this.drawToMaximum();
            } else {
                this.drawToAmount(10);
            }
        } else {
            this.drawAll();
        }
    }
    set IsReady(value: boolean) {
        this.isReady = value;
    }
    private drawAll() {
        for (var i = 0; i < this.contentItems.length; i++) {
            if (i === this.currentSelection) {
                this.contentItems[i].draw(i + 1);
                this.contentItems[i].IsSelected = true;
            } else {
                this.contentItems[i].draw(i + 1);
                this.contentItems[i].IsSelected = false;
            }
        }
    }
    private drawToMaximum() {
        for (var i = this.contentItems.length - 10; i < this.contentItems.length; i++) {
            if (i === this.currentSelection) {
                this.contentItems[i].draw(i - this.contentItems.length + 11);
                this.contentItems[i].IsSelected = true;
            } else {
                this.contentItems[i].draw(i - this.contentItems.length + 11);
                this.contentItems[i].IsSelected = false;
            }
        }
    }
    private drawToAmount(amount: number) {
        for (var i = this.currentSelection; i < this.currentSelection + 10; i++) {
            if (i === this.currentSelection) {
                this.contentItems[i].draw(1);
                this.contentItems[i].IsSelected = true;
            } else {
                this.contentItems[i].draw(i - this.currentSelection + 1);
                this.contentItems[i].IsSelected = false;
            }
        }
    }
    public createHeader() {
        this.contentHeader = new ContentHeader(this);
        return this.contentHeader;
    }
    public addItem(itemName: string) {
        var contentItem: ContentItem = new ContentItem(this, itemName);
        this.contentItems.push(contentItem);
        return contentItem;
    }
    public scrollDown() {
        if (this.currentSelection <= 0) {
            this.currentSelection = this.contentItems.length - 1;
        } else {
            this.currentSelection -= 1;
        }
        this.contentItems[this.currentSelection].runHoverFunction();
    }
    public scrollUp() {
        if (this.currentSelection + 1 >= this.contentItems.length) {
            this.currentSelection = 0;
        } else {
            this.currentSelection += 1;
        }
        this.contentItems[this.currentSelection].runHoverFunction();
    }
    get CurrentSelection(): number {
        return this.currentSelection;
    }
    get Point(): Point {
        return this.point;
    }
    get ContentItems(): Array<ContentItem> {
        return this.contentItems;
    }
}

class ContentHeader {
    private contentHolder: ContentHolder;
    private path: string;
    private dict: string;
    private texture: string;
    constructor(contentHolder: ContentHolder) {
        this.contentHolder = contentHolder;
        this.path = null;
        this.dict = null;
        this.texture = null;
    }
    // Set the header a png or jpg.
    public setLocalImage(path: string) {
        this.path = path;
    }
    // Set the header to a game texture.
    public setGameTexture(dict: string, texture: string) {
        this.dict = dict;
        this.texture = texture;
    }
    draw() {
        if (this.dict != null && this.texture != null) {
            API.drawGameTexture(this.dict, this.texture, this.contentHolder.Point.X, this.contentHolder.Point.Y, width, headerHeight, 0, 255, 255, 255, 255);
        }

        if (this.path != null) {
            API.dxDrawTexture(this.path, this.contentHolder.Point, new Size(width, headerHeight), 0);
        }
    }
}

class ContentItem {
    private itemName: string;
    private itemPrice: string;
    private color: Array<number>;
    private id: number;
    private contentHolder: ContentHolder;
    private isSelected: boolean;
    private hoverFunction: FunctionHolder;
    private selectFunction: FunctionHolder;
    private description: string;
    private isVariedContent: boolean;
    private variedContents: Array<ContentItem>;
    private currentSelection: number;
    constructor(contentHolder: ContentHolder, itemName: string) {
        this.contentHolder = contentHolder;
        this.itemName = itemName;
        this.itemPrice = "-1";
        this.color = [255, 255, 255];
        this.id = null;
        this.isSelected = false;
        this.getID();
        this.hoverFunction = null;
        this.selectFunction = null;
        this.description = null;
        this.isVariedContent = false;
        this.variedContents = new Array<ContentItem>();
        this.currentSelection = 0;
    }
    // Get the ID of this item.
    private getID() {
        this.id = this.contentHolder.ContentItems.length + 1;
    }
    // Used to turn on left and right scrolling, and add new items. Returns the item you just added.
    public addVariedContentItem(contentHolder: ContentHolder, itemName: string) {
        if (!this.isVariedContent) {
            this.itemName = `< ${this.itemName} >`
        }
        var item: ContentItem = new ContentItem(contentHolder, itemName);
        this.isVariedContent = true;
        this.variedContents.push(item);
        return item;
    }
    // Next content display.
    public nextContent() {
        if (!this.isVariedContent) {
            return;
        }

        API.playSoundFrontEnd("NAV_UP_DOWN", "HUD_FRONTEND_DEFAULT_SOUNDSET");
        if (this.currentSelection + 1 > this.variedContents.length) {
            this.currentSelection = 0;
        } else {
            this.currentSelection += 1;
        }

        this.setTextToCurrentContent();
        this.runVariedHoverFunction();
    }
    // Previous content display.
    public previousContent() {
        if (!this.isVariedContent) {
            return;
        }

        API.playSoundFrontEnd("NAV_UP_DOWN", "HUD_FRONTEND_DEFAULT_SOUNDSET");
        if (this.currentSelection - 1 <= -1) {
            this.currentSelection = this.variedContents.length;
        } else {
            this.currentSelection -= 1;
        }

        this.setTextToCurrentContent();
        this.runVariedHoverFunction();
    }
    //
    public runVariedHoverFunction() {
        this.variedContents[this.currentSelection].runHoverFunction();
    }
    // Set the text from other content.
    private setTextToCurrentContent() {
        this.itemName = `< ${this.variedContents[this.currentSelection].Text} >`
    }
    // Is this item currently selected?
    set IsSelected(value: boolean) {
        this.isSelected = value;
    }
    // Set the item price of this item.
    set ItemPrice(value: string) {
        this.itemPrice = value;
    }
    // Used to draw the text, images, etc.
    draw(currentOffset: number) {
        this.drawText(currentOffset);
        this.drawBackground(currentOffset);
    }
    // Used for hovering.
    runHoverFunction() {
        if (this.hoverFunction != null) {
            this.hoverFunction.run();
        }
    }
    // Used when the F or Enter key is pressed.
    runSelectFunction() {
        if (this.selectFunction != null) {
            this.selectFunction.run();
        }

        if (this.isVariedContent) {
            if (this.variedContents[this.currentSelection].selectFunction != null) {
                this.variedContents[this.currentSelection].runSelectFunction();
            }
        }
    }
    // Current Selection
    set CurrentSelection(value: number) {
        this.currentSelection = value;
    }
    // Used to set the text color.
    public setTextColor(r: number, g: number, b: number) {
        this.color = [r, g, b];
    }
    // Attach a FunctionHolder to this Item. Fires when it gets hovered.
    set HoverFunction(value: FunctionHolder) {
        this.hoverFunction = value;
    }
    // Attach a description to this Item
    set Description(value: string) {
        this.description = value;
    }
    // Attach a selective FunctionHolder to this item. Fires when the action key is pressed.
    set SelectFunction(value: FunctionHolder) {
        this.selectFunction = value;
    }
    // Get Text
    get Text(): string {
        return this.itemName;
    }
    // Get Price
    get Price(): string {
        return this.itemPrice;
    }
    // Draw the background.
    private drawBackground(currentOffset: number) {
        if (this.isSelected) {
            API.drawRectangle(this.contentHolder.Point.X, headerHeight + (height * currentOffset) - height, width, height, 255, 255, 255, 150);
        } else {
            API.drawRectangle(this.contentHolder.Point.X, headerHeight + (height * currentOffset) - height, width, height, 0, 0, 0, 150);
        }
    }
    // DRaw the text.
    private drawText(currentOffset) {
        if (this.isSelected) {
            API.drawText(this.itemName, this.contentHolder.Point.X + 10, headerHeight + Math.round(height * currentOffset) - (Math.round(height / 2)) - 12, 0.4, 0, 0, 0, 255, 4, 0, false, false, 500);
        } else {
            API.drawText(this.itemName, this.contentHolder.Point.X + 10, headerHeight + Math.round(height * currentOffset) - (Math.round(height / 2)) - 12, 0.4, this.color[0], this.color[1], this.color[2], 255, 4, 0, false, false, 500);
        }

        if (this.itemPrice != "-1") {
            API.drawText("$" + this.itemPrice, width - 30, headerHeight + Math.round(height * currentOffset) - (Math.round(height / 2)) - 12, 0.4, this.color[0], this.color[1], this.color[2], 255, 4, 1, false, false, 500);
        }

        this.drawDescription();
    }
    // Draw the description text.
    private drawDescription() {
        if (!this.isSelected) {
            return;
        }

        if (this.description != null) {
            API.drawText(this.description, this.contentHolder.Point.X + 10, headerHeight + Math.round(height * 10) + 12, 0.4, this.color[0], this.color[1], this.color[2], 255, 4, 0, false, false, 500);
            API.drawRectangle(this.contentHolder.Point.X, headerHeight + Math.round(height * 10), width, height, 0, 0, 0, 200);
        }
    }

    public getHoverFunction() {
        this.hoverFunction = new FunctionHolder();
        return this.hoverFunction;
    }

    public getSelectFunction() {
        this.selectFunction = new FunctionHolder();
        return this.selectFunction;
    }
}

class FunctionHolder {
    private localFunction: any;
    private localArgs: any[];
    constructor() {
        this.localFunction = null;
        this.localArgs = null;
    }

    set Function(value: any) {
        this.localFunction = value;
    }

    set Args(value: Array<any>) {
        this.localArgs = value;
    }

    run() {
        if (this.localFunction != null) {
            if (this.localArgs != null) {
                this.localFunction(this.localArgs);
            } else {
                this.localFunction();
            }
        }
    }
}