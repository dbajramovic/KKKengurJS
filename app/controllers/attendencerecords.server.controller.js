'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Attendencerecord = mongoose.model('Attendencerecord'),
	_ = require('lodash');

/**
 * Create a Attendencerecord
 */
exports.create = function(req, res) {
	var attendencerecord = new Attendencerecord(req.body);
	attendencerecord.user = req.user;

	attendencerecord.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(attendencerecord);
		}
	});
};

/**
 * Show the current Attendencerecord
 */
exports.read = function(req, res) {
	res.jsonp(req.attendencerecord);
};

/**
 * Update a Attendencerecord
 */
exports.update = function(req, res) {
	var attendencerecord = req.attendencerecord ;

	attendencerecord = _.extend(attendencerecord , req.body);

	attendencerecord.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(attendencerecord);
		}
	});
};

/**
 * Delete an Attendencerecord
 */
exports.delete = function(req, res) {
	var attendencerecord = req.attendencerecord ;

	attendencerecord.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(attendencerecord);
		}
	});
};

/**
 * List of Attendencerecords
 */
exports.list = function(req, res) { 
	Attendencerecord.find().sort('-created').populate('user', 'displayName').exec(function(err, attendencerecords) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(attendencerecords);
		}
	});
};

/**
 * Attendencerecord middleware
 */
exports.attendencerecordByID = function(req, res, next, id) { 
	Attendencerecord.findById(id).populate('user', 'displayName').exec(function(err, attendencerecord) {
		if (err) return next(err);
		if (! attendencerecord) return next(new Error('Failed to load Attendencerecord ' + id));
		req.attendencerecord = attendencerecord ;
		next();
	});
};

/**
 * Attendencerecord authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.attendencerecord.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
