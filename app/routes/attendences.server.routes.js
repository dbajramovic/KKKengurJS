'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var attendences = require('../../app/controllers/attendences.server.controller');

	// Attendences Routes
	app.route('/attendences')
		.get(attendences.list)
		.post(users.requiresLogin, attendences.create);

	app.route('/attendences/:attendenceId')
		.get(attendences.read)
		.put(users.requiresLogin, attendences.hasAuthorization, attendences.update)
		.delete(users.requiresLogin, attendences.hasAuthorization, attendences.delete);

	// Finish by binding the Attendence middleware
	app.param('attendenceId', attendences.attendenceByID);
};
