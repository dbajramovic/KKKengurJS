'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Attendencerecord = mongoose.model('Attendencerecord'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, attendencerecord;

/**
 * Attendencerecord routes tests
 */
describe('Attendencerecord CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Attendencerecord
		user.save(function() {
			attendencerecord = {
				name: 'Attendencerecord Name'
			};

			done();
		});
	});

	it('should be able to save Attendencerecord instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Attendencerecord
				agent.post('/attendencerecords')
					.send(attendencerecord)
					.expect(200)
					.end(function(attendencerecordSaveErr, attendencerecordSaveRes) {
						// Handle Attendencerecord save error
						if (attendencerecordSaveErr) done(attendencerecordSaveErr);

						// Get a list of Attendencerecords
						agent.get('/attendencerecords')
							.end(function(attendencerecordsGetErr, attendencerecordsGetRes) {
								// Handle Attendencerecord save error
								if (attendencerecordsGetErr) done(attendencerecordsGetErr);

								// Get Attendencerecords list
								var attendencerecords = attendencerecordsGetRes.body;

								// Set assertions
								(attendencerecords[0].user._id).should.equal(userId);
								(attendencerecords[0].name).should.match('Attendencerecord Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Attendencerecord instance if not logged in', function(done) {
		agent.post('/attendencerecords')
			.send(attendencerecord)
			.expect(401)
			.end(function(attendencerecordSaveErr, attendencerecordSaveRes) {
				// Call the assertion callback
				done(attendencerecordSaveErr);
			});
	});

	it('should not be able to save Attendencerecord instance if no name is provided', function(done) {
		// Invalidate name field
		attendencerecord.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Attendencerecord
				agent.post('/attendencerecords')
					.send(attendencerecord)
					.expect(400)
					.end(function(attendencerecordSaveErr, attendencerecordSaveRes) {
						// Set message assertion
						(attendencerecordSaveRes.body.message).should.match('Please fill Attendencerecord name');
						
						// Handle Attendencerecord save error
						done(attendencerecordSaveErr);
					});
			});
	});

	it('should be able to update Attendencerecord instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Attendencerecord
				agent.post('/attendencerecords')
					.send(attendencerecord)
					.expect(200)
					.end(function(attendencerecordSaveErr, attendencerecordSaveRes) {
						// Handle Attendencerecord save error
						if (attendencerecordSaveErr) done(attendencerecordSaveErr);

						// Update Attendencerecord name
						attendencerecord.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Attendencerecord
						agent.put('/attendencerecords/' + attendencerecordSaveRes.body._id)
							.send(attendencerecord)
							.expect(200)
							.end(function(attendencerecordUpdateErr, attendencerecordUpdateRes) {
								// Handle Attendencerecord update error
								if (attendencerecordUpdateErr) done(attendencerecordUpdateErr);

								// Set assertions
								(attendencerecordUpdateRes.body._id).should.equal(attendencerecordSaveRes.body._id);
								(attendencerecordUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Attendencerecords if not signed in', function(done) {
		// Create new Attendencerecord model instance
		var attendencerecordObj = new Attendencerecord(attendencerecord);

		// Save the Attendencerecord
		attendencerecordObj.save(function() {
			// Request Attendencerecords
			request(app).get('/attendencerecords')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Attendencerecord if not signed in', function(done) {
		// Create new Attendencerecord model instance
		var attendencerecordObj = new Attendencerecord(attendencerecord);

		// Save the Attendencerecord
		attendencerecordObj.save(function() {
			request(app).get('/attendencerecords/' + attendencerecordObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', attendencerecord.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Attendencerecord instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Attendencerecord
				agent.post('/attendencerecords')
					.send(attendencerecord)
					.expect(200)
					.end(function(attendencerecordSaveErr, attendencerecordSaveRes) {
						// Handle Attendencerecord save error
						if (attendencerecordSaveErr) done(attendencerecordSaveErr);

						// Delete existing Attendencerecord
						agent.delete('/attendencerecords/' + attendencerecordSaveRes.body._id)
							.send(attendencerecord)
							.expect(200)
							.end(function(attendencerecordDeleteErr, attendencerecordDeleteRes) {
								// Handle Attendencerecord error error
								if (attendencerecordDeleteErr) done(attendencerecordDeleteErr);

								// Set assertions
								(attendencerecordDeleteRes.body._id).should.equal(attendencerecordSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Attendencerecord instance if not signed in', function(done) {
		// Set Attendencerecord user 
		attendencerecord.user = user;

		// Create new Attendencerecord model instance
		var attendencerecordObj = new Attendencerecord(attendencerecord);

		// Save the Attendencerecord
		attendencerecordObj.save(function() {
			// Try deleting Attendencerecord
			request(app).delete('/attendencerecords/' + attendencerecordObj._id)
			.expect(401)
			.end(function(attendencerecordDeleteErr, attendencerecordDeleteRes) {
				// Set message assertion
				(attendencerecordDeleteRes.body.message).should.match('User is not logged in');

				// Handle Attendencerecord error error
				done(attendencerecordDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Attendencerecord.remove().exec();
		done();
	});
});