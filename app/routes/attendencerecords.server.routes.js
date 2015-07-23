'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var attendencerecords = require('../../app/controllers/attendencerecords.server.controller');

	// Attendencerecords Routes
	app.route('/attendencerecords')
		.get(attendencerecords.list)
		.post(users.requiresLogin, attendencerecords.create);

	app.route('/attendencerecords/:attendencerecordId')
		.get(attendencerecords.read)
		.put(users.requiresLogin, attendencerecords.hasAuthorization, attendencerecords.update)
		.delete(users.requiresLogin, attendencerecords.hasAuthorization, attendencerecords.delete);

	// Finish by binding the Attendencerecord middleware
	app.param('attendencerecordId', attendencerecords.attendencerecordByID);
};
