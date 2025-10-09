{
	"name": "ngdesktopui",
	"displayName": "NGDesktop UI",
	"version": 1,
 	"definition": "ngdesktopui/ngdesktopui/ngdesktopui.js",
 	"doc": "ngdesktopui/ngdesktopui/ngdesktopui_doc.js",
	"serverscript": "ngdesktopui/ngdesktopui/ngdesktopui_server.js",
	"libraries": [],
	"ng2Config": {
       "packageName": "@servoy/ngdesktopui",
       "serviceName": "NGDesktopUIService",
       "entryPoint": "dist/servoy/ngdesktopui"
    },
    "model": {
    	"trayMenu": {"type": "trayMenu", "tags": { "scope": "private"} },
    	"ngdesktopMenu": {
    		"type": "JSMenu",
    		"pushToServer": "shallow",
    		"tags": { 
    			"doc": "Menu property for NGDesktop-specific menu configuration with Electron features.",
    			"scope": "design"
    		},
    		"extraPropertiesCategory": "NGDesktop",
    		"extraProperties": {
    			"role": {
    				"type": "string",
    				"values": [null, "about", "appMenu", "clearRecentDocuments", "close", "copy", "cut", "delete", "editMenu", "fileMenu", "forceReload", "front", "help", "hide", "hideOthers", "mergeAllWindows", "minimize", "moveTabToNewWindow", "paste", "pasteAndMatchStyle", "quit", "recentDocuments", "redo", "reload", "resetZoom", "selectAll", "selectNextTab", "selectPreviousTab", "services", "startSpeaking", "stopSpeaking", "toggleDevTools", "toggleTabBar", "togglefullscreen", "undo", "unhide", "viewMenu", "window", "windowMenu", "zoom", "zoomIn", "zoomOut"],
    				"tags": { "doc": "Electron role for native OS behavior (e.g., 'quit', 'copy', 'paste'). When set, the menu item will have native functionality and icon. Use 'none' or null to skip role assignment." }
    			},
    			"accelerator": {
    				"type": "string",
    				"tags": { "doc": "Keyboard shortcut for the menu item (e.g., 'CmdOrCtrl+S', 'Alt+F4', 'Shift+Ctrl+Z')." }
    			},
    			"type": {
    				"type": "string",
    				"default": "normal",
    				"values": [null, "normal", "separator", "checkbox", "radio"],
    				"tags": { "doc": "Type of menu item: 'normal' (default), 'separator' (divider line), 'checkbox' (toggle), or 'radio' (radio button). Use null to reset to default." }
    			},
    			"checked": {
    				"type": "boolean",
    				"default": false,
    				"tags": { "doc": "Checked state for checkbox or radio menu items. Only applicable when type is 'checkbox' or 'radio'." }
    			},
    			"sublabel": {
    				"type": "string",
    				"tags": { "doc": "Secondary descriptive text shown below the menu item label (macOS only)." }
    			}
    		}
    	}
    },
    "internalApi": {
    	"done": {}
    },
 	"api":
 	{
 		"addMenu": {
 			"parameters": [
 				{"name": "text", "type": "string"},
 				{"name": "index", "type": "int", "optional": true}			
 			],
 			"returns": "int",
			"deprecated": "\nUse setMenu() or updateMenu() with JSMenu from menu designer instead"
 		},
 		"addDevToolsMenu": {
 			"returns": "int"

		},
 		"removeMenu": {
 			"parameters": [
 				{"name": "index", "type": "int"}
 			],
			"deprecated": "\nUse setMenu() or updateMenu() with JSMenu from menu designer instead"
 		},
 		"getMenuIndexByText": {
 			"parameters": [
 				{"name": "text", "type": "string"}
 			],
 			"returns": "int",
			"deprecated": "\nUse setMenu() or updateMenu() with JSMenu from menu designer instead"
 		},
 		"getMenuText": {
 			"parameters": [
 				{"name": "index", "type": "int"}
 			],
 			"returns": "string",
			"deprecated": "\nUse setMenu() or updateMenu() with JSMenu from menu designer instead"
 		},
 		"getMenuCount": {
 			"returns": "int",
			"deprecated": "\nUse setMenu() or updateMenu() with JSMenu from menu designer instead"
 		},
 		"removeAllMenus": {},
		"resetMenuToDefault": {},
 		"setMenuBarVisibility": {
 			"parameters": [
 				{"name": "visible", "type": "boolean"}
 			]
 		},
 		"removeAllMenuItems": {
 			"parameters": [
 				{"name": "index", "type": "int"},
 				{"name": "itemIndex", "type": "int", "optional": true}
 			],
			"deprecated": "\nUse setMenu() or updateMenu() with JSMenu from menu designer instead"
 		},
 		"addSeparator": {
 			"parameters": [
 				{"name": "index", "type": "int"},
 				{"name": "position", "type": "int", "optional": true},
 				{"name": "itemIndex", "type": "int", "optional": true}
 			],
 			"returns": "int",
			"deprecated": "\nUse setMenu() or updateMenu() with JSMenu from menu designer instead"
 		},
 		"addMenuItem": {
 			"parameters": [
 				{"name": "index", "type": "int"},
 				{"name": "text", "type": "string"},
 				{"name": "callback", "type": "function"},
 				{"name": "position", "type": "int", "optional": true},			
 				{"name": "itemIndex", "type": "int", "optional": true}			
 			],
 			"deprecated": "\nUse setMenu() or updateMenu() with JSMenu from menu designer instead",
 			"returns": "int"
 		},
 		"removeMenuItem": {
 			"parameters": [
 				{"name": "index", "type": "int"},
 				{"name": "position", "type": "int"},
 				{"name": "itemIndex", "type": "int", "optional": true}
 			],
			"deprecated": "\nUse setMenu() or updateMenu() with JSMenu from menu designer instead"
 		},
 		"getMenuItemIndexByText": {
 			"parameters": [
 				{"name": "index", "type": "int"},
 				{"name": "text", "type": "string"}
 			],
 			"returns": "int",
			"deprecated": "\nUse setMenu() or updateMenu() with JSMenu from menu designer instead"
 		},	
 		"getMenuItemText": {
 			"parameters": [
 				{"name": "index", "type": "int"},
 				{"name": "itemIndex", "type": "int"}
 			],
 			"returns": "string",
			"deprecated": "\nUse setMenu() or updateMenu() with JSMenu from menu designer instead"
 		},	
 		"getMenuItemsCount": {
 			"parameters": [
 				{"name": "index", "type": "int"},
 				{"name": "itemIndex", "type": "int", "optional": true}
 			],
 			"returns": "int",
			"deprecated": "\nUse setMenu() or updateMenu() with JSMenu from menu designer instead"
 		},	
 		"addCheckBox": {
 			"parameters": [
 				{"name": "index", "type": "int"},
 				{"name": "text", "type": "string"},
 				{"name": "callback", "type": "function"},
 				{"name": "checked", "type": "boolean", "optional": true},
 				{"name": "position", "type": "int", "optional": true},
 				{"name": "itemIndex", "type": "int", "optional": true} 				
 			],
 			"returns": "int",
			"deprecated": "\nUse setMenu() or updateMenu() with JSMenu from menu designer instead"
 		},
 		"addRadioButton": {
 			"parameters": [
 				{"name": "index", "type": "int"},
 				{"name": "text", "type": "string"},
 				{"name": "callback", "type": "function"},
 				{"name": "selected", "type": "boolean", "optional": true},			
 				{"name": "position", "type": "int", "optional": true},
 				{"name": "itemIndex", "type": "int", "optional": true}
 			],
 			"returns": "int",
			"deprecated": "\nUse setMenu() or updateMenu() with JSMenu from menu designer instead"
 		},
 		"addRoleItem": {
 			"parameters": [
 				{"name": "index", "type": "int"},
 				{"name": "role", "type": "string"},
 				{"name": "text", "type": "string", "optional": true},			
 				{"name": "position", "type": "int", "optional": true},	
 				{"name": "itemIndex", "type": "int", "optional": true}
 			],
 			"returns": "int",
			"deprecated": "\nUse setMenu() or updateMenu() with JSMenu from menu designer instead"
 		},
		"createBrowserView": {
			"parameters" : [
				{"name":"x", "type":"int"},
				{"name":"y", "type":"int"},
				{"name":"width", "type":"int"},
				{"name":"height", "type":"int"},
				{"name":"url", "type":"string"}
			],
			"returns":"int"
		},
		"closeBrowserView": {
			"parameters" : [
				{"name":"id", "type":"int"}
			]
		},
		"injectJSIntoBrowserView": {
			"parameters" : [
				{"name":"id", "type":"int"},
				{"name":"js", "type":"string"},
				{"name":"callback", "type":"function"}
			]
		},
		"getZoomFactor": {
			"returns": "double"
		},
		"setZoomFactor": {
			"parameters" : [
				{"name": "factor", "type": "double"}
			],
			"returns": "boolean"
		},
		"showWindow": {},
		"hideWindow": {},
		"maximizeWindow": {},
		"unmaximizeWindow": {},
		"minimizeWindow": {},
		"restoreWindow": {},
		"setWindowSize": {
			"parameters" : [
				{"name":"width", "type":"int"},
				{"name":"height", "type":"int"}
			]
		},
		"setFullScreen": {
			"parameters" : [
				{"name":"flag", "type":"boolean"}
			]
		},
		"getWindowSize": {
			"returns": "int[]"
		},
		"isMinimized": {
			"returns": "boolean"
		},
		"isMaximized": {
			"returns": "boolean"
		},
		"isFullScreen": {
			"returns": "boolean"
		},
		"isNormal": {
			"returns": "boolean"
		},
		"isVisible": {
			"returns": "boolean"
		},
		"registerOnCloseMethod": {
			"parameters": [
				{"name": "callback", "type": "function"}
			],
			"returns": "boolean"
		},
		"unregisterOnCloseMethod": {},
		"useDefaultBrowserForExternalLinks": {
			"parameters" : [
				{"name":"flag", "type":"boolean"}
			]
		},
		"createTrayMenu": {
			"returns": "trayMenu"
		},
		"setMenu": {
			"parameters": [
				{"name": "menu", "type": "JSMenu"},
				{"name": "callback", "type": "function", "optional": true}
			],
			"returns": "boolean"
		},
		"updateMenu": {
			"parameters": [
				{"name": "menu", "type": "JSMenu"},
				{"name": "callback", "type": "function", "optional": true}
			],
			"returns": "boolean"
		},
		"getMenuAPIMode": {
			"returns": "string"
		}
 	},
	"types": {
	  "trayMenu": {
  		"title": "string",
  		"tooltip": "string",
  		"icon": "byte[]",
  		"pressedIcon": "byte[]",
  		"trayMenuItems": {"type": "trayMenuItem[]", "tags": { "scope": "private"} }
	  },
	  "trayMenuItem": {
	  	"label": "string",
	  	"type": "string",
		"role": "string",
	  	"checked": "boolean",
	  	"click": "function"
	  }
	}
 }