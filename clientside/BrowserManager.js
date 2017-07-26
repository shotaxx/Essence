var resX = API.getScreenResolutionMaintainRatio().Width;
var resY = API.getScreenResolutionMaintainRatio().Height;
var res = API.getScreenResolutionMaintainRatio();
var cef = null; // Main CEF Page
// Main CEFHelper Class.
var CefHelper = (function () {
    // Main Constructor - Requires the Path of the CEF File or HTML File or whatever.
    function CefHelper(resourcePath) {
        this.path = resourcePath;
        this.open = false;
    }
    // Displays the HTML File we pushed up.
    CefHelper.prototype.show = function () {
        if (this.open == false) {
            this.open = true;
            var resolution = API.getScreenResolution();
            this.browser = API.createCefBrowser(resolution.Width, resolution.Height, true);
            API.waitUntilCefBrowserInit(this.browser);
            API.setCefBrowserPosition(this.browser, 0, 0);
            API.loadPageCefBrowser(this.browser, this.path);
            API.showCursor(true);
            API.setCanOpenChat(false);
            API.setHudVisible(false);
            API.setChatVisible(false);
        }
    };
    CefHelper.prototype.showNonLocal = function () {
        if (this.open == false) {
            this.open = true;
            var resolution = API.getScreenResolution();
            this.browser = API.createCefBrowser(resolution.Width, resolution.Height, false);
            API.waitUntilCefBrowserInit(this.browser);
            API.setCefBrowserPosition(this.browser, 0, 0);
            API.loadPageCefBrowser(this.browser, this.path);
            API.showCursor(true);
            API.setCanOpenChat(false);
            API.setHudVisible(false);
            API.setChatVisible(false);
        }
    };
    // Destroys the CEF Browser.
    CefHelper.prototype.destroy = function () {
        this.open = false;
        API.destroyCefBrowser(this.browser);
        API.showCursor(false);
        API.setCanOpenChat(true);
        API.setHudVisible(true);
        API.setChatVisible(true);
    };
    // No idea what the fuck this does.
    CefHelper.prototype.eval = function (string) {
        this.browser.eval(string);
    };
    return CefHelper;
}());
// Destroy the CEF Panel if the user disconnects. That way we don't fucking destroy their game and aliens invade and shit.
API.onResourceStop.connect(function () {
    if (cef !== null) {
        cef.destroy();
        cef = null;
    }
    API.setHudVisible(true);
});
// Destroy any active CEF Panel.
function killPanel() {
    if (cef !== null) {
        cef.destroy();
        cef = null;
    }
}
// Show page, literally any fuggin path.
function showCEF(path) {
    if (cef !== null) {
        cef.destroy();
    }
    cef = null;
    cef = new CefHelper(path);
    cef.show();
}
// Show page, non-local version.
function showNonLocalCEF(path) {
    if (cef !== null) {
        cef.destroy();
    }
    cef = null;
    cef = new CefHelper(path);
    cef.showNonLocal();
}
// Browser Function Handler
function callCEF(func, args) {
    if (cef === null) {
        return;
    }
    cef.browser.call(func, args);
}
//=========================================
// LOGIN / REGISTRATION EVENTS - LoginHandler.cs
//=========================================
function Login(username, password) {
    API.triggerServerEvent("clientLogin", username, password);
}
function Register(username, password) {
    API.triggerServerEvent("clientRegister", username, password);
}
//# sourceMappingURL=BrowserManager.js.map