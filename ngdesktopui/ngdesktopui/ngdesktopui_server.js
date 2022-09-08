var trayMenuItems = [];

var TrayMenuItem = {
	setLabel: function(label) {
		if (label) this.label = label;
	},
	setRole: function(role) {
		if (role) this.role = role;
	},
	setType: function(type) {
		if (type && type != 'role') this.type = type;
	},
	setChecked: function(checked) {
		if (checked) this.checked = checked;
	},
	setCallback: function(callback) {
		if (callback) this.click = callback;
	}

}

var TrayMenu = {
    addTrayMenuItem: function(menuIndex, text, role, callback, checked, type) {
        if (Number.isInteger(menuIndex) && (menuIndex >=0)) {
            var trayMenuItem = Object.create(TrayMenuItem);
            trayMenuItem.setLabel(text);
			trayMenuItem.setType(type);
			trayMenuItem.setChecked(checked);
			trayMenuItem.setCallback(callback);
			trayMenuItem.setRole(role);
			
            if (menuIndex < $scope.model.trayMenu.trayMenuItems.length) {
            	trayMenuItems.splice(menuIndex, 0, trayMenuItem);
            } else {
            	trayMenuItems.push(trayMenuItem);
            }
            $scope.model.trayMenu.trayMenuItems = trayMenuItems;
        }
    },
	/**
	 * Add tray menu items to existing tray menu.
	 * 
	 * @param {int} index - menuitem index
	 * @param {string} text - menuitem text
	 * @param {function} callback - callback function to call
	 *                   The callback function will receive:
	 *                       - text of the clicked item 
	 *                       - type of the clicked item ("normal", "radio", "checkbox")
	 *                       - checked value for checkboxes and radio buttons, otherwise undefined
	 * 
	 * @return {int} - the index of the added menu item
	 */
	addMenuItem: function(index, text, callback) {
    	this.addTrayMenuItem(index, text, null, callback, null, "normal");
    },

	/**
	 * Remove tray menu item from existing tray menu.
	 * 
	 * @param {int} index - menuitem index
	 */
	removeMenuItem: function(menuIndex) {
		if (Number.isInteger(menuIndex) && menuIndex >=0) {
			if (menuIndex >= trayMenuItems.length) {
				menuIndex = trayMenuItems.length - 1;
			}
			if (trayMenuItems.length > 0) {
				trayMenuItems.splice(menuIndex, 1);
			}		
		}
		$scope.model.trayMenu.trayMenuItems = trayMenuItems;
	},

	/**
	 * Add separator line to the tray menu
	 * 
	 * 
	 * @param {int} index - position to add separator
	 * 
	 * @return {int} - the index of the added separator
	 */
	addSeparator: function(index){
		this.addTrayMenuItem(index, null, null, null, null, "separator");
	},

	/**
	 * Add checkbox to the tray menu
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
	 * 
	 * @return {int} - the index of the added checkbox
	 */
	addCheckBox: function(index, text, callback, checked) {
		this.addTrayMenuItem(index, text, null, callback, checked, "checkbox");
	},
	/**
	 * Add a menuitem to the system tray having a standard native system behavior. 
	 * For complete allowed value list: https://github.com/Servoy/ngdesktopui
	 * 
	 * @param {int} index - menu index
	 * @param {string} role - item role. 
	 * @param {string} [text] - menuitem text; when not specified the System will provide a standard (localized) one
	 * 
	 * @return {int} - the index of the added role item
	 * 
	 */
	addRoleItem: function(index, role, text) {
		this.addTrayMenuItem(index, text, role, null, null, "role");
	},
    done: function() {
        $scope.api.done();
    }
}



$scope.api.createTrayMenu = function () {
	if (!$scope.model.trayMenu) {
 		$scope.model.trayMenu = Object.create(TrayMenu);
 	}
 	$scope.model.trayMenu.trayMenuItems = [];
    return $scope.model.trayMenu;
}