'use strict';

// Configuring the Articles module
angular.module('attendences').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Attendences', 'attendences', 'dropdown', '/attendences(/create)?');
		Menus.addSubMenuItem('topbar', 'attendences', 'List Attendences', 'attendences');
		Menus.addSubMenuItem('topbar', 'attendences', 'New Attendence', 'attendences/create');
	}
]);