'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Statline = mongoose.model('Statline'),
	_ = require('lodash');

/**
 * Create a Statline
 */
exports.create = function(req, res) {
	var statline = new Statline(req.body);
	statline.user = req.user;

	statline.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(statline);
		}
	});
};

/**
 * Show the current Statline
 */
exports.read = function(req, res) {
	res.jsonp(req.statline);
};

/**
 * Update a Statline
 */
exports.update = function(req, res) {
	var statline = req.statline ;

	statline = _.extend(statline , req.body);

	statline.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(statline);
		}
	});
};

/**
 * Delete an Statline
 */
exports.delete = function(req, res) {
	var statline = req.statline ;

	statline.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(statline);
		}
	});
};

/**
 * List of Statlines
 */
exports.list = function(req, res) { 
	Statline.find().sort('-created').populate('user', 'displayName').exec(function(err, statlines) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(statlines);
		}
	});
};

/**
 * Statline middleware
 */
exports.statlineByID = function(req, res, next, id) { 
	Statline.findById(id).populate('user', 'displayName').exec(function(err, statline) {
		if (err) return next(err);
		if (! statline) return next(new Error('Failed to load Statline ' + id));
		req.statline = statline ;
		next();
	});
};

/**
 * Statline authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.statline.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
