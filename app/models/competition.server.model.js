'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Competition Schema
 */
var CompetitionSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Competition name',
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
    description: {
        type: String,
        default: 'Nema opisa'
    },
    date: {
        type:Date
    }
});

mongoose.model('Competition', CompetitionSchema);
