'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Comment Schema
 */
var CommentSchema = new Schema({
    article: {
      type:Schema.ObjectId,
        ref: 'Article',
        required:true
    },
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    text: {
        type:String,
        default:''
    }
});

mongoose.model('Comment', CommentSchema);
