'use strict';

(function() {
	// Galleryitems Controller Spec
	describe('Galleryitems Controller Tests', function() {
		// Initialize global variables
		var GalleryitemsController,
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

			// Initialize the Galleryitems controller.
			GalleryitemsController = $controller('GalleryitemsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Galleryitem object fetched from XHR', inject(function(Galleryitems) {
			// Create sample Galleryitem using the Galleryitems service
			var sampleGalleryitem = new Galleryitems({
				name: 'New Galleryitem'
			});

			// Create a sample Galleryitems array that includes the new Galleryitem
			var sampleGalleryitems = [sampleGalleryitem];

			// Set GET response
			$httpBackend.expectGET('galleryitems').respond(sampleGalleryitems);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.galleryitems).toEqualData(sampleGalleryitems);
		}));

		it('$scope.findOne() should create an array with one Galleryitem object fetched from XHR using a galleryitemId URL parameter', inject(function(Galleryitems) {
			// Define a sample Galleryitem object
			var sampleGalleryitem = new Galleryitems({
				name: 'New Galleryitem'
			});

			// Set the URL parameter
			$stateParams.galleryitemId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/galleryitems\/([0-9a-fA-F]{24})$/).respond(sampleGalleryitem);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.galleryitem).toEqualData(sampleGalleryitem);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Galleryitems) {
			// Create a sample Galleryitem object
			var sampleGalleryitemPostData = new Galleryitems({
				name: 'New Galleryitem'
			});

			// Create a sample Galleryitem response
			var sampleGalleryitemResponse = new Galleryitems({
				_id: '525cf20451979dea2c000001',
				name: 'New Galleryitem'
			});

			// Fixture mock form input values
			scope.name = 'New Galleryitem';

			// Set POST response
			$httpBackend.expectPOST('galleryitems', sampleGalleryitemPostData).respond(sampleGalleryitemResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Galleryitem was created
			expect($location.path()).toBe('/galleryitems/' + sampleGalleryitemResponse._id);
		}));

		it('$scope.update() should update a valid Galleryitem', inject(function(Galleryitems) {
			// Define a sample Galleryitem put data
			var sampleGalleryitemPutData = new Galleryitems({
				_id: '525cf20451979dea2c000001',
				name: 'New Galleryitem'
			});

			// Mock Galleryitem in scope
			scope.galleryitem = sampleGalleryitemPutData;

			// Set PUT response
			$httpBackend.expectPUT(/galleryitems\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/galleryitems/' + sampleGalleryitemPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid galleryitemId and remove the Galleryitem from the scope', inject(function(Galleryitems) {
			// Create new Galleryitem object
			var sampleGalleryitem = new Galleryitems({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Galleryitems array and include the Galleryitem
			scope.galleryitems = [sampleGalleryitem];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/galleryitems\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleGalleryitem);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.galleryitems.length).toBe(0);
		}));
	});
}());