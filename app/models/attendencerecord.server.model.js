'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Attendencerecord Schema
 */
var AttendencerecordSchema = new Schema({
	attendence: {
        type: Schema.ObjectId,
        ref: 'Attendence',
        required: true
    },
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    date: {
        type: Date,
        required: true
    },
    player: {
        type:Schema.ObjectId,
        ref:'Player',
        required : true
    },
    wasattending: {
        type: Boolean,
        default: false,
        required: true
    }
});

mongoose.model('Attendencerecord', AttendencerecordSchema);
