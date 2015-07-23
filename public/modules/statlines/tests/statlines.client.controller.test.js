'use strict';

(function() {
	// Statlines Controller Spec
	describe('Statlines Controller Tests', function() {
		// Initialize global variables
		var StatlinesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Statlines controller.
			StatlinesController = $controller('StatlinesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Statline object fetched from XHR', inject(function(Statlines) {
			// Create sample Statline using the Statlines service
			var sampleStatline = new Statlines({
				name: 'New Statline'
			});

			// Create a sample Statlines array that includes the new Statline
			var sampleStatlines = [sampleStatline];

			// Set GET response
			$httpBackend.expectGET('statlines').respond(sampleStatlines);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.statlines).toEqualData(sampleStatlines);
		}));

		it('$scope.findOne() should create an array with one Statline object fetched from XHR using a statlineId URL parameter', inject(function(Statlines) {
			// Define a sample Statline object
			var sampleStatline = new Statlines({
				name: 'New Statline'
			});

			// Set the URL parameter
			$stateParams.statlineId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/statlines\/([0-9a-fA-F]{24})$/).respond(sampleStatline);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.statline).toEqualData(sampleStatline);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Statlines) {
			// Create a sample Statline object
			var sampleStatlinePostData = new Statlines({
				name: 'New Statline'
			});

			// Create a sample Statline response
			var sampleStatlineResponse = new Statlines({
				_id: '525cf20451979dea2c000001',
				name: 'New Statline'
			});

			// Fixture mock form input values
			scope.name = 'New Statline';

			// Set POST response
			$httpBackend.expectPOST('statlines', sampleStatlinePostData).respond(sampleStatlineResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Statline was created
			expect($location.path()).toBe('/statlines/' + sampleStatlineResponse._id);
		}));

		it('$scope.update() should update a valid Statline', inject(function(Statlines) {
			// Define a sample Statline put data
			var sampleStatlinePutData = new Statlines({
				_id: '525cf20451979dea2c000001',
				name: 'New Statline'
			});

			// Mock Statline in scope
			scope.statline = sampleStatlinePutData;

			// Set PUT response
			$httpBackend.expectPUT(/statlines\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/statlines/' + sampleStatlinePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid statlineId and remove the Statline from the scope', inject(function(Statlines) {
			// Create new Statline object
			var sampleStatline = new Statlines({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Statlines array and include the Statline
			scope.statlines = [sampleStatline];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/statlines\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleStatline);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.statlines.length).toBe(0);
		}));
	});
}());