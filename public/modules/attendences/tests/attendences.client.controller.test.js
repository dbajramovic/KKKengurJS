'use strict';

(function() {
	// Attendences Controller Spec
	describe('Attendences Controller Tests', function() {
		// Initialize global variables
		var AttendencesController,
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

			// Initialize the Attendences controller.
			AttendencesController = $controller('AttendencesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Attendence object fetched from XHR', inject(function(Attendences) {
			// Create sample Attendence using the Attendences service
			var sampleAttendence = new Attendences({
				name: 'New Attendence'
			});

			// Create a sample Attendences array that includes the new Attendence
			var sampleAttendences = [sampleAttendence];

			// Set GET response
			$httpBackend.expectGET('attendences').respond(sampleAttendences);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.attendences).toEqualData(sampleAttendences);
		}));

		it('$scope.findOne() should create an array with one Attendence object fetched from XHR using a attendenceId URL parameter', inject(function(Attendences) {
			// Define a sample Attendence object
			var sampleAttendence = new Attendences({
				name: 'New Attendence'
			});

			// Set the URL parameter
			$stateParams.attendenceId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/attendences\/([0-9a-fA-F]{24})$/).respond(sampleAttendence);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.attendence).toEqualData(sampleAttendence);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Attendences) {
			// Create a sample Attendence object
			var sampleAttendencePostData = new Attendences({
				name: 'New Attendence'
			});

			// Create a sample Attendence response
			var sampleAttendenceResponse = new Attendences({
				_id: '525cf20451979dea2c000001',
				name: 'New Attendence'
			});

			// Fixture mock form input values
			scope.name = 'New Attendence';

			// Set POST response
			$httpBackend.expectPOST('attendences', sampleAttendencePostData).respond(sampleAttendenceResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Attendence was created
			expect($location.path()).toBe('/attendences/' + sampleAttendenceResponse._id);
		}));

		it('$scope.update() should update a valid Attendence', inject(function(Attendences) {
			// Define a sample Attendence put data
			var sampleAttendencePutData = new Attendences({
				_id: '525cf20451979dea2c000001',
				name: 'New Attendence'
			});

			// Mock Attendence in scope
			scope.attendence = sampleAttendencePutData;

			// Set PUT response
			$httpBackend.expectPUT(/attendences\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/attendences/' + sampleAttendencePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid attendenceId and remove the Attendence from the scope', inject(function(Attendences) {
			// Create new Attendence object
			var sampleAttendence = new Attendences({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Attendences array and include the Attendence
			scope.attendences = [sampleAttendence];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/attendences\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleAttendence);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.attendences.length).toBe(0);
		}));
	});
}());