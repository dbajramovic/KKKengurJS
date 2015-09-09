'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Galleryitem = mongoose.model('Galleryitem'),
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
 * Create a Galleryitem
 */
exports.create = function(req, res) {
	console.log(req);
	var gal = JSON.parse(req.body.galleryitem);
    var galleryitem = new Galleryitem(gal);
    cloudinary.uploader.upload(req.files.file.path, function (result) {
        cloudinary.uploader.upload(req.files.file.path, function (resu) {
            galleryitem.imageLink = result.secure_url;
            galleryitem.imageLinkId = result.public_id;
            galleryitem.imageThumb = resu.secure_url;
            galleryitem.imageThumbId = resu.public_id;
            galleryitem.save(function (err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)});
                	}
                    res.json(galleryitem);
                }
            );
           //});
            //});
        }, {width: 100, height: 100, crop: 'thumb'});
    }, {width: 1600, height: 900, crop: 'limit', border: { width: 4, color: '#553311' } });
};

/**
 * Show the current Galleryitem
 */
exports.read = function(req, res) {
	res.jsonp(req.galleryitem);
};

/**
 * Update a Galleryitem
 */
exports.update = function(req, res) {
	var galleryitem = req.galleryitem ;

	galleryitem = _.extend(galleryitem , req.body);

	galleryitem.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(galleryitem);
		}
	});
};

/**
 * Delete an Galleryitem
 */
exports.delete = function(req, res) {
	var galleryitem = req.galleryitem ;

	galleryitem.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(galleryitem);
		}
	});
};

/**
 * List of Galleryitems
 */
exports.list = function(req, res) { 
	Galleryitem.find().sort('-created').populate('user', 'displayName').exec(function(err, galleryitems) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(galleryitems);
		}
	});
};

/**
 * Galleryitem middleware
 */
exports.galleryitemByID = function(req, res, next, id) { 
	Galleryitem.findById(id).populate('user', 'displayName').exec(function(err, galleryitem) {
		if (err) return next(err);
		if (! galleryitem) return next(new Error('Failed to load Galleryitem ' + id));
		req.galleryitem = galleryitem ;
		next();
	});
};

/**
 * Galleryitem authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.galleryitem.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
