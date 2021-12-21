angular.module('ngdesktopui',['servoy'])
.factory("ngdesktopui",function($services, $q, $log, $window) 
{
	var remote = null;
	var Menu = null;
	var os = null;
	var BrowserWindow = null;
	var isMacOS = false;
	var win = null
	var isMacDefaultMenu = false;
	
	if (typeof require == "function") {
		remote = require('@electron/remote');
		webFrame = require('electron').webFrame;
		Menu = remote.Menu;
		BrowserWindow = remote.BrowserWindow;
		win = remote.getCurrentWindow();
		os = require('os');
	}

	if (remote) {
		var mainMenuTemplate = [];
		isMacOS = (os.platform() === 'darwin');
		function clearMenu() {
			if (isMacOS) {
				mainMenuTemplate = [
					{
						label: 'DefaultMacMenu',
						submenu: [
							{ role: 'quit' }
						]
					}
				]
				isMacDefaultMenu = true;
			} else {
				mainMenuTemplate = [];
			}
			return mainMenuTemplate;
		}
		function addMenu(text, index) {
			var addResultIndex = -1;
			if (isMacDefaultMenu) {
				mainMenuTemplate = [];
				isMacDefaultMenu = false;
			}
			var myMenu = {
				label: text,
				submenu: []
			}
			if (Number.isInteger(index)) {
				mainMenuTemplate.splice(index, 0, myMenu);
				addResultIndex = index;
			} else {
				mainMenuTemplate.push(myMenu)
				addResultIndex = mainMenuTemplate.length - 1;
			}
			return [mainMenuTemplate, addResultIndex];
		}
		function addDevToolsMenu() {
			var addResultIndex = -1;
			if (isMacDefaultMenu) {
				mainMenuTemplate = [];
				isMacDefaultMenu = false;
			}
			var myMenu = {
				label: "Developer Tools",
				submenu: [
					{
						label: "Open Developer Tools",
						click: function() {
							var devTools = new BrowserWindow();
							win.webContents.setDevToolsWebContents(devTools.webContents);
							win.webContents.openDevTools({mode: 'detach'});
						}
					}
				]
			}
			
			mainMenuTemplate.push(myMenu)
			addResultIndex = mainMenuTemplate.length - 1;
			return [mainMenuTemplate, addResultIndex];
		}
		function removeMenu(index) {
			if (Number.isInteger(index)) {			
				mainMenuTemplate.splice(index,1);
				if (mainMenuTemplate.length == 0) {
					mainMenuTemplate = clearMenu();
				} 
			}
			return mainMenuTemplate;
		}
		function removeAllMenuItems(menuIndex, itemIndex) {
			if (Number.isInteger(menuIndex) && (menuIndex >=0 && menuIndex< mainMenuTemplate.length)) {
				if (Number.isInteger(itemIndex)) {//submenu wanted
					if (itemIndex >=0 && itemIndex < mainMenuTemplate[menuIndex].submenu.length) {
						mainMenuTemplate[menuIndex].submenu[itemIndex].submenu = [];
						mainMenuTemplate[menuIndex].submenu[itemIndex].type = "normal";
					}
				} else {//
					mainMenuTemplate[menuIndex].submenu = [];
					if (mainMenuTemplate.length == 1 && isMacOS) {
						mainMenuTemplate = clearMenu(); // create default MacOS menu
					} 
				}
			}
			return mainMenuTemplate;
		}
		function removeMenuItem(menuIndex, position, itemIndex) {
			if (Number.isInteger(menuIndex) && (menuIndex >=0 && menuIndex < mainMenuTemplate.length)) {
				var submenu = mainMenuTemplate[menuIndex].submenu;
				var isSubmenu = false;
				if (Number.isInteger(itemIndex) && (itemIndex >=0 && itemIndex < mainMenuTemplate[menuIndex].submenu.length)) {
					submenu = submenu[itemIndex].submenu;
					isSubmenu = true;
				}
				if (Number.isInteger(position)) {
					submenu.splice(position, 1);
					if (isSubmenu) {
						if (submenu.length == 0) {//no submenu items => switch item from submenu to normal
							mainMenuTemplate[menuIndex].submenu[itemIndex].type = "normal";
						}
						mainMenuTemplate[menuIndex].submenu[itemIndex].submenu = submenu;
					} else {
						mainMenuTemplate[menuIndex].submenu = submenu;
					}
				} 
			}
			return mainMenuTemplate;
		}
		function addMenuItem(menuIndex, text, role, checked, callback, position, itemIndex, type) {
			var addResultIndex = -1;
			if (Number.isInteger(menuIndex) && (menuIndex >=0 && menuIndex < mainMenuTemplate.length)) {
				var submenu = mainMenuTemplate[menuIndex].submenu;
				var isSubmenu = false;
				if (Number.isInteger(itemIndex) && (itemIndex >=0 && itemIndex < mainMenuTemplate[menuIndex].submenu.length)) {
					submenu = submenu[itemIndex].submenu;
					isSubmenu = true;
				}
				var myItem = {};
				if (type === "role") {
					if (text != null) {
						myItem.label = text;
					}
					myItem.role = role;
				} else {
					if (text != null) {
						myItem.label = text;
					}
					if (type != null) {
						myItem.type = type
					}
					if (checked != null) {
						myItem.checked = checked;
					}
					if (callback != null) {
						myItem.click = function(clickedItem, browserWindow, event) {
							$window.executeInlineScript(callback.formname, callback.script, [clickedItem.label, clickedItem.type, clickedItem.checked]);
						}
					}
				}
				if (Number.isInteger(position)) {
					if (submenu === undefined) {
						submenu = [].concat(myItem);
						addResultIndex = 0;
					} else {
						if (position < submenu.length) {
							submenu.splice(position, 0, myItem);
							addResultIndex = position;
						} else {
							submenu = submenu.concat(myItem);
							addResultIndex = submenu.length - 1;
						}
					}
					
					if (isSubmenu) {
						mainMenuTemplate[menuIndex].submenu[itemIndex].type = "submenu";
						mainMenuTemplate[menuIndex].submenu[itemIndex].submenu = submenu;
					} else {
						mainMenuTemplate[menuIndex].submenu = submenu;
					}
				} else {
					if (isSubmenu) {
						mainMenuTemplate[menuIndex].submenu[itemIndex].submenu = submenu.concat([myItem]);
						addResultIndex = mainMenuTemplate[menuIndex].submenu[itemIndex].submenu.length - 1;
					} else {
						mainMenuTemplate[menuIndex].submenu = submenu.concat([myItem]);
						addResultIndex = mainMenuTemplate[menuIndex].submenu.length - 1;
					}
				}
			}
			return [mainMenuTemplate, addResultIndex];
		}
		var browserViews = {};
		var browserViewCounter = 0;
		return {
			/**
			 * Add new menu to the menu bar
			 * 
			 * @param {string} text - menu text
			 * @param {int} [index] - menu insert position (zero based)
			 * 
			 * @return {int} - the index of the added menu
			 */
			addMenu: function(text, index) {
				var result = addMenu(text, index);
				Menu.setApplicationMenu(Menu.buildFromTemplate(result[0]));
				return result[1];
			},
			/**
			 * Add Developer Tools menu to the menu bar
			 * This function is adding Developer Tools menu. 
			 * Use it just for debugging. Remove any call to this function once you're done.  
			 * 
			 * @return {int} - the index of the added menu
			 */
			addDevToolsMenu: function() {
				var result = addDevToolsMenu();
				Menu.setApplicationMenu(Menu.buildFromTemplate(result[0]));
				return result[1];
			},
			/**
			 * Delete menu from the specified position from the menu bar
			 * 
			 * @param {int} index - menu position to be deleted
			 */
			removeMenu: function(index) {
				Menu.setApplicationMenu(Menu.buildFromTemplate(removeMenu(index)));
			},
			/**
			 * Return the menu text at the specified position.
			 * 
			 * @param (string) text - the text to query for
			 * 
			 * @return {int} - menu index containing the specified text; if not found return -1
			 */
			getMenuIndexByText: function(text) {
				var menu = Menu.getApplicationMenu();
				var retVal = -1;
				if (menu != null) {
					for (var index = 0; index < menu.items.length; index++) {
						var item = menu.items[index];
						if (item.label == text) {
							retVal = index;
							break;
						}
					}
				}
				return retVal;
			},
			/**
			 * Return the menu text from the specified menu position.
			 * 
			 * @param {int} position to query for
			 * 
			 * @return {string} - menu's text; if index is out of range - null is returned
			 */
			getMenuText: function(index) {
				var menu = Menu.getApplicationMenu();
				if (index >= 0 && index < menu.items.length) {
					return menu.items[index].label
				}
				return null;
			},
			/**
			 * Count menus from the menu bar.
			 */
			getMenuCount: function() {
				var menu = Menu.getApplicationMenu();
				if (menu == null) {
					return 0;
				}
				return menu.items.length;
			},
			/**
			 * Cleanup the menubar. For MacOS that means to display a minimal menu
			 */
			removeAllMenus: function() {
				Menu.setApplicationMenu(Menu.buildFromTemplate(clearMenu()));
			},
			/**
			 * Show/hide menubar visibility. This function is working only on Windows/Linux
			 */
			setMenuBarVisibility: function(visible) {
				remote.getCurrentWindow().setMenuBarVisibility(visible); //Windows, Linux
			},
			/**
			 * Cleanup the specified menu
			 * 
			 * @param {int} index - menu position
			 * @param {int} [itemIndex] - submenu index
			 */
			removeAllMenuItems: function(index, itemIndex) {
				Menu.setApplicationMenu(Menu.buildFromTemplate(removeAllMenuItems(index, itemIndex)));
			},
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
			addSeparator: function(index, position, itemIndex) {
				var result = addMenuItem(index, null, null, null, null, position, itemIndex, "separator");
				Menu.setApplicationMenu(Menu.buildFromTemplate(result[0]));
				return result[1];
			},
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
			addMenuItem: function(index, text, callback, position, itemIndex) {
				var result = addMenuItem(index, text, null, null, callback, position, itemIndex, "normal");
				Menu.setApplicationMenu(Menu.buildFromTemplate(result[0]));
				return result[1];
			},
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
			removeMenuItem: function(index, position, itemIndex) {
				Menu.setApplicationMenu(Menu.buildFromTemplate(removeMenuItem(index, position, itemIndex)));
			},
			/**
			 * Count menu items for the specified menu
			 * 
			 * @param {int} index - menu index
			 * @param (int) [itemIndex] - submenu index; when specified the submenu items will be count
			 */
			getMenuItemsCount: function(index, itemIndex) {
				var items = Menu.getApplicationMenu().items;
				if ((Number.isInteger(index)) &&
					(index >= 0 && index < items.length)) {
					var menuItem = items[index];
					if (Number.isInteger(itemIndex) && (itemIndex >=0 && itemIndex < menuItem.submenu.items.length)) {//submenu count desired
						var submenuItem = menuItem.submenu.items[itemIndex];
						if (submenuItem.type == "submenu") {
							return submenuItem.submenu.items.length;
						} else {
							return 0
						}
					}
					return menuItem.submenu.items.length;
				}
				return -1;
			},
			
			
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
			 * @param {boolean} [checked] - checkbox initial status (unchecked by defaul)
			 * @param {int} [position] - insert position
			 * @param {int} [itemIndex] - submenu index; when specified the position is relative to this submenu
			 * 
			 * @return {int} - the index of the added checkbox
			 * 
			 * Note: when add the checkbox to an existing menuitem, that menuitem will get from type "normal" to type "submenu". 
			 *       If previously a callback has been set, that callback will no longer be called
			 */
			addCheckBox: function(index, text, callback, checked, position, itemIndex) {
				var result = addMenuItem(index, text, null, checked, callback, position, itemIndex, "checkbox");
				Menu.setApplicationMenu(Menu.buildFromTemplate(result[0]));
				return result[1];
			},
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
			addRadioButton: function(index, text, callback, selected, position, itemIndex) {
				var result = addMenuItem(index, text, null, selected, callback, position, itemIndex, "radio");
				Menu.setApplicationMenu(Menu.buildFromTemplate(result[0]));
				return result[1];
			},
			/**
			 * Add a menuitem with standard native system behavior. 
			 * For complete allowed value list: https://github.com/Servoy/ngdesktopui
			 * 
			 * @param {int} index - menu index
			 * @param {string} role - item role. 
			 * @param {string} [text] - menuitem text; when not specified the System will provide a standard (localized) one
			 * @param {int} [position] - insert position
			 * @param {int} [itemIndex] - submenu index; when specified the position is relative to this submenu
			 * 
			 * @return {int} - the index of the added role item
			 * 
			 */
			addRoleItem: function(index, role, text, position, itemIndex) {
				var result = addMenuItem(index, text, role, null, null, position, itemIndex, "role");
				Menu.setApplicationMenu(Menu.buildFromTemplate(result[0]));
				return result[1];
			},
			/**
			 * Get menuitem index from the specified menu
			 * 
			 * @param {int} index - menu index
			 * @param {string} text - menuitem text to query for index
			 */
			getMenuItemIndexByText: function(index, text) {
				var appMenu = Menu.getApplicationMenu();
				var retVal = -1;
				if (Number.isInteger(index) && (index >= 0 && index < appMenu.items.length)) {
					var menuitems = appMenu.items[index].submenu.items;
					for (var itemIndex = 0; itemIndex < menuitems.length; itemIndex++) {
						if (menuitems[itemIndex].label == text) {
							retVal = itemIndex;
							break;
						}
					} 
				}
				return retVal;
			},
			/**
			 * Get menuitem text from the specified menu
			 * 
			 * @param {int} index - menu index
			 * @param {int} itemIndex - menuitem index to query for text
			 */
			getMenuItemText: function(index, itemIndex) {
				var appMenu = Menu.getApplicationMenu();
				if (Number.isInteger(index) && (index >= 0 && index < appMenu.items.length)) {
					var menuItems = appMenu.items[index].submenu.items;
					if (Number.isInteger(itemIndex) && (itemIndex >=0 && itemIndex < menuItems.length)) {
						return menuItems[itemIndex].label;
					} 
				}
				return null;
			},
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
			createBrowserView: function(x,y,width,height,url) {
				var id = browserViewCounter++  + '';
				var view = new remote.BrowserView();
				browserViews[id] = view;
				remote.getCurrentWindow().addBrowserView(view);
				view.setBounds({ x: x, y: y, width: width, height: height });
				view.webContents.loadURL(url);
				return id;
			},
			/**
			 * Closes a and destroys a previously created BrowserView by the given id.
			 * 
			 * @param {int} id - the id of the view to close.
			 */
			closeBrowserView: function(id) {
				var view = browserViews[id];
				if (view){
					remote.getCurrentWindow().removeBrowserView(view);
					delete browserViews[id];
				}
			},
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
			injectJSIntoBrowserView: function(id, js, callback) {
				var view = browserViews[id];
				if (view) {
					view.webContents.executeJavaScript(js).then(function(result) {
						if (callback) $window.executeInlineScript(callback.formname, callback.script, [result]);
					}).catch(function(e) {
						if (callback) $window.executeInlineScript(callback.formname, callback.script, [null, e.message]);
					})
				}
			},
			/**
 			 * Get the zoom factor of the current window
 			 *
			 * @return {double} The zoom factor of the current window
			 */
			getZoomFactor: function () {
				return webFrame.getZoomFactor();
			},
			/**
			 * Set the zoom factor of the current window
			 * 1 == 100%. 0.5 == 50%.
			 *
			 * @param {double} factor (values greater than 0.0 and smaller or equal to 5.0)
			 * @return {boolean}
			 */
			setZoomFactor: function (factor) {
				if (factor && (typeof factor === 'number') && factor > 0.0 && factor <= 5.0) {
					webFrame.setZoomFactor(factor);
					return true;
				} else {
					return false;
				}
			},

			/**
			 * Show and gives focus to the window
			 */
			showWindow: function () {
				win.show();
			},
			/**
			 * Hide the window
			 */
			hideWindow: function () {
				if (isMacOS) {
					//on MacOS calling after calling win.hide() - the main window is no longer receiving events
					//calling win.show() has no effect; electron issue?
					win.minimize();
				} else {
					win.hide();
				}
			},
			/**
			 * Maximize the window
			 */
			maximizeWindow: function () {
				win.maximize();
			},
			/**
			 * Unmaximize the window
			 */
			unmaximizeWindow: function () {
				win.unmaximize();
			},
			/**
			 * Minimize the window
			 */
			 minimizeWindow: function () {
				win.minimize();
			},
			/**
			 * Restore the window
			 */
			restoreWindow: function () {
				win.restore();
			},
			/**
			 * Set window size to the specified dimensions
			 * 
			 * @param{int} - width (integer value greater than zero)
			 * @param{int} - height (integer value greater than zero)
			 */
			setWindowSize: function(width, height) {
				win.setSize(width, height);
			},
			/**
			 * Set window to full screen mode
			 * 
			 * @param{boolean} -  whether the window should be in fullscreen mode
			 */
			 setFullScreen: function(flag) {
				win.setFullScreen(flag);
			},
			/**
			 * Get window size 
			 * 
			 * @return{int[]} - an array containing window's width and height
			 */
			getWindowSize: function() {
				return win.getSize();
			},
			/**
			 * Return true if window is in minimized state
			 * 
			 * @return{Boolean}
			 */
			isMinimized: function() {
				return win.isMinimized();
			},
			/**
			 * Return true if window is in maximized state
			 * 
			 * @return{Boolean}
			 */
			 isMaximized: function() {
				return win.isMaximized();
			},
			/**
			 * Return true if window is in full screen state
			 * 
			 * @return{Boolean}
			 */
			 isFullScreen: function() {
				return win.isFullScreen();
			},
			/**
			 * Return true whether the window is in normal state (not maximized, not minimized, not in fullscreen mode)
			 * 
			 * @return{Boolean}
			 */
			 isNormal: function() {
				return win.isNormal();
			},
			/**
			 * Return true if window is in visible to the user
			 * 
			 * @return{Boolean}
			 */
			 isVisible: function() {
				return win.isVisible();
			}

		}
	} else {
		return {
			addMenu: function() {console.log("not in ngdesktop");},
			removeMenu: function() {console.log("not in ngdesktop");},
			getMenuIndexByText: function() {console.log("not in ngdesktop");},
			getMenuText: function() {console.log("not in ngdesktop");},
			getMenuCount: function() {console.log("not in ngdesktop");},
			removeAllMenus: function() {console.log("not in ngdesktop");},
			setMenuBarVisibility: function() {console.log("not in ngdesktop");},
			removeAllMenuItems: function() {console.log("not in ngdesktop");},
			addSeparator: function() {console.log("not in ngdesktop");},			
			addMenuItem: function() {console.log("not in ngdesktop");},
			removeMenuItem: function() {console.log("not in ngdesktop");},
			getMenuItemsCount: function() {console.log("not in ngdesktop");},		
			addCheckBox: function() {console.log("not in ngdesktop");},
			addRadioButton: function() {console.log("not in ngdesktop");},
			addRoleItem: function() {console.log("not in ngdesktop");},
			addDevToolsItem: function() {console.log("not in ngdesktop");},
			getMenuItemIndexByText: function() {console.log("not in ngdesktop");},
			getMenuItemText: function() {console.log("not in ngdesktop");},
			createBrowserView: function() {console.log("not in ngdesktop");},
			closeBrowserView: function() {console.log("not in ngdesktop");},
			injectJSIntoBrowserView: function () { console.log("not in ngdesktop"); },
			getZoomFactor: function () { console.log("not in ngdesktop"); },
			setZoomFactor: function () { console.log("not in ngdesktop"); },
			showWindow: function () { console.log("not in ngdesktop"); },
			hideWindow: function () { console.log("not in ngdesktop"); },
			maximizeWindow: function () { console.log("not in ngdesktop"); },
			unmaximizeWindow: function () { console.log("not in ngdesktop"); },
			minimizeWindow: function () { console.log("not in ngdesktop"); },
			restoreWindow: function () { console.log("not in ngdesktop"); },
			setWindowSize: function () { console.log("not in ngdesktop"); },
			setFullScreen: function () { console.log("not in ngdesktop"); },
			getWindowSize: function () { console.log("not in ngdesktop"); },
			isMinimized: function () { console.log("not in ngdesktop"); },
			isMaximized: function () { console.log("not in ngdesktop"); },
			isFullScreen: function () { console.log("not in ngdesktop"); },
			isNormal: function () { console.log("not in ngdesktop"); },
			isVisible: function () { console.log("not in ngdesktop"); },
		}
	}
})