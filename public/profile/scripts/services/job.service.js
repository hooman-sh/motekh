angular.module('motekhasesanApp')
	.factory('Job', ['$resource', '$cookies', function ($resource, $cookies) {
		var app = {};
		app.getProjects = $resource(config.api + 'customers/jobs', {}, {
			"save": {
				method: 'Post'
			},
			"delete": {
				method: 'DELETE',
				params: {
					job_id: '@job_id'
				}
			}
		});
		app.getProject = $resource(config.api + 'customers/jobs/:job_id', {
			job_id: '@job_id'
		}, {
			'delete': {
				method: 'DELETE'
			}
		});
		app.getCustomerOffers = $resource(config.api + 'customers/jobs/:job_id/offers', {
			job_id: '@job_id'
		});
		app.getCustomerOffer = $resource(config.api + 'customers/jobs/:job_id/offers/:offer_id', {
			job_id: '@job_id',
			offer_id: '@offer_id'
		});
		app.getJobsOffers = $resource(config.api + 'proficients/jobs');
		app.getJobOffersDetail = $resource(config.api + 'proficients/jobs/:job_id', {
			job_id: '@job_id'
		});
		app.makeNewOffer = $resource(config.api + 'proficients/offers', {}, {
			"save": {
				method: 'POST'
			}
		});
		app.acceptReject = $resource(config.api + "customers/jobs/:job_id/offers/:offer_id", {
			job_id: '@job_id',
			offer_id: '@offer_id'
		}, {
			"save": {
				method: 'POST'
			}
		});
		app.getOffer = $resource(config.api + 'proficients/offers/:offer_id', {
			offer_id: '@offer_id'
		}, {
			save: {
				method: 'POST'
			}
		});
		app.getQuestions = $resource(config.api + 'professions/:id/questions', {
			id: '@pro_id'
		});
		app.addProfession = $resource(config.api + 'dashboard/professions', {}, {
			"save": {
				method: 'POST'
			}
		});

		return app;
	}])