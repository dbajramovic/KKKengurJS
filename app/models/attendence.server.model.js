'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Attendence Schema
 */
var AttendenceSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Attendence name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Attendence', AttendenceSchema);
