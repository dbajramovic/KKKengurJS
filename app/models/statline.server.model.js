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
        ref: 'Competition'
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
        ref: 'Player'
    },
    points: {
        type:String,
        default: 'N/A'
    },
    fouls: {
        type:String,
        default: 'N/A'
    },
    rebounds: {
        type:String,
        default: 'N/A'
    },
    twopointpct: {
        type:String,
        default:'N/A'
    },
    threepointpct: {
        type:String,
        default:'N/A'
    },
    onepointpct: {
        type:String,
        default:'N/A'
    }
});

mongoose.model('Statline', StatlineSchema);
