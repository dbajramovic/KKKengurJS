'use strict';

(function() {
	// Attendencerecords Controller Spec
	describe('Attendencerecords Controller Tests', function() {
		// Initialize global variables
		var AttendencerecordsController,
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

			// Initialize the Attendencerecords controller.
			AttendencerecordsController = $controller('AttendencerecordsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Attendencerecord object fetched from XHR', inject(function(Attendencerecords) {
			// Create sample Attendencerecord using the Attendencerecords service
			var sampleAttendencerecord = new Attendencerecords({
				name: 'New Attendencerecord'
			});

			// Create a sample Attendencerecords array that includes the new Attendencerecord
			var sampleAttendencerecords = [sampleAttendencerecord];

			// Set GET response
			$httpBackend.expectGET('attendencerecords').respond(sampleAttendencerecords);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.attendencerecords).toEqualData(sampleAttendencerecords);
		}));

		it('$scope.findOne() should create an array with one Attendencerecord object fetched from XHR using a attendencerecordId URL parameter', inject(function(Attendencerecords) {
			// Define a sample Attendencerecord object
			var sampleAttendencerecord = new Attendencerecords({
				name: 'New Attendencerecord'
			});

			// Set the URL parameter
			$stateParams.attendencerecordId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/attendencerecords\/([0-9a-fA-F]{24})$/).respond(sampleAttendencerecord);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.attendencerecord).toEqualData(sampleAttendencerecord);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Attendencerecords) {
			// Create a sample Attendencerecord object
			var sampleAttendencerecordPostData = new Attendencerecords({
				name: 'New Attendencerecord'
			});

			// Create a sample Attendencerecord response
			var sampleAttendencerecordResponse = new Attendencerecords({
				_id: '525cf20451979dea2c000001',
				name: 'New Attendencerecord'
			});

			// Fixture mock form input values
			scope.name = 'New Attendencerecord';

			// Set POST response
			$httpBackend.expectPOST('attendencerecords', sampleAttendencerecordPostData).respond(sampleAttendencerecordResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Attendencerecord was created
			expect($location.path()).toBe('/attendencerecords/' + sampleAttendencerecordResponse._id);
		}));

		it('$scope.update() should update a valid Attendencerecord', inject(function(Attendencerecords) {
			// Define a sample Attendencerecord put data
			var sampleAttendencerecordPutData = new Attendencerecords({
				_id: '525cf20451979dea2c000001',
				name: 'New Attendencerecord'
			});

			// Mock Attendencerecord in scope
			scope.attendencerecord = sampleAttendencerecordPutData;

			// Set PUT response
			$httpBackend.expectPUT(/attendencerecords\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/attendencerecords/' + sampleAttendencerecordPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid attendencerecordId and remove the Attendencerecord from the scope', inject(function(Attendencerecords) {
			// Create new Attendencerecord object
			var sampleAttendencerecord = new Attendencerecords({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Attendencerecords array and include the Attendencerecord
			scope.attendencerecords = [sampleAttendencerecord];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/attendencerecords\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleAttendencerecord);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.attendencerecords.length).toBe(0);
		}));
	});
}());