'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Statline = mongoose.model('Statline'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, statline;

/**
 * Statline routes tests
 */
describe('Statline CRUD tests', function() {
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

		// Save a user to the test db and create new Statline
		user.save(function() {
			statline = {
				name: 'Statline Name'
			};

			done();
		});
	});

	it('should be able to save Statline instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Statline
				agent.post('/statlines')
					.send(statline)
					.expect(200)
					.end(function(statlineSaveErr, statlineSaveRes) {
						// Handle Statline save error
						if (statlineSaveErr) done(statlineSaveErr);

						// Get a list of Statlines
						agent.get('/statlines')
							.end(function(statlinesGetErr, statlinesGetRes) {
								// Handle Statline save error
								if (statlinesGetErr) done(statlinesGetErr);

								// Get Statlines list
								var statlines = statlinesGetRes.body;

								// Set assertions
								(statlines[0].user._id).should.equal(userId);
								(statlines[0].name).should.match('Statline Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Statline instance if not logged in', function(done) {
		agent.post('/statlines')
			.send(statline)
			.expect(401)
			.end(function(statlineSaveErr, statlineSaveRes) {
				// Call the assertion callback
				done(statlineSaveErr);
			});
	});

	it('should not be able to save Statline instance if no name is provided', function(done) {
		// Invalidate name field
		statline.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Statline
				agent.post('/statlines')
					.send(statline)
					.expect(400)
					.end(function(statlineSaveErr, statlineSaveRes) {
						// Set message assertion
						(statlineSaveRes.body.message).should.match('Please fill Statline name');
						
						// Handle Statline save error
						done(statlineSaveErr);
					});
			});
	});

	it('should be able to update Statline instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Statline
				agent.post('/statlines')
					.send(statline)
					.expect(200)
					.end(function(statlineSaveErr, statlineSaveRes) {
						// Handle Statline save error
						if (statlineSaveErr) done(statlineSaveErr);

						// Update Statline name
						statline.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Statline
						agent.put('/statlines/' + statlineSaveRes.body._id)
							.send(statline)
							.expect(200)
							.end(function(statlineUpdateErr, statlineUpdateRes) {
								// Handle Statline update error
								if (statlineUpdateErr) done(statlineUpdateErr);

								// Set assertions
								(statlineUpdateRes.body._id).should.equal(statlineSaveRes.body._id);
								(statlineUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Statlines if not signed in', function(done) {
		// Create new Statline model instance
		var statlineObj = new Statline(statline);

		// Save the Statline
		statlineObj.save(function() {
			// Request Statlines
			request(app).get('/statlines')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Statline if not signed in', function(done) {
		// Create new Statline model instance
		var statlineObj = new Statline(statline);

		// Save the Statline
		statlineObj.save(function() {
			request(app).get('/statlines/' + statlineObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', statline.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Statline instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Statline
				agent.post('/statlines')
					.send(statline)
					.expect(200)
					.end(function(statlineSaveErr, statlineSaveRes) {
						// Handle Statline save error
						if (statlineSaveErr) done(statlineSaveErr);

						// Delete existing Statline
						agent.delete('/statlines/' + statlineSaveRes.body._id)
							.send(statline)
							.expect(200)
							.end(function(statlineDeleteErr, statlineDeleteRes) {
								// Handle Statline error error
								if (statlineDeleteErr) done(statlineDeleteErr);

								// Set assertions
								(statlineDeleteRes.body._id).should.equal(statlineSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Statline instance if not signed in', function(done) {
		// Set Statline user 
		statline.user = user;

		// Create new Statline model instance
		var statlineObj = new Statline(statline);

		// Save the Statline
		statlineObj.save(function() {
			// Try deleting Statline
			request(app).delete('/statlines/' + statlineObj._id)
			.expect(401)
			.end(function(statlineDeleteErr, statlineDeleteRes) {
				// Set message assertion
				(statlineDeleteRes.body.message).should.match('User is not logged in');

				// Handle Statline error error
				done(statlineDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Statline.remove().exec();
		done();
	});
});