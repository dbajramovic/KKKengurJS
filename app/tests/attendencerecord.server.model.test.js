'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Attendencerecord = mongoose.model('Attendencerecord');

/**
 * Globals
 */
var user, attendencerecord;

/**
 * Unit tests
 */
describe('Attendencerecord Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			attendencerecord = new Attendencerecord({
				name: 'Attendencerecord Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return attendencerecord.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			attendencerecord.name = '';

			return attendencerecord.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Attendencerecord.remove().exec();
		User.remove().exec();

		done();
	});
});