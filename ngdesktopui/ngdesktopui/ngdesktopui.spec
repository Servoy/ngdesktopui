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
    	"trayMenu": {"type": "trayMenu", "tags": { "scope": "private"} }
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
 			"returns": "int"
 		},
 		"addDevToolsMenu": {
 			"returns": "int"

		},
 		"removeMenu": {
 			"parameters": [
 				{"name": "index", "type": "int"}
 			]
 		},
 		"getMenuIndexByText": {
 			"parameters": [
 				{"name": "text", "type": "string"}
 			],
 			"returns": "int"
 		},
 		"getMenuText": {
 			"parameters": [
 				{"name": "index", "type": "int"}
 			],
 			"returns": "string"
 		},
 		"getMenuCount": {
 			"returns": "int"
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
 			]
 		},
 		"addSeparator": {
 			"parameters": [
 				{"name": "index", "type": "int"},
 				{"name": "position", "type": "int", "optional": true},
 				{"name": "itemIndex", "type": "int", "optional": true}
 			],
 			"returns": "int"
 		},
 		"addMenuItem": {
 			"parameters": [
 				{"name": "index", "type": "int"},
 				{"name": "text", "type": "string"},
 				{"name": "callback", "type": "function"},
 				{"name": "position", "type": "int", "optional": true},			
 				{"name": "itemIndex", "type": "int", "optional": true}			
 			],
 			"returns": "int"
 		},
 		"removeMenuItem": {
 			"parameters": [
 				{"name": "index", "type": "int"},
 				{"name": "position", "type": "int"},
 				{"name": "itemIndex", "type": "int", "optional": true}
 			]
 		},
 		"getMenuItemIndexByText": {
 			"parameters": [
 				{"name": "index", "type": "int"},
 				{"name": "text", "type": "string"}
 			],
 			"returns": "int"
 		},	
 		"getMenuItemText": {
 			"parameters": [
 				{"name": "index", "type": "int"},
 				{"name": "itemIndex", "type": "int"}
 			],
 			"returns": "string"
 		},	
 		"getMenuItemsCount": {
 			"parameters": [
 				{"name": "index", "type": "int"},
 				{"name": "itemIndex", "type": "int", "optional": true}
 			],
 			"returns": "int"
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
 			"returns": "int"
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
 			"returns": "int"
 		},
 		"addRoleItem": {
 			"parameters": [
 				{"name": "index", "type": "int"},
 				{"name": "role", "type": "string"},
 				{"name": "text", "type": "string", "optional": true},			
 				{"name": "position", "type": "int", "optional": true},	
 				{"name": "itemIndex", "type": "int", "optional": true}
 			],
 			"returns": "int"
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