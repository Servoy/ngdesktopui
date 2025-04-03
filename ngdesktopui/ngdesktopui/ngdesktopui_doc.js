

/**
 * Add new menu to the menu bar
 * 
 * @param {String} text - menu text
 * @param {Number} [index] - menu insert position (zero based)
 * 
 * @return {Number} - the index of the added menu
 */
function addMenu(text, index) {
}
/**
 * Add Developer Tools menu to the menu bar
 * 
 * Use it just for debugging. Remove any call to this function once you're done.  
 * 
 * @return {Number} - the index of the added menu or -1 if nothing has changed
 */
function addDevToolsMenu() {
}
/**
 * Delete menu from the specified position from the menu bar
 * 
 * @param {Number} index - menu position to be deleted
 */
function removeMenu(index) {
}
/**
 * Return the menu text at the specified position.
 * 
 * @param {String} text - the text to query for
 * 
 * @return {Number} - menu index containing the specified text; if not found return -1
 */
function getMenuIndexByText(text) {
}
/**
 * Return the menu text from the specified menu position.
 * 
 * @param {Number} index The index to query for
 * 
 * @return {String} - menu's text; if index is out of range - null is returned
 */
function getMenuText(index) {
}

/**
 * Count menus from the menu bar.
 * 
 * @return {Number} The total number of menus currently present in the menu bar.
 */
function getMenuCount() {
}

/**
 * Cleanup the menubar. For MacOS that means to display a minimal menu
 */
function removeAllMenus() {
}
/**
 * Reset ngdesktop menu to default
 */
function resetMenuToDefault() {
}

/**
 * Show/hide menubar visibility. This function is working only on Windows/Linux
 * 
 * @param {Boolean} visible If true, the menu bar will be shown; if false, it will be hidden.
 */
function setMenuBarVisibility(visible) {
}

/**
 * Cleanup the specified menu
 * 
 * @param {Number} index - menu position
 * @param {Number} [itemIndex] - submenu index
 */
function removeAllMenuItems(index, itemIndex) {
}

/**
 * Add separator line to the specified menu
 * 
 * 
 * @param {Number} index - menu index
 * @param {Number} [position] - insert position
 * @param {Number} [itemIndex] - submenu index; when specified the position is relative to this submenu
 * 
 * @return {Number} - the index of the added separator
 */
function addSeparator(index, position, itemIndex) {
}

/**
 * Add menu items to existing menu.
 * NOTE: when adding an item to an existing menuitem, that menuitem will turn from type "normal" to type "submenu". If a callback has been set previously, that callback will no longer be called.
 * 
 * @param {Number} index - menu index
 * @param {String} text - menuitem text
 * @param {function} callback - callback function to call. The callback function will receive:
 * <ul>
 *   <li>text of the clicked item</li> 
 *   <li>type of the clicked item ("normal", "radio", "checkbox")</li>
 *   <li>checked value for checkboxes and radio buttons, otherwise undefined</li>
 * </ul>
 * @param {Number} [position] - insert position
 * @param {Number} [itemIndex] - submenu index; when specified the position is relative to this submenu
 * 
 * @return {Number} - the index of the added menu item
 */
function addMenuItem(index, text, callback, position, itemIndex) {
}

/**
 * Removes a menu item from an existing menu.
 * NOTE: when the last item from a submenu is removed, that submenu will turn from type "submenu" to type "normal". If a callback has been set previously for the item, that callback will be called from then on.
 * 
 * @param {Number} index - menu index
 * @param {Number} position - menuitem position to be removed
 * @param {Number} [itemIndex] - submenu index; when specified the position is relative to this submenu
 */
function removeMenuItem(index, position, itemIndex) {
}

/**
 * Count menu items for the specified menu
 * 
 * @param {Number} index - menu index
 * @param {Number} [itemIndex] - submenu index; when specified the submenu items will be count
 * 
 * @return {Number} The number of menu items in the specified menu or submenu.
 */
function getMenuItemsCount(index, itemIndex) {
}


/**
 * Add a checkbox to the specified menu.
 * NOTE: when adding the checkbox to an existing menuitem, that menuitem will turn from type "normal" to type "submenu". If a callback has been set previously, that callback will no longer be called.
 * 
 * @param {Number} index - menu index
 * @param {String} text - checkbox label
 * @param {function} callback - callback function to call. The callback function will receive:
 * <ul>
 *   <li>text of the clicked item</li> 
 *   <li>type of the clicked item ("normal", "radio", "checkbox")</li>
 *   <li>checked value for checkboxes and radio buttons, otherwise undefined</li>
 * </ul>
 * @param {Boolean} [checked] - checkbox initial status (unchecked by default)
 * @param {Number} [position] - insert position
 * @param {Number} [itemIndex] - submenu index; when specified the position is relative to this submenu
 * 
 * @return {Number} - the index of the added checkbox
 */
function addCheckBox(index, text, callback, checked, position, itemIndex) {
}
/**
 * Add a radio button to the specified menu.
 * 
 * NOTE: when adding the checkbox to an existing menuitem, that menuitem will turn from type "normal" to type "submenu". If a callback has been set previously, that callback will no longer be called.
 * NOTE: For the first added radio button in a group, the radio button will be selected ignoring the 'selected' param.
 * 
 * @param {Number} index - menu index
 * @param {String} text - checkbox label
 * @param {function} callback - callback function to call. The callback function will receive:
 * <ul>
 *   <li>text of the clicked item</li> 
 *   <li>type of the clicked item ("normal", "radio", "checkbox")</li>
 *   <li>checked value for checkboxes and radio buttons, otherwise undefined</li>
 * </ul>
 * @param {Boolean} [selected] - initial selected status
 * @param {Number} [position] - insert position
 * @param {Number} [itemIndex] - submenu index; when specified the position is relative to this submenu
 * 
 * @return {Number} - the index of the added radio button
 */
function addRadioButton(index, text, callback, selected, position, itemIndex) {
}
/**
 * Add a menuitem with standard native system behavior. 
 * For a complete list of allowed values see: https://github.com/Servoy/ngdesktopui
 * 
 * @param {Number} index - menu index
 * @param {String} role - item role. 
 * @param {String} [text] - menuitem text; when not specified the System will provide a standard (localized) one
 * @param {Number} [position] - insert position; when role is a predefined menu, this parameter is ignored;
 * @param {Number} [itemIndex] - submenu index; when specified the position is relative to this submenu; when role is a predefined menu this parameter is ignored
 * 
 * @return {Number} - the index of the added role item
 * 
 */
function addRoleItem(index, role, text, position, itemIndex) {
}

/**
 * Get menuitem index from the specified menu
 * 
 * @param {Number} index - menu index
 * @param {String} text - menuitem text to query for index
 * 
 * @return {Number} The index of the menu item with the specified text, or -1 if not found.
 */
function getMenuItemIndexByText(index, text) {
}

/**
 * Get menuitem text from the specified menu
 * 
 * @param {Number} index - menu index
 * @param {Number} itemIndex - menuitem index to query for text
 * 
 * @return {String} The text of the specified menu item, or null if the index is out of range.
 */
function getMenuItemText(index, itemIndex) {
}

/**
 * Creates a BrowserView (looks like an iframe) and adds this to the current window at the given coordinates with the given width and height.
 * It returns and id that can be used to close/clean up this view later on, or to target that view to inject some javascript.
 *  
 * @param {Number} x - the X coordinate to position this view
 * @param {Number} y - the Y coordinate to position this view
 * @param {Number} width - the width of this view
 * @param {Number} height - the height of this view
 * @param {String} url - the url to load into this view
 * @return {Number} the id to target this view later on.
 */
function createBrowserView(x,y,width,height,url) {
}
/**
 * Closes a and destroys a previously created BrowserView by the given id.
 * 
 * @param {Number} id - the id of the view to close.
 */
function closeBrowserView(id) {
}
/**
 * Injects the given javascript into the content of the BrowserView of the given id.
 * The javascript can be a function declaration that is then called later on.
 * The last statement return value is given back to the callback as a first argument.
 * If something goes wrong then the callback is called where the first argument is null and a second argument has the message of the exception.
 * 
 * @example
 * // open google.com<br/>
 * var id = plugins.ngdesktopui.createBrowserView(100,200,700,500,"https://www.google.com/");<br/>
 * // get the value of the search field and return this.<br/>
 * plugins.ngdesktopui.injectJSIntoBrowserView(id, "function test() { return document.getElementsByName('q')[0].value};test();", callback);
 * 
 * @param {Number} id - the id of the view to execute javascript in.
 * @param {String} js - the piece of javascript that is injected into this view.
 * @param {function} callback - the callback function that is used to get the results or exception if the call fails.
 */
function injectJSIntoBrowserView(id, js, callback) {
}
/**
 * Get the zoom factor of the current window
 *
 * @return {Number} The zoom factor of the current window
 */
function getZoomFactor () {
}

/**
 * Set the zoom factor of the current window
 * 1 == 100%. 0.5 == 50%.
 *
 * @param {Number} factor (values greater than 0.0 and smaller or equal to 5.0)
 * @return {Boolean} True if the zoom factor was successfully set; otherwise, false.
 */
function setZoomFactor (factor) {
}

/**
 * Show and gives focus to the window
 */
function showWindow () {
}
/**
 * Hide the window
 */
function hideWindow () {
}
/**
 * Maximize the window
 */
function maximizeWindow () {
}
/**
 * Unmaximize the window
 */
function unmaximizeWindow () {
}
/**
 * Minimize the window
 */
function minimizeWindow () {
}
/**
 * Restore the window
 */
function restoreWindow () {
}
/**
 * Set window size to the specified dimensions
 * 
 * @param {Number} width Integer value greater than zero
 * @param {Number} height Integer value greater than zero
 */
function setWindowSize(width, height) {
}
/**
 * Set window to full screen mode
 * 
 * @param {Boolean} flag If true, sets the window to full-screen mode; if false, exits full-screen mode.
 */
function setFullScreen(flag) {
}

/**
 * Get window size 
 * 
 * @return {Array<Number>} - an array containing window's width and height
 */
function getWindowSize() {
}

/**
 * Return true if window is in minimized state
 * 
 * @return {Boolean} True if the window is currently minimized; otherwise, false.
 */
function isMinimized() {
}

/**
 * Return true if window is in maximized state
 * 
 * @return {Boolean} True if the window is currently maximized; otherwise, false.
 */
function isMaximized() {
}

/**
 * Return true if window is in full screen state
 * 
 * @return {Boolean} True if the window is currently in full-screen mode; otherwise, false.
 */
function isFullScreen() {
}

/**
 * Return true whether the window is in normal state (not maximized, not minimized, not in fullscreen mode)
 * 
 * @return {Boolean} True if the window is in its default (normal) state; otherwise, false.
 */
function isNormal() {
}

/**
 * Return true if window is in visible to the user
 * 
 * @return {Boolean} True if the window is currently visible to the user; otherwise, false.
 */
function isVisible() {
}

/**
 * Register callback to be executed before closing ngdesktop
 * 
 * @param {function} callback - function to be executed before closing ngdesktop. Must return a boolean value: true if ngdesktop will close; false if ngdesktop will not close
 * @return {Boolean} - whether function executed succesfully or not
 */
function registerOnCloseMethod(callback){
}

/**
 * Unregister the callback to be executed before closing ngdesktop.
 */ 
function unregisterOnCloseMethod(){
}

/**
 * Set the way external links will be handled from ngdesktop.
 * When the flag parameter is set to:
 *  - true: open external links using OS default browser
 *  - false: open external links using a new ngdesktop window
 * 
 * @param {Boolean} flag If true, external links will open in the OS default browser; if false, they will open in a new ngdesktop window.
 */
function useDefaultBrowserForExternalLinks(flag) {
}

//the server script side is sending the callback name and server (ServoyFunctionPropertyType class) is
//adding missing parts (formname and script). Adding tray items with no callback associated (separator and role) - somewhere on the
//road the association between tray itemms and callbacks is lost (all callbacks get into 'undefined' after sending the menu to electron. 
//Can't spot any menu difference for the items with callbacks in these situations (may be an electron issue?)
//Recreating fully the template at the client side - is solving the problem. 
//Further investigations needed.
function done() {//internal api

}

/**
 * Creates a system tray menu for the application. 
 * The tray menu allows users to interact with the application via a small icon in the system tray.
 * 
 * @example
 * // Create a tray menu with custom options
 * var trayMenu = plugins.ngdesktopui.createTrayMenu();
 * trayMenu.title = "My App";
 * trayMenu.tooltip = "Application is running";
 * trayMenu.icon = plugins.file.readFile('media:///tray_icon.png');
 * trayMenu.trayMenuItems = [
 *     { label: "Open", type: "normal", click: function() { application.showForm('mainForm'); } },
 *     { label: "Exit", type: "normal", click: function() { application.exit(); } }
 * ];
 *
 * @return {CustomType<ngdesktopui.trayMenu>}  The tray menu object that can be customized with title, tooltip, icon, and menu items.
 */
function createTrayMenu() {
}

var svy_types = {
    
    /**
     * Represents a Tray Menu.
     * Contains properties for setting the tray menu's title, tooltip, and icons.
     */
    trayMenu: {
        /**
         * The title displayed on the tray menu.
         */
        title: null,
        
        /**
         * The tooltip text displayed when hovering over the tray menu.
         */
        tooltip: null,
        
        /**
         * The icon image data for the tray menu.
         */
        icon: null,
        
        /**
         * The icon image data displayed when the tray menu is pressed.
         */
        pressedIcon: null
        // Note: 'trayMenuItems' is private and is not documented here.
    },
    
    /**
     * Represents a Tray Menu Item.
     * Defines the properties for an individual item within a tray menu.
     */
    trayMenuItem: {
        /**
         * The label text for the tray menu item.
         */
        label: null,
        
        /**
         * The type of the tray menu item (e.g., "normal", "separator").
         */
        type: null,
        
        /**
         * The role associated with the tray menu item.
         */
        role: null,
        
        /**
         * Indicates whether the tray menu item is checked (for checkbox or radio items).
         */
        checked: null,
        
        /**
         * The callback function to be executed when the tray menu item is clicked.
         */
        click: null
    }
};
