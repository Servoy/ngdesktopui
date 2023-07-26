
/**
 * Add new menu to the menu bar
 * 
 * @param {string} text - menu text
 * @param {int} [index] - menu insert position (zero based)
 * 
 * @return {int} - the index of the added menu
 */
function addMenu(text, index) {
}
/**
 * Add Developer Tools menu to the menu bar
 * 
 * Use it just for debugging. Remove any call to this function once you're done.  
 * 
 * @return {int} - the index of the added menu or -1 if nothing has changed
 */
function addDevToolsMenu() {
}
/**
 * Delete menu from the specified position from the menu bar
 * 
 * @param {int} index - menu position to be deleted
 */
function removeMenu(index) {
}
/**
 * Return the menu text at the specified position.
 * 
 * @param (string) text - the text to query for
 * 
 * @return {int} - menu index containing the specified text; if not found return -1
 */
function getMenuIndexByText(text) {
}
/**
 * Return the menu text from the specified menu position.
 * 
 * @param {int} position to query for
 * 
 * @return {string} - menu's text; if index is out of range - null is returned
 */
function getMenuText(index) {
}
/**
 * Count menus from the menu bar.
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
 */
function setMenuBarVisibility(visible) {
}
/**
 * Cleanup the specified menu
 * 
 * @param {int} index - menu position
 * @param {int} [itemIndex] - submenu index
 */
function removeAllMenuItems(index, itemIndex) {
}
/**
 * Add separator line to the specified menu
 * 
 * 
 * @param {int} index - menu index
 * @param {int} [position] - insert position
 * @param {int} [itemIndex] - submenu index; when specified the position is relative to this submenu
 * 
 * @return {int} - the index of the added separator
 */
function addSeparator(index, position, itemIndex) {
}
/**
 * Add menu items to existing menu.
 * 
 * @param {int} index - menu index
 * @param {string} text - menuitem text
 * @param {function} callback - callback function to call
 *                   The callback function will receive:
 *                       - text of the clicked item 
 *                       - type of the clicked item ("normal", "radio", "checkbox")
 *                       - checked value for checkboxes and radio buttons, otherwise undefined
 * @param {int} [position] - insert position
 * @param {int} [itemIndex] - submenu index; when specified the position is relative to this submenu
 * 
 * @return {int} - the index of the added menu item
 * 
 * Note: when add an item to an existing menuitem, that menuitem will get from type "normal" to type "submenu". 
 *       If previously a callback has been set, that callback will no longer be called
 */
function addMenuItem(index, text, callback, position, itemIndex) {
}
/**
 * Remove menu item from existing menu.
 * 
 * @param {int} index - menu index
 * @param {int} position - menuitem position to be removed
 * @param {int} [itemIndex] - submenu index; when specified the position is relative to this submenu
 * 
 * Note: when the last item from a submenu it is removed that submenu will get from type "submenu" to type "normal". 
 *       If previously a callback has been set for the item, that callback will be called further
 */
function removeMenuItem(index, position, itemIndex) {
}
/**
 * Count menu items for the specified menu
 * 
 * @param {int} index - menu index
 * @param (int) [itemIndex] - submenu index; when specified the submenu items will be count
 */
function getMenuItemsCount(index, itemIndex) {
}


/**
 * Add checkbox to the specified menu
 * 
 * 
 * @param {int} index - menu index
 * @param {string} text - checkbox label
 * @param {function} callback - callback function to call
 *                   The callback function will receive:
 *                       - text of the clicked item 
 *                       - type of the clicked item ("normal", "radio", "checkbox")
 *                       - checked value for checkboxes and radio buttons, otherwise undefined
 * @param {boolean} [checked] - checkbox initial status (unchecked by default)
 * @param {int} [position] - insert position
 * @param {int} [itemIndex] - submenu index; when specified the position is relative to this submenu
 * 
 * @return {int} - the index of the added checkbox
 * 
 * Note: when add the checkbox to an existing menuitem, that menuitem will get from type "normal" to type "submenu". 
 *       If previously a callback has been set, that callback will no longer be called
 */
function addCheckBox(index, text, callback, checked, position, itemIndex) {
}
/**
 * Add radio button to the specified menu
 * 
 * @param {int} index - menu index
 * @param {string} text - checkbox label
 * @param {function} callback - callback function to call
 *                   The callback function will receive:
 *                       - text of the clicked item 
 *                       - type of the clicked item ("normal", "radio", "checkbox")
 *                       - checked value for checkboxes and radio buttons, otherwise undefined
 * @param {boolean} [selected] - initial selected status
 * @param {int} [position] - insert position
 * @param {int} [itemIndex] - submenu index; when specified the position is relative to this submenu
 * 
 * @return {int} - the index of the added radio button
 * 
 * Note: when add the checkbox to an existing menuitem, that menuitem will get from type "normal" to type "submenu". 
 *       If previously a callback has been set, that callback will no longer be called
 * Note: For the first added radio button in a group, the radio button is selected regardless the selected param
 */
function addRadioButton(index, text, callback, selected, position, itemIndex) {
}
/**
 * Add a menuitem with standard native system behavior. 
 * For complete allowed value list: https://github.com/Servoy/ngdesktopui
 * 
 * @param {int} index - menu index
 * @param {string} role - item role. 
 * @param {string} [text] - menuitem text; when not specified the System will provide a standard (localized) one
 * @param {int} [position] - insert position; when role is a predefined menu, this parameter is ignored;
 * @param {int} [itemIndex] - submenu index; when specified the position is relative to this submenu; when role is a predefined menu this parameter is ignored
 * 
 * @return {int} - the index of the added role item
 * 
 */
function addRoleItem(index, role, text, position, itemIndex) {
}
/**
 * Get menuitem index from the specified menu
 * 
 * @param {int} index - menu index
 * @param {string} text - menuitem text to query for index
 */
function getMenuItemIndexByText(index, text) {
}
/**
 * Get menuitem text from the specified menu
 * 
 * @param {int} index - menu index
 * @param {int} itemIndex - menuitem index to query for text
 */
function getMenuItemText(index, itemIndex) {
}
/**
 * Creates a BrowserView (looks like an iframe) and adds this to the current window at the given coordinates with the given width and height.
 * It returns and id that can be used to close/clean up this view later on, or to target that view to inject some javascript.
 *  
 * @param {int} x - the X coordinate to position this view
 * @param {int} y - the Y coordinate to position this view
 * @param {int} width - the width of this view
 * @param {int} height - the height of this view
 * @param {string} url - the url to load into this view
 * @return {int} the id to target this view later on.
 */
function createBrowserView(x,y,width,height,url) {
}
/**
 * Closes a and destroys a previously created BrowserView by the given id.
 * 
 * @param {int} id - the id of the view to close.
 */
function closeBrowserView(id) {
}
/**
 * Injects the given javascript into the content of the BrowserView of the given id.
 * The javascript can be a function declaration that is then called later on.
 * The last statement return value is given back to the callback as a first argument.
 * If something goes wrong then the callback is called where the first argument is null and a second argument has the message of the exception.
 * 
 * @sample
 * // open google.com<br/>
 * var id = plugins.ngdesktopui.createBrowserView(100,200,700,500,"https://www.google.com/");<br/>
 * // get the value of the search field and return this.<br/>
 * plugins.ngdesktopui.injectJSIntoBrowserView(id, "function test() { return document.getElementsByName('q')[0].value};test();", callback);
 * 
 * @param {int} id - the id of the view to execute javascript in.
 * @param {string} js - the piece of javascript that is injected into this view.
 * @param {function} callback - the callback function that is used to get the results or exception if the call fails.
 */
function injectJSIntoBrowserView(id, js, callback) {
}
/**
 * Get the zoom factor of the current window
 *
 * @return {number} The zoom factor of the current window
 */
function getZoomFactor () {
}
/**
 * Set the zoom factor of the current window
 * 1 == 100%. 0.5 == 50%.
 *
 * @param {number} factor (values greater than 0.0 and smaller or equal to 5.0)
 * @return {boolean}
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
function  minimizeWindow () {
}
/**
 * Restore the window
 */
function restoreWindow () {
}
/**
 * Set window size to the specified dimensions
 * 
 * @param{int} - width (integer value greater than zero)
 * @param{int} - height (integer value greater than zero)
 */
function setWindowSize(width, height) {
}
/**
 * Set window to full screen mode
 * 
 * @param{boolean} -  whether the window should be in fullscreen mode
 */
function  setFullScreen(flag) {
}
/**
 * Get window size 
 * 
 * @return{int[]} - an array containing window's width and height
 */
function getWindowSize() {
}
/**
 * Return true if window is in minimized state
 * 
 * @return{Boolean}
 */
function isMinimized() {
}
/**
 * Return true if window is in maximized state
 * 
 * @return{Boolean}
 */
function  isMaximized() {
}
/**
 * Return true if window is in full screen state
 * 
 * @return{Boolean}
 */
function  isFullScreen() {
}
/**
 * Return true whether the window is in normal state (not maximized, not minimized, not in fullscreen mode)
 * 
 * @return{Boolean}
 */
function  isNormal() {
}
/**
 * Return true if window is in visible to the user
 * 
 * @return{Boolean}
 */
function  isVisible() {
}

/**
 * Register callback to be executed before closing ngdesktop
 * 
 * @param {function} callback - function to be executed before closing ngdesktop. Must return a boolean value: 
 *                         true: ngdesktop will close
 *                         false: ngdesktop will not close
 * @returns {boolean} - whether function executed succesfully or not
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
 * WHen the flag parameter is set to:
 *  - true: open external links using OS default browser
 *  - false: open external links using a new ngdesktop window
 * 
 * @param {boolean}
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
