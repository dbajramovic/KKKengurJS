'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var statlines = require('../../app/controllers/statlines.server.controller');

	// Statlines Routes
	app.route('/statlines')
		.get(statlines.list)
		.post(users.requiresLogin, statlines.create);

	app.route('/statlines/:statlineId')
		.get(statlines.read)
		.put(users.requiresLogin, statlines.hasAuthorization, statlines.update)
		.delete(users.requiresLogin, statlines.hasAuthorization, statlines.delete);

	// Finish by binding the Statline middleware
	app.param('statlineId', statlines.statlineByID);
};
