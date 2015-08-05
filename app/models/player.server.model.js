'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Player Schema
 */
var PlayerSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Player name',
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
    year: {
        type: Date
    },
    picture: {
      type:String,
        default:'http://res.cloudinary.com/kengurjs/image/upload/c_pad,r_30,w_90/v1438201378/basketball-player1_ybrks8.png'
    }
});

mongoose.model('Player', PlayerSchema);
