'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Galleryitem = mongoose.model('Galleryitem'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, galleryitem;

/**
 * Galleryitem routes tests
 */
describe('Galleryitem CRUD tests', function() {
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

		// Save a user to the test db and create new Galleryitem
		user.save(function() {
			galleryitem = {
				name: 'Galleryitem Name'
			};

			done();
		});
	});

	it('should be able to save Galleryitem instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Galleryitem
				agent.post('/galleryitems')
					.send(galleryitem)
					.expect(200)
					.end(function(galleryitemSaveErr, galleryitemSaveRes) {
						// Handle Galleryitem save error
						if (galleryitemSaveErr) done(galleryitemSaveErr);

						// Get a list of Galleryitems
						agent.get('/galleryitems')
							.end(function(galleryitemsGetErr, galleryitemsGetRes) {
								// Handle Galleryitem save error
								if (galleryitemsGetErr) done(galleryitemsGetErr);

								// Get Galleryitems list
								var galleryitems = galleryitemsGetRes.body;

								// Set assertions
								(galleryitems[0].user._id).should.equal(userId);
								(galleryitems[0].name).should.match('Galleryitem Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Galleryitem instance if not logged in', function(done) {
		agent.post('/galleryitems')
			.send(galleryitem)
			.expect(401)
			.end(function(galleryitemSaveErr, galleryitemSaveRes) {
				// Call the assertion callback
				done(galleryitemSaveErr);
			});
	});

	it('should not be able to save Galleryitem instance if no name is provided', function(done) {
		// Invalidate name field
		galleryitem.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Galleryitem
				agent.post('/galleryitems')
					.send(galleryitem)
					.expect(400)
					.end(function(galleryitemSaveErr, galleryitemSaveRes) {
						// Set message assertion
						(galleryitemSaveRes.body.message).should.match('Please fill Galleryitem name');
						
						// Handle Galleryitem save error
						done(galleryitemSaveErr);
					});
			});
	});

	it('should be able to update Galleryitem instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Galleryitem
				agent.post('/galleryitems')
					.send(galleryitem)
					.expect(200)
					.end(function(galleryitemSaveErr, galleryitemSaveRes) {
						// Handle Galleryitem save error
						if (galleryitemSaveErr) done(galleryitemSaveErr);

						// Update Galleryitem name
						galleryitem.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Galleryitem
						agent.put('/galleryitems/' + galleryitemSaveRes.body._id)
							.send(galleryitem)
							.expect(200)
							.end(function(galleryitemUpdateErr, galleryitemUpdateRes) {
								// Handle Galleryitem update error
								if (galleryitemUpdateErr) done(galleryitemUpdateErr);

								// Set assertions
								(galleryitemUpdateRes.body._id).should.equal(galleryitemSaveRes.body._id);
								(galleryitemUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Galleryitems if not signed in', function(done) {
		// Create new Galleryitem model instance
		var galleryitemObj = new Galleryitem(galleryitem);

		// Save the Galleryitem
		galleryitemObj.save(function() {
			// Request Galleryitems
			request(app).get('/galleryitems')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Galleryitem if not signed in', function(done) {
		// Create new Galleryitem model instance
		var galleryitemObj = new Galleryitem(galleryitem);

		// Save the Galleryitem
		galleryitemObj.save(function() {
			request(app).get('/galleryitems/' + galleryitemObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', galleryitem.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Galleryitem instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Galleryitem
				agent.post('/galleryitems')
					.send(galleryitem)
					.expect(200)
					.end(function(galleryitemSaveErr, galleryitemSaveRes) {
						// Handle Galleryitem save error
						if (galleryitemSaveErr) done(galleryitemSaveErr);

						// Delete existing Galleryitem
						agent.delete('/galleryitems/' + galleryitemSaveRes.body._id)
							.send(galleryitem)
							.expect(200)
							.end(function(galleryitemDeleteErr, galleryitemDeleteRes) {
								// Handle Galleryitem error error
								if (galleryitemDeleteErr) done(galleryitemDeleteErr);

								// Set assertions
								(galleryitemDeleteRes.body._id).should.equal(galleryitemSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Galleryitem instance if not signed in', function(done) {
		// Set Galleryitem user 
		galleryitem.user = user;

		// Create new Galleryitem model instance
		var galleryitemObj = new Galleryitem(galleryitem);

		// Save the Galleryitem
		galleryitemObj.save(function() {
			// Try deleting Galleryitem
			request(app).delete('/galleryitems/' + galleryitemObj._id)
			.expect(401)
			.end(function(galleryitemDeleteErr, galleryitemDeleteRes) {
				// Set message assertion
				(galleryitemDeleteRes.body.message).should.match('User is not logged in');

				// Handle Galleryitem error error
				done(galleryitemDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Galleryitem.remove().exec();
		done();
	});
});