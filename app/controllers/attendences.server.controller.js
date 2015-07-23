'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Attendence = mongoose.model('Attendence'),
	_ = require('lodash');

/**
 * Create a Attendence
 */
exports.create = function(req, res) {
	var attendence = new Attendence(req.body);
	attendence.user = req.user;

	attendence.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(attendence);
		}
	});
};

/**
 * Show the current Attendence
 */
exports.read = function(req, res) {
	res.jsonp(req.attendence);
};

/**
 * Update a Attendence
 */
exports.update = function(req, res) {
	var attendence = req.attendence ;

	attendence = _.extend(attendence , req.body);

	attendence.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(attendence);
		}
	});
};

/**
 * Delete an Attendence
 */
exports.delete = function(req, res) {
	var attendence = req.attendence ;

	attendence.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(attendence);
		}
	});
};

/**
 * List of Attendences
 */
exports.list = function(req, res) { 
	Attendence.find().sort('-created').populate('user', 'displayName').exec(function(err, attendences) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(attendences);
		}
	});
};

/**
 * Attendence middleware
 */
exports.attendenceByID = function(req, res, next, id) { 
	Attendence.findById(id).populate('user', 'displayName').exec(function(err, attendence) {
		if (err) return next(err);
		if (! attendence) return next(new Error('Failed to load Attendence ' + id));
		req.attendence = attendence ;
		next();
	});
};

/**
 * Attendence authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.attendence.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
