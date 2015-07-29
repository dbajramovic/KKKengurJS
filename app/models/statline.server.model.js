'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Statline Schema
 */
var StatlineSchema = new Schema({
	competition: {
        type: Schema.ObjectId,
        ref: 'Competition',
        required: 'true'
    },
    name: {
      type: String
    },
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    player: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    points: {
        type:Number,
        default: 0
    },
    fouls: {
        type:Number,
        default: 0
    }
});

mongoose.model('Statline', StatlineSchema);
