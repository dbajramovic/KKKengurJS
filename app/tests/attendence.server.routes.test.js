'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Attendence = mongoose.model('Attendence'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, attendence;

/**
 * Attendence routes tests
 */
describe('Attendence CRUD tests', function() {
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

		// Save a user to the test db and create new Attendence
		user.save(function() {
			attendence = {
				name: 'Attendence Name'
			};

			done();
		});
	});

	it('should be able to save Attendence instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Attendence
				agent.post('/attendences')
					.send(attendence)
					.expect(200)
					.end(function(attendenceSaveErr, attendenceSaveRes) {
						// Handle Attendence save error
						if (attendenceSaveErr) done(attendenceSaveErr);

						// Get a list of Attendences
						agent.get('/attendences')
							.end(function(attendencesGetErr, attendencesGetRes) {
								// Handle Attendence save error
								if (attendencesGetErr) done(attendencesGetErr);

								// Get Attendences list
								var attendences = attendencesGetRes.body;

								// Set assertions
								(attendences[0].user._id).should.equal(userId);
								(attendences[0].name).should.match('Attendence Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Attendence instance if not logged in', function(done) {
		agent.post('/attendences')
			.send(attendence)
			.expect(401)
			.end(function(attendenceSaveErr, attendenceSaveRes) {
				// Call the assertion callback
				done(attendenceSaveErr);
			});
	});

	it('should not be able to save Attendence instance if no name is provided', function(done) {
		// Invalidate name field
		attendence.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Attendence
				agent.post('/attendences')
					.send(attendence)
					.expect(400)
					.end(function(attendenceSaveErr, attendenceSaveRes) {
						// Set message assertion
						(attendenceSaveRes.body.message).should.match('Please fill Attendence name');
						
						// Handle Attendence save error
						done(attendenceSaveErr);
					});
			});
	});

	it('should be able to update Attendence instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Attendence
				agent.post('/attendences')
					.send(attendence)
					.expect(200)
					.end(function(attendenceSaveErr, attendenceSaveRes) {
						// Handle Attendence save error
						if (attendenceSaveErr) done(attendenceSaveErr);

						// Update Attendence name
						attendence.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Attendence
						agent.put('/attendences/' + attendenceSaveRes.body._id)
							.send(attendence)
							.expect(200)
							.end(function(attendenceUpdateErr, attendenceUpdateRes) {
								// Handle Attendence update error
								if (attendenceUpdateErr) done(attendenceUpdateErr);

								// Set assertions
								(attendenceUpdateRes.body._id).should.equal(attendenceSaveRes.body._id);
								(attendenceUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Attendences if not signed in', function(done) {
		// Create new Attendence model instance
		var attendenceObj = new Attendence(attendence);

		// Save the Attendence
		attendenceObj.save(function() {
			// Request Attendences
			request(app).get('/attendences')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Attendence if not signed in', function(done) {
		// Create new Attendence model instance
		var attendenceObj = new Attendence(attendence);

		// Save the Attendence
		attendenceObj.save(function() {
			request(app).get('/attendences/' + attendenceObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', attendence.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Attendence instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Attendence
				agent.post('/attendences')
					.send(attendence)
					.expect(200)
					.end(function(attendenceSaveErr, attendenceSaveRes) {
						// Handle Attendence save error
						if (attendenceSaveErr) done(attendenceSaveErr);

						// Delete existing Attendence
						agent.delete('/attendences/' + attendenceSaveRes.body._id)
							.send(attendence)
							.expect(200)
							.end(function(attendenceDeleteErr, attendenceDeleteRes) {
								// Handle Attendence error error
								if (attendenceDeleteErr) done(attendenceDeleteErr);

								// Set assertions
								(attendenceDeleteRes.body._id).should.equal(attendenceSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Attendence instance if not signed in', function(done) {
		// Set Attendence user 
		attendence.user = user;

		// Create new Attendence model instance
		var attendenceObj = new Attendence(attendence);

		// Save the Attendence
		attendenceObj.save(function() {
			// Try deleting Attendence
			request(app).delete('/attendences/' + attendenceObj._id)
			.expect(401)
			.end(function(attendenceDeleteErr, attendenceDeleteRes) {
				// Set message assertion
				(attendenceDeleteRes.body.message).should.match('User is not logged in');

				// Handle Attendence error error
				done(attendenceDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Attendence.remove().exec();
		done();
	});
});