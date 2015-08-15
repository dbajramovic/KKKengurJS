'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Article = mongoose.model('Article'),
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
 * Create a article
 */
exports.create = function(req, res) {
	var art = JSON.parse(req.body.article);
    var article = new Article(art);
    cloudinary.uploader.upload(req.files.file.path, function (result) {
        cloudinary.uploader.upload(req.files.file.path, function (resu) {
            article.imageLink = result.secure_url;
            article.imageLinkId = result.public_id;
            article.imageThumb = resu.secure_url;
            article.imageThumbId = resu.public_id;
            article.save(function (err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)});
                	}
                    res.json(article);
                }
            );
           //});
            //});
        }, {width: 200, height: 200, crop: 'thumb', gravity: 'face', radius: '20'});
    }, {width: 1600, height: 900, crop: 'limit', border: { width: 4, color: '#553311' } });
};

/**
 * Show the current article
 */
exports.read = function(req, res) {
	res.json(req.article);
};

/**
 * Update a article
 */
exports.update = function(req, res) {
	var article = req.article;

	article = _.extend(article, req.body);

	article.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(article);
		}
	});
};

/**
 * Delete an article
 */
exports.delete = function(req, res) {
	var article = req.article;

	article.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(article);
		}
	});
};

/**
 * List of Articles
 */
exports.list = function(req, res) {
	Article.find().sort('-created').populate('user', 'displayName').exec(function(err, articles) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(articles);
		}
	});
};

/**
 * Article middleware
 */
exports.articleByID = function(req, res, next, id) {
	Article.findById(id).populate('user', 'displayName').exec(function(err, article) {
		if (err) return next(err);
		if (!article) return next(new Error('Failed to load article ' + id));
		req.article = article;
		next();
	});
};

/**
 * Article authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.article.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
