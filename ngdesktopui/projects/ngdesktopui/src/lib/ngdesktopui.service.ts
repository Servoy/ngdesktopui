import { Injectable } from '@angular/core';
import { LoggerFactory, LoggerService, WindowRefService, ServoyPublicService } from '@servoy/public';

import * as electron from 'electron';

@Injectable()
export class NGDesktopUIService {
    private electron: typeof electron;
    private remote: typeof electron.remote;
    private Menu: typeof electron.Menu;
    private Tray: typeof electron.Tray;
    private log: LoggerService;
    private window: electron.BrowserWindow;
    private isMacOS = false;
    private browserViews = {};
    private browserViewCounter = 0;
    private mainMenuTemplate: Array<(electron.MenuItemConstructorOptions) | (electron.MenuItem)> = [];
    private defaultTemplate: Array<(electron.MenuItemConstructorOptions) | (electron.MenuItem)> = [];
    private ipcRenderer: typeof electron.ipcRenderer;
    private callbackOnClose = null;
    private currentMenu = 'default';
    private tray = null;
    private trayMenuTemplate: Array<(electron.MenuItemConstructorOptions) | (electron.MenuItem)> = [];

    private cleanMenu = [
		{
			label: 'App name', //overwritten by MacOS
			submenu: [
				{
					label: 'Quit',
					role: 'quit'
				}
			]
		}
	];

    constructor(private servoyService: ServoyPublicService, windowRef: WindowRefService, logFactory: LoggerFactory) {
        this.log = logFactory.getLogger('NGDesktopUtilsService');
        const userAgent = navigator.userAgent.toLowerCase();
        const r = windowRef.nativeWindow['require'];
        if (userAgent.indexOf(' electron/') > -1 && r) {
            this.electron = r('electron');
            this.remote = r('@electron/remote');
            this.Menu = this.remote.Menu;
            this.Tray = this.remote.Tray;
            this.window = this.remote.getCurrentWindow();
            this.ipcRenderer = r('electron').ipcRenderer; //we must initialize renderer here
            this.isMacOS = ( r('os').platform() === 'darwin');

            const menuJSON = this.ipcRenderer.sendSync('ngdesktop-menu', false);

            if (menuJSON.length > 0) {
                this.defaultTemplate =JSON.parse(menuJSON);
                this.mainMenuTemplate = JSON.parse(menuJSON);
                this.defaultTemplate = this.resetDevToolWindow(this.defaultTemplate);
                this.mainMenuTemplate = this.resetDevToolWindow(this.mainMenuTemplate);
            } else if (this.isMacOS) {
                this.currentMenu = 'clean';
                this.defaultTemplate =JSON.parse(JSON.stringify(this.cleanMenu));
                this.mainMenuTemplate = JSON.parse(JSON.stringify(this.cleanMenu));
            } else { //windows, Linux
                this.currentMenu = 'clean';
                this.defaultTemplate = [];
                this.mainMenuTemplate = [];
            };
        } else {
            this.log.warn('ngdesktopui service/plugin loaded in a none electron environment');
        }
    }

    isDevToolsAdded(templateArray) {
        let result = false;
        for (const template of templateArray) {
            if (template.submenu != null && template.submenu.length > 0) {
                result = this.isDevToolsAdded(template.submenu);
                if (result) break;
            } else if (template.label != null && template.label.includes('Developer Tools')) {
                result = true;
                break;
            }
        }
        return result;
    }

    resetDevToolWindow(templateArray) {
        for (const template of templateArray) {
            if (template.submenu != null && template.submenu.length > 0) {
                template.submenu = this.resetDevToolWindow(template.submenu);
            } else if (template.label != null && template.label.includes('Detach Developer')) {
                template.click = function() {
                    const devTools = new this.remote.BrowserWindow();
                    this.window.webContents.setDevToolsWebContents(devTools.webContents);
                    this.win.webContents.openDevTools({mode: 'detach'});
                };
                break;
            }
        }
        return templateArray;
    }

    refreshMenuTemplate() {
        const menuJSON = this.ipcRenderer.sendSync('ngdesktop-menu', true);
        return this.resetDevToolWindow(JSON.parse(menuJSON));
    }

    clearMenu() {
        this.mainMenuTemplate = [];
        if (this.isMacOS) {
            this.mainMenuTemplate = JSON.parse(JSON.stringify(this.cleanMenu));
        };
        this.currentMenu = 'clean';
        return this.mainMenuTemplate;
    }

    isCleanMenu() {
        return this.currentMenu === 'clean';
    }

    resetMenuToDefault() {
        this.currentMenu = 'default';
        this.mainMenuTemplate = JSON.parse(JSON.stringify(this.defaultTemplate));

        if (this.mainMenuTemplate.length > 0) {
            this.mainMenuTemplate = this.resetDevToolWindow(this.mainMenuTemplate);
        } else {
            this.mainMenuTemplate = [];
            this.currentMenu = 'clean';
        }
        return this.mainMenuTemplate;
    }

    addRoleMenu(index, roleValue, text) {
        if (this.isCleanMenu()) {
            this.mainMenuTemplate = [];
            this.currentMenu = 'custom';
        }
        let addResultIndex = -1;
        const myMenu = {
            label: text,
            role: roleValue
        };
        if (Number.isInteger(index)) {
            this.mainMenuTemplate.splice(index, 0, myMenu);
            addResultIndex = index;
        } else {
            this.mainMenuTemplate.push(myMenu);
            addResultIndex = this.mainMenuTemplate.length - 1;
        }
        return [this.mainMenuTemplate, addResultIndex];
    }

    /**
     * Add new menu to the menu bar
     *
     * @param{string} text - menu text
     * @param{int} index - menu insert position (zero based)
     *
     * @return{int} - the index of the added menu
     */
    addMenu(text: string, index: number) {
        const result = this.addMenuImpl(text, index);
        this.Menu.setApplicationMenu(this.Menu.buildFromTemplate(this.mainMenuTemplate));
        return result[1];
    }

    /**
     * Add Developer Tools menu to the menu bar
     * This function is adding Developer Tools menu.
     * Use it just for debugging. Remove any call to this function once you're done.
     *
     * @return{int} - the index of the added menu
     */
    addDevToolsMenu() {
        if (this.isCleanMenu()) {
            this.mainMenuTemplate = [];
            this.currentMenu = 'custom';
        }
        if (!this.isDevToolsAdded(this.mainMenuTemplate)) {
            const myMenu = {
                label: 'Developer Tools',
                submenu: [
                    {
                        label: 'Open Developer Tools',
                        click: () => {
                            const devTools = new this.remote.BrowserWindow();
                            this.window.webContents.setDevToolsWebContents(devTools.webContents);
                            this.window.webContents.openDevTools({ mode: 'detach' });
                            setTimeout(() => {
                                // set the bounds to be a bit bigger to just force a redraw
                                const bounds = devTools.getBounds();
                                bounds.width = bounds.width + 10;
                                devTools.setBounds(bounds);
                            }, 10);
                        }
                    }
                ]
            };
            this.mainMenuTemplate.push(myMenu);
        }
        this.Menu.setApplicationMenu(this.Menu.buildFromTemplate(this.mainMenuTemplate));
        return this.mainMenuTemplate.length - 1;
    }

    /**
     * Delete menu from the specified position from the menu bar
     *
     * @param{int} index - menu position to be deleted
     */
    removeMenu(index: number) {
        if (Number.isInteger(index)) {
            this.currentMenu = 'custom';
            this.mainMenuTemplate.splice(index, 1);
            if (this.mainMenuTemplate.length === 0) {
                this.mainMenuTemplate = this.clearMenu();
            } else {
                this.Menu.setApplicationMenu(this.Menu.buildFromTemplate(this.mainMenuTemplate));
            }
        }
    }

    /**
     * Return the menu text at the specified position.
     *
     * @param{string} text - the text to query for
     *
     * @return{int} - menu index containing the specified text; if not found return -1
     */
    getMenuIndexByText(text: string) {
        const menu = this.Menu.getApplicationMenu();
        let retVal = -1;
        if (menu != null) {
            for (let index = 0; index < menu.items.length; index++) {
                const item = menu.items[index];
                if (item.label === text) {
                    retVal = index;
                    break;
                }
            }
        }
        return retVal;
    }
    /**
     * Return the menu text from the specified menu position.
     *
     * @param{int} index - zero based index to query for
     *
     * @return(string) - menu's text; if index is out of range - null is returned
     */
    getMenuText(index: number) {
        const menu = this.Menu.getApplicationMenu();
        if (index >= 0 && index < menu.items.length) {
            return menu.items[index].label;
        }
        return null;
    }
    /**
     * Count menus from the menu bar.
     */
    getMenuCount() {
        const menu = this.Menu.getApplicationMenu();
        if (menu == null) {
            return 0;
        }
        return menu.items.length;
    }
    /**
     * Cleanup the menubar. For MacOS that means to display a minimal menu
     */
    removeAllMenus() {
        this.Menu.setApplicationMenu(this.Menu.buildFromTemplate(this.clearMenu()));
    }
    /**
     * Show/hide menubar visibility. This function is working only on Windows/Linux
     */
    setMenuBarVisibility(visible: boolean) {
        this.remote.getCurrentWindow().setMenuBarVisibility(visible); //Windows, Linux
    }
    /**
     * Cleanup the specified menu
     *
     * @param{int} menuIndex - menu index position
     * @param{int} itemIndex - item position in the menu
     */
    removeAllMenuItems(menuIndex: number, itemIndex: number) {
        if (Number.isInteger(menuIndex) && (menuIndex >= 0 && menuIndex < this.mainMenuTemplate.length)) {
            this.currentMenu = 'custom';
            if (Number.isInteger(itemIndex)) {//submenu wanted
                if (itemIndex >= 0 && itemIndex < (this.mainMenuTemplate[menuIndex].submenu as electron.MenuItemConstructorOptions[]).length) {
                    this.mainMenuTemplate[menuIndex].submenu[itemIndex].submenu = [];
                    this.mainMenuTemplate[menuIndex].submenu[itemIndex].type = 'normal';
                    this.Menu.setApplicationMenu(this.Menu.buildFromTemplate(this.mainMenuTemplate));
                }
            } else {//
                this.mainMenuTemplate[menuIndex].submenu = [];
                if (this.mainMenuTemplate.length === 1 && this.isMacOS) {
                    this.mainMenuTemplate = this.clearMenu();
                };
                this.Menu.setApplicationMenu(this.Menu.buildFromTemplate(this.mainMenuTemplate));
            }
        }
    }
    /**
     * Add separator line to the specified menu
     *
     *
     * @param{int} index - menu index
     * @param{int} position - insert position
     * @param{int} itemIndex - submenu index; when specified the position is relative to this submenu
     *
     * @return{int} - the index of the added separator
     */
    addSeparator(index: number, position: number, itemIndex: number) {
        const result = this.addMenuItemImpl(index, null, null, null, null, position, itemIndex, 'separator');
        this.Menu.setApplicationMenu(this.Menu.buildFromTemplate(this.mainMenuTemplate));
        return result;
    }
    /**
     * Add menu items to existing menu.
     *
     * @param{int} index - menu index
     * @param{string} text - menuitem text
     * @param{function} callback - callback function to call
     *                   The callback function will receive:
     *                       - text of the clicked item
     *                       - type of the clicked item ("normal", "radio", "checkbox")
     *                       - checked value for checkboxes and radio buttons, otherwise undefined
     * @param{int} position - insert position
     * @param{int} itemIndex - submenu index; when specified the position is relative to this submenu
     *
     * @return{int} - the index of the added menu item
     *
     * Note: when add an item to an existing menuitem, that menuitem will get from type "normal" to type "submenu".
     *       If previously a callback has been set, that callback will no longer be called
     */
    addMenuItem(index: number, text: string, callback: {formname: string; script: string}, position: number, itemIndex: number) {
        const result = this.addMenuItemImpl(index, text, null, null, callback, position, itemIndex, 'normal');
        this.Menu.setApplicationMenu(this.Menu.buildFromTemplate(this.mainMenuTemplate));
        return result;
    }
    /**
     * Remove menu item from existing menu.
     *
     * @param{int} index - menu index
     * @param{int} position - menuitem position to be removed
     * @param{int} itemIndex - submenu index; when specified the position is relative to this submenu
     *
     * Note: when the last item from a submenu it is removed that submenu will get from type "submenu" to type "normal".
     *       If previously a callback has been set for the item, that callback will be called further
     */
    removeMenuItem(index: number, position: number, itemIndex: number) {
        this.Menu.setApplicationMenu(this.Menu.buildFromTemplate(this.removeMenuItemImpl(index, position, itemIndex)));
    }
    /**
     * Count menu items for the specified menu
     *
     * @param{int} index - menu index
     * @param{int} itemIndex - submenu index; when specified the submenu items will be count
     *
     * @return{int} - counted items
     */
    getMenuItemsCount(index: number, itemIndex: number) {
        const items = this.Menu.getApplicationMenu().items;
        if ((Number.isInteger(index)) &&
            (index >= 0 && index < items.length)) {
            const menuItem = items[index];
            if (Number.isInteger(itemIndex) && (itemIndex >= 0 && itemIndex < menuItem.submenu.items.length)) {//submenu count desired
                const submenuItem = menuItem.submenu.items[itemIndex];
                if (submenuItem.type === 'submenu') {
                    return submenuItem.submenu.items.length;
                } else {
                    return 0;
                }
            }
            return menuItem.submenu.items.length;
        }
        return -1;
    }


    /**
     * Add checkbox to the specified menu
     *
     *
     * @param{int} index - menu index
     * @param{string} text - checkbox label
     * @param{function} callback - callback function to call
     *                   The callback function will receive:
     *                       - text of the clicked item
     *                       - type of the clicked item ("normal", "radio", "checkbox")
     *                       - checked value for checkboxes and radio buttons, otherwise undefined
     * @param{boolean} checked - checkbox initial status (unchecked by defaul)
     * @param{int} position - insert position
     * @param{int} itemIndex - submenu index; when specified the position is relative to this submenu
     *
     * @return{int} - the index of the added checkbox
     *
     * Note: when add the checkbox to an existing menuitem, that menuitem will get from type "normal" to type "submenu".
     *       If previously a callback has been set, that callback will no longer be called
     */
    addCheckBox(index: number, text: string, callback: {formname: string; script: string}, checked: boolean, position: number, itemIndex: number) {
        const result = this.addMenuItemImpl(index, text, null, checked, callback, position, itemIndex, 'checkbox');
        this.Menu.setApplicationMenu(this.Menu.buildFromTemplate(this.mainMenuTemplate));
        return result;
    }
    /**
     * Add radio button to the specified menu
     *
     * @param{int} index - menu index
     * @param{string} text - checkbox label
     * @param{function} callback - callback function to call
     *                   The callback function will receive:
     *                       - text of the clicked item
     *                       - type of the clicked item ("normal", "radio", "checkbox")
     *                       - checked value for checkboxes and radio buttons, otherwise undefined
     * @param{boolean} selected - initial selected status
     * @param{int} position - insert position
     * @param{int} itemIndex - submenu index; when specified the position is relative to this submenu
     *
     * @return{int} - the index of the added radio button
     *
     * Note: when add the checkbox to an existing menuitem, that menuitem will get from type "normal" to type "submenu".
     *       If previously a callback has been set, that callback will no longer be called
     * Note: For the first added radio button in a group, the radio button is selected regardless the selected param
     */
    addRadioButton(index: number, text: string, callback: {formname: string; script: string}, selected: boolean, position: number, itemIndex: number) {
        const result = this.addMenuItemImpl(index, text, null, selected, callback, position, itemIndex, 'radio');
        this.Menu.setApplicationMenu(this.Menu.buildFromTemplate(this.mainMenuTemplate));
        return result;
    }
    /**
     * Add a menuitem with standard native system behavior.
     * For complete allowed value list: https://github.com/Servoy/ngdesktopui
     *
     * @param{int} index - menu index
     * @param{string} role - item role.
     * @param{string} text - menuitem text; when not specified the System will provide a standard (localized) one
     * @param{int} position - insert position
     * @param{int} itemIndex - submenu index; when specified the position is relative to this submenu
     *
     * @return{int} - the index of the added role item
     *
     */
    // eslint-disable-next-line max-len
    addRoleItem(index: number, role: ('undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'pasteAndMatchStyle' | 'delete' | 'selectAll' | 'reload' | 'forceReload' | 'toggleDevTools' | 'resetZoom' | 'zoomIn' | 'zoomOut' | 'togglefullscreen' | 'window' | 'minimize' | 'close' | 'help' | 'about' | 'services' | 'hide' | 'hideOthers' | 'unhide' | 'quit' | 'startSpeaking' | 'stopSpeaking' | 'zoom' | 'front' | 'appMenu' | 'fileMenu' | 'editMenu' | 'viewMenu' | 'recentDocuments' | 'toggleTabBar' | 'selectNextTab' | 'selectPreviousTab' | 'mergeAllWindows' | 'clearRecentDocuments' | 'moveTabToNewWindow' | 'windowMenu'),
                         text: string, position: number, itemIndex: number) {

        let result;
        if (role.endsWith('Menu')) {
            result = this.addRoleMenu(index, role, text);
        } else {
            this.addMenuItemImpl(index, text, role, null, null, position, itemIndex, 'role');
        }
        this.Menu.setApplicationMenu(this.Menu.buildFromTemplate(this.mainMenuTemplate));
        this.mainMenuTemplate = this.refreshMenuTemplate();
        return result;
    }
    /**
     * Get menuitem index from the specified menu
     *
     * @param{int} index - menu index
     * @param{string} text - menuitem text to query for index
     *
     * @return{string} - text of the item
     */
    getMenuItemIndexByText(index: number, text: string) {
        const appMenu = this.Menu.getApplicationMenu();
        let retVal = -1;
        if (Number.isInteger(index) && (index >= 0 && index < appMenu.items.length)) {
            const menuitems = appMenu.items[index].submenu.items;
            for (let itemIndex = 0; itemIndex < menuitems.length; itemIndex++) {
                if (menuitems[itemIndex].label === text) {
                    retVal = itemIndex;
                    break;
                }
            }
        }
        return retVal;
    }
    /**
     * Get menuitem text from the specified menu
     *
     * @param{int} index - menu index
     * @param{int} itemIndex - menuitem index to query for text
     *
     * @return{string} - text of the item
     */
    getMenuItemText(index: number, itemIndex: number) {
        const appMenu = this.Menu.getApplicationMenu();
        if (Number.isInteger(index) && (index >= 0 && index < appMenu.items.length)) {
            const menuItems = appMenu.items[index].submenu.items;
            if (Number.isInteger(itemIndex) && (itemIndex >= 0 && itemIndex < menuItems.length)) {
                return menuItems[itemIndex].label;
            }
        }
        return null;
    }
    /**
     * Creates a BrowserView (looks like an iframe) and adds this to the current window at the given coordinates with the given width and height.
     * It returns and id that can be used to close/clean up this view later on, or to target that view to inject some javascript.
     *
     * @param{int} x - the X coordinate to position this view
     * @param{int} y - the Y coordinate to position this view
     * @param{int} width - the width of this view
     * @param{int} height - the height of this view
     * @param{string} url - the url to load into this view
     *
     * @return{string} - the id to target this view later on.
     */
    createBrowserView(x: number, y: number, width: number, height: number, url: string): string {
        const id = this.browserViewCounter++ + '';
        const view = new this.remote.BrowserView();
        this.browserViews[id] = view;
        this.remote.getCurrentWindow().addBrowserView(view);
        view.setBounds({ x, y, width, height });
        view.webContents.loadURL(url);
        return id;
    }
    /**
     * Closes a and destroys a previously created BrowserView by the given id.
     *
     * @param{string} id - the id of the view to close.
     */
    closeBrowserView(id: string) {
        const view = this.browserViews[id];
        if (view) {
            this.remote.getCurrentWindow().removeBrowserView(view);
            delete this.browserViews[id];
        }
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
     * @param{string} id - the id of the view to execute javascript in.
     * @param{string} js - the piece of javascript that is injected into this view.
     * @param{function} callback - the callback function that is used to get the results or exception if the call fails.
     */
    injectJSIntoBrowserView(id: string, js: string, callback: {formname: string; script: string}) {
        const view = this.browserViews[id];
        if (view) {
            view.webContents.executeJavaScript(js).then((result: any) => {
                if (callback) this.servoyService.executeInlineScript(callback.formname, callback.script, [result]);
            }).catch((e: Error) => {
                if (callback) this.servoyService.executeInlineScript(callback.formname, callback.script, [null, e.message]);
            });
        }
    }

    /**
     * Get the zoom factor of the current window
     *
     * @return{number} - The zoom factor of the current window
     */
    getZoomFactor(): number {
        return this.electron.webFrame.getZoomFactor();
    }

    /**
     * Set the zoom factor of the current window
     * 1 == 100%. 0.5 == 50%.
     *
     * @param{float} factor - (values between 0.1 and 5)
     *
     * @return{boolean} - indicating success (true) or failure (false)
     */
    setZoomFactor(factor: number): boolean {
        if (factor && (typeof factor === 'number') && factor > 0.0 && factor <= 5.0) {
             this.electron.webFrame.setZoomFactor(factor);
        	 return true;
        } else {
             return false;
        }
    }

    /**
     * Shows and gives focus to the window
     */
    showWindow() {
        this.window.show();
    }

    /**
     * Hides the window
     */
    hideWindow() {
        if (this.isMacOS) {
            //on MacOS calling after calling win.hide() - the main window is no longer receiving events
            //calling win.show() has no effect; electron issue?
            this.window.minimize();
        } else {
            this.window.hide();
        }
    }

    /**
     * Maximizes the window
     */
    maximizeWindow() {
        this.window.maximize();
    }

    /**
     * Unmaximizes the window
     */
    unmaximizeWindow() {
        this.window.unmaximize();
    }

    /**
     * Maximizes the window
     */
     minimmizeWindow() {
        this.window.minimize();
    }

    /**
     * Unmaximizes the window
     */
    restoreWindow() {
        this.window.restore();
    }

    /**
     * Set window size to the specified dimensions
     *
     * @param{int} width - integer value greater than zero
     * @param{int} height - integer value greater than zero
     */
	setWindowSize(width: number, height: number) {
		this.window.setSize(width, height);
	}

    /**
     * Set window to full screen mode
     *
     * @param{boolean} flag -  set fullscreen mode status
     */
	setFullScreen(flag: boolean) {
		this.window.setFullScreen(flag);
	}

    /**
     * Get window size
     *
     * @return{int[]} - an array if integers containing window's width and height
     */
	getWindowSize() {
		return this.window.getSize();
	}

    /**
     * Return true if window is in minimized state
     *
     * @return{Boolean}
     */
	isMinimized(): boolean {
		return this.window.isMinimized();
	}

    /**
     * Return true if window is in maximized state
     *
     * @return{Boolean}
     */
	isMaximized(): boolean {
		return this.window.isMaximized();
	}

	/**
	 * Return true if window is in full screen state
	 *
	 * @return{Boolean}
	 */
	isFullScreen(): boolean {
		return this.window.isFullScreen();
	}

	/**
	 * Return true whether the window is in normal state (not maximized, not minimized, not in fullscreen mode)
	 *
	 * @return{Boolean}
	 */
	 isNormal(): boolean {
		return this.window.isNormal();
	}

	/**
	 * Return true if window is in visible to the user
	 *
	 * @return{Boolean}
	 */
	 isVisible(): boolean {
		return this.window.isVisible();
	}

    /**
     * Register callback to be executed before closing ngdesktop
     *
     * @param{function} callback - function to be executed before closing ngdesktop. Must return a boolean value:
     *                         true: ngdesktop will close
     *                         false: ngdesktop will not close
     * @returns{Boolean} - whether callback was succesfully registered or not
     */
	registerOnCloseMethod(callback: {formname: string; script: string}): boolean{
        if (this.callbackOnClose == null) { //null or undefined
            this.callbackOnClose = callback;
            this.ipcRenderer.on('ngdesktop-close-request', this.executeOnCloseCallback);
            this.ipcRenderer.send('ngdesktop-enable-closeOnRequest', true);
            return true;
        };
        return false;
    }

    /**
     * Unregister the callback to be executed before closing ngdesktop.
     */
	unregisterOnCloseMethod() {
		if (!!this.callbackOnClose) { // not (null || undefined)
			this.ipcRenderer.removeListener('ngdesktop-close-request', this.executeOnCloseCallback);
			this.ipcRenderer.send('ngdesktop-enable-closeOnRequest', false);
			this.callbackOnClose = null;
		}
	}

    /**
     * Set the way external links will be handled from ngdesktop.
     * WHen the flag parameter is set to:
     *  - true: open external links using OS default browser
     *  - false: open external links using a new ngdesktop window
     *
     * @param{boolean} flag
     *      - true: open external links using OS default browser
     *      - false: open external links using a new ngdesktop window
     */
     useDefaultBrowserForExternalLinks(flag: boolean) {
        this.ipcRenderer.send('ngdesktop-useDefaultBrowserForExternal', flag);
    }

    /**
     * Create tray for the ngdesktop app.
     * The recommended icon size is of 19 x 19 pixels using PNG format (ICO may be used also for Windows).
     * When no icon is provided, ngdesktop use a default one.
     *
     * @param icon as byte array
     */
	createTray(icon) {
		//expected byte array
		this.tray = new this.Tray(this.ipcRenderer.sendSync('ngdesktop-set-tray-icon',  icon !== undefined ? Buffer.from(icon).toString('base64') : null, 'trayIcon'));
	}

    /**
     * Add tray menu items to existing tray menu.
     *
     * @param{int} index - menuitem index
     * @param{string} text - menuitem text
     * @param{function} callback - callback function to call. It callback function will receive:
     *                 - text of the clicked item
     *                 - type of the clicked item ("normal", "radio", "checkbox")
     *                 - checked value for checkboxes and radio buttons, otherwise undefined
     *
     * @return{int} - the index of the added menu item
     */
    addTrayMenuItem(index: number, text: string, callback: {formname: string; script: string}) {
		const result = this.addTrayMenuItemImpl(index, text, null, callback, null, 'normal');
		this.tray.setContextMenu(this.Menu.buildFromTemplate(this.trayMenuTemplate));
		return result;
	}

    /**
     * Remove tray menu item from existing tray menu.
     *
     * @param{int} index - menuitem to be removed
     */
	removeTrayMenuItem(index: number) {
        this.removeTrayMenuItemImpl(index);
		this.tray.setContextMenu(this.Menu.buildFromTemplate(this.trayMenuTemplate));
	}
    /**
     * Add separator line to the tray menu
     *
     * @param{int} index - position to add separator
     *
     * @return{int} the index of the added separator
     */
	addTraySeparator(index: number){
		const result = this.addTrayMenuItemImpl(index, null, null, null, null, 'separator');
		this.tray.setContextMenu(this.Menu.buildFromTemplate(this.trayMenuTemplate));
		return result;
	}
    /**
     * Add checkbox to the tray menu
     *
     * @param{int} index - menu index
     * @param{string} text - checkbox label
     * @param{function} callback - callback function to call
     *                   The callback function will receive:
     *                       - text of the clicked item
     *                       - type of the clicked item ("normal", "radio", "checkbox")
     *                       - checked value for checkboxes and radio buttons, otherwise undefined
     * @param{boolean} checked - checkbox initial status (unchecked by default)
     *
     * @return{int} the index of the added checkbox
     */
	addTrayCheckBox(index: number, text: string, callback: {formname: string; script: string}, checked: boolean) {
		const result =this.addTrayMenuItemImpl(index, text, null, callback, checked, 'checkbox');
		this.tray.setContextMenu(this.Menu.buildFromTemplate(this.trayMenuTemplate));
		return result;
	}
    /**
     * Add a menuitem to the system tray having a standard native system behavior.
     * For complete allowed value list: https://github.com/Servoy/ngdesktopui
     *
     * @param{int} index - menu index
     * @param{text} role - item role.
     * @param{string} text - menuitem text; when not specified the System will provide a standard (localized) one
     *
     * @return{int} the index of the added role item
     *
     */
	addTrayRoleItem(index: number, role, text) {
		const result = this.addTrayMenuItemImpl(index, text, role, null, null, 'role');
		this.tray.setContextMenu(this.Menu.buildFromTemplate(this.trayMenuTemplate));
		return result;
	}
    /**
     * Set the tray icon to display when tray menu is active.
     * The recommended icon size is of 19 x 19 pixels using PNG format (ICO may be used also for Windows).
     *
     * @param icon as byte array
     */
	setTrayPressedIcon(icon){
		const pressedIcon = this.ipcRenderer.sendSync('ngdesktop-set-tray-icon',   Buffer.from(icon).toString('base64'), 'pressedTrayIcon'); //reset to default icon
		this.tray.setPressedImage(pressedIcon);
	}
	/**
	 * Set tray title to display next to the tray icon
	 *
	 * @param{string} title string
	 */
	setTrayTitle(title: string){
		this.tray.setTitle(title);
	}
	/**
	 * Set tray tooltip
	 *
	 * @param{string} tooltip string
	 */
	trayTooltip(tooltip: string) {
		this.tray.setToolTip(tooltip);
	}

    private executeOnCloseCallback = () => {
        if (!!this.callbackOnClose) {// not (null || undefined)
            this.servoyService.executeInlineScript(this.callbackOnClose.formname, this.callbackOnClose.script, []).then((result: any) => {
                this.ipcRenderer.send('ngdesktop-close-response', result);
            }).catch((err) => {
                console.log(err);
                this.ipcRenderer.send('ngdesktop-close-response', true);
                throw(err);
            });
        }
    };

    private addMenuImpl(text: string, index: number) {
        if (this.isCleanMenu()) {
            this.mainMenuTemplate = [];
            this.currentMenu = 'custom';
        }
        let addResultIndex = -1;
        const myMenu = {
            label: text,
            submenu: []
        };
        if (Number.isInteger(index)) {
            this.mainMenuTemplate.splice(index, 0, myMenu);
            addResultIndex = index;
        } else {
            this.mainMenuTemplate.push(myMenu);
            addResultIndex = this.mainMenuTemplate.length - 1;
        }
        return [this.mainMenuTemplate, addResultIndex];
    }

    private removeMenuItemImpl(menuIndex: number, position: number, itemIndex: number) {
        if (Number.isInteger(menuIndex) && (menuIndex >= 0 && menuIndex < this.mainMenuTemplate.length)) {
            let submenu = this.mainMenuTemplate[menuIndex].submenu as electron.MenuItemConstructorOptions[];
            let isSubmenu = false;
            if (Number.isInteger(itemIndex) && (itemIndex >= 0 && itemIndex < (this.mainMenuTemplate[menuIndex].submenu as electron.MenuItemConstructorOptions[]).length)) {
                submenu = submenu[itemIndex].submenu as electron.MenuItemConstructorOptions[];
                isSubmenu = true;
            }
            if (Number.isInteger(position)) {
                submenu.splice(position, 1);
                if (isSubmenu) {
                    if (submenu.length === 0) {//no submenu items => switch item from submenu to normal
                        this.mainMenuTemplate[menuIndex].submenu[itemIndex].type = 'normal';
                    }
                    this.mainMenuTemplate[menuIndex].submenu[itemIndex].submenu = submenu;
                } else {
                    this.mainMenuTemplate[menuIndex].submenu = submenu;
                }
            }
        }
        return this.mainMenuTemplate;
    }
    // eslint-disable-next-line max-len
    private addMenuItemImpl(menuIndex: number, text: string, role: ('undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'pasteAndMatchStyle' | 'delete' | 'selectAll' | 'reload' | 'forceReload' | 'toggleDevTools' | 'resetZoom' | 'zoomIn' | 'zoomOut' | 'togglefullscreen' | 'window' | 'minimize' | 'close' | 'help' | 'about' | 'services' | 'hide' | 'hideOthers' | 'unhide' | 'quit' | 'startSpeaking' | 'stopSpeaking' | 'zoom' | 'front' | 'appMenu' | 'fileMenu' | 'editMenu' | 'viewMenu' | 'recentDocuments' | 'toggleTabBar' | 'selectNextTab' | 'selectPreviousTab' | 'mergeAllWindows' | 'clearRecentDocuments' | 'moveTabToNewWindow' | 'windowMenu'),
                // eslint-disable-next-line max-len
                checked: boolean, callback: {formname: string; script: string}, position: number, itemIndex: number, type: ('normal' | 'separator' | 'submenu' | 'checkbox' | 'radio') | 'role'): number {
        let addResultIndex = -1;
        if (this.isCleanMenu()) {
            this.mainMenuTemplate = [];
            this.currentMenu = 'custom';
        }
        if (Number.isInteger(menuIndex) && (menuIndex >= 0 && menuIndex < this.mainMenuTemplate.length)) {
            this.currentMenu = 'custom';
            let submenu = this.mainMenuTemplate[menuIndex].submenu as electron.MenuItemConstructorOptions[];
            let isSubmenu = false;
            if (Number.isInteger(itemIndex) && (itemIndex >= 0 && itemIndex < (this.mainMenuTemplate[menuIndex].submenu as electron.MenuItemConstructorOptions[]).length)) {
                submenu = submenu[itemIndex].submenu as electron.MenuItemConstructorOptions[];
                isSubmenu = true;
            }
            const myItem: electron.MenuItemConstructorOptions = {};
            if (type === 'role') {
                if (text != null) {
                    myItem.label = text;
                }
                myItem.role = role;
            } else {
                if (text != null) {
                    myItem.label = text;
                }
                if (type != null) {
                    myItem.type = type;
                }
                if (checked != null) {
                    myItem.checked = checked;
                }
                if (callback != null) {
                    myItem.click = (clickedItem) => {
                        this.servoyService.executeInlineScript(callback.formname, callback.script, [clickedItem.label, clickedItem.type, clickedItem.checked]);
                    };
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
                    this.mainMenuTemplate[menuIndex].submenu[itemIndex].type = 'submenu';
                    this.mainMenuTemplate[menuIndex].submenu[itemIndex].submenu = submenu;
                } else {
                    this.mainMenuTemplate[menuIndex].submenu = submenu;
                }
            } else {
                if (isSubmenu) {
                    this.mainMenuTemplate[menuIndex].submenu[itemIndex].submenu = submenu.concat([myItem]);
                    addResultIndex = this.mainMenuTemplate[menuIndex].submenu[itemIndex].submenu.length - 1;
                } else {
                    this.mainMenuTemplate[menuIndex].submenu = submenu.concat([myItem]);
                    addResultIndex = (this.mainMenuTemplate[menuIndex].submenu as electron.MenuItemConstructorOptions[]).length - 1;
                }
            }
        }
        return addResultIndex;
    }

      // eslint-disable-next-line max-len
    private addTrayMenuItemImpl(menuIndex: number, text: string, role: ('undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'pasteAndMatchStyle' | 'delete' | 'selectAll' | 'reload' | 'forceReload' | 'toggleDevTools' | 'resetZoom' | 'zoomIn' | 'zoomOut' | 'togglefullscreen' | 'window' | 'minimize' | 'close' | 'help' | 'about' | 'services' | 'hide' | 'hideOthers' | 'unhide' | 'quit' | 'startSpeaking' | 'stopSpeaking' | 'zoom' | 'front' | 'appMenu' | 'fileMenu' | 'editMenu' | 'viewMenu' | 'recentDocuments' | 'toggleTabBar' | 'selectNextTab' | 'selectPreviousTab' | 'mergeAllWindows' | 'clearRecentDocuments' | 'moveTabToNewWindow' | 'windowMenu'),
      callback: {formname: string; script: string}, checked: boolean, type: ('normal' | 'separator' | 'checkbox' | 'role')) {
      let addResultIndex = -1;
      if (Number.isInteger(menuIndex) && (menuIndex >=0)) {
          const myItem: electron.MenuItemConstructorOptions = {};
          if (type === 'role') {
              if (text != null) {
                  myItem.label = text;
              }
              myItem.role = role;
          } else {
              if (text != null) {
                  myItem.label = text;
              }
              if (type != null) {
                  myItem.type = type;
              }
              if (checked != null) {
                  myItem.checked = checked;
              }
              if (callback != null) {
                  myItem.click = (clickedItem) => {
                      this.servoyService.executeInlineScript(callback.formname, callback.script, [clickedItem.label, clickedItem.type, clickedItem.checked]);
                  };
              }
          }
          if (menuIndex < this.trayMenuTemplate.length) {
              this.trayMenuTemplate.splice(menuIndex, 0, myItem);
              addResultIndex = menuIndex;
          } else {
              this.trayMenuTemplate.push(myItem);
              addResultIndex = this.trayMenuTemplate.length - 1;
          }
      }
      return addResultIndex;
  }

  private removeTrayMenuItemImpl(menuIndex: number) {
      if (Number.isInteger(menuIndex) && menuIndex >=0) {
          if (menuIndex >= this.trayMenuTemplate.length) {
              menuIndex = this.trayMenuTemplate.length - 1;
          }
          if (this.trayMenuTemplate.length > 0) {
              this.trayMenuTemplate.splice(menuIndex, 1);
          }
      }
      return this.trayMenuTemplate;
  }

}
