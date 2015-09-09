'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var galleryitems = require('../../app/controllers/galleryitems.server.controller');
	var multiparty = require('connect-multiparty'),multipartyMiddleware = multiparty();
	// Galleryitems Routes
	app.route('/galleryitems')
		.get(galleryitems.list)
		.post(users.requiresLogin,  multipartyMiddleware, galleryitems.create);

	app.route('/galleryitems/:galleryitemId')
		.get(galleryitems.read)
		.put(users.requiresLogin, galleryitems.hasAuthorization, galleryitems.update)
		.delete(users.requiresLogin, galleryitems.hasAuthorization, galleryitems.delete);

	// Finish by binding the Galleryitem middleware
	app.param('galleryitemId', galleryitems.galleryitemByID);
};
