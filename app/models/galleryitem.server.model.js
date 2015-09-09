'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Galleryitem Schema
 */
var GalleryitemSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Galleryitem name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	imageLink: {
        type: String,
        default: '',
        trim: true
    },
    imageLinkId: {
        type: String,
        default: '',
        trim: true
    },
    imageThumb: {
        type: String,
        default: '',
        trim: true
    },
    imageThumbId: {
        type: String,
        default: '',
        trim: true
    }
});

mongoose.model('Galleryitem', GalleryitemSchema);