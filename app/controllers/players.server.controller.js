'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Player = mongoose.model('Player'),
	_ = require('lodash');
var	multiparty = require('connect-multiparty');
var	multipartyMiddleware = multiparty();
var cloudinary = require('cloudinary');
	
cloudinary.config({
    cloud_name: 'kengurjs',
    api_key: '851699676193425',
    api_secret: 'x8lFku7EaGssmWvCetvjGPjgkOs'
});
/**
 * Create a Player
 */
exports.create = function(req, res) {
    var pla = JSON.parse(req.body.player);
    var player = new Player(pla);
    cloudinary.uploader.upload(req.files.file.path, function (result) {
        cloudinary.uploader.upload(req.files.file.path, function (resu) {
            player.imageLink = result.secure_url;
            player.imageLinkId = result.public_id;
            player.imageThumb = resu.secure_url;
            player.imageThumbId = resu.public_id;
            player.save(function (err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)});
                	}
                    res.json(player);
                }
            );
           //});
            //});
        }, {width: 200, height: 200, crop: 'thumb', gravity: 'face'});
    }, {width: 400, height: 400, crop: 'limit'});
};

/**
 * Show the current Player
 */
exports.read = function(req, res) {
	res.jsonp(req.player);
};

/**
 * Update a Player
 */
exports.update = function(req, res) {
	var player = req.player ;

	player = _.extend(player , req.body);

	player.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(player);
		}
	});
};

/**
 * Delete an Player
 */
exports.delete = function(req, res) {
	var player = req.player ;

	player.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(player);
		}
	});
};

/**
 * List of Players
 */
exports.list = function(req, res) { 
	Player.find().sort('-created').populate('user', 'displayName').exec(function(err, players) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(players);
		}
	});
};

/**
 * Player middleware
 */
exports.playerByID = function(req, res, next, id) { 
	Player.findById(id).populate('user', 'displayName').exec(function(err, player) {
		if (err) return next(err);
		if (! player) return next(new Error('Failed to load Player ' + id));
		req.player = player ;
		next();
	});
};

/**
 * Player authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.player.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
