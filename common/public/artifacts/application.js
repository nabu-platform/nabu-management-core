if (!application) { var application = {} }

application.configuration = {
	scheme: {
		http: "${when(environment('secure'), 'https', 'http')}",
		ws: "${when(environment('secure'), 'wss', 'ws')}"
	},
	url: "${environment('url', 'http://127.0.0.1')}",
	host: "${environment('host', '127.0.0.1')}",
	// lambdas to bootstrap modules
	modules: []
};

application.views = {};

application.initialize = function() {
	application.services = new nabu.services.ServiceManager(
		function(services) {
			Vue.mixin({
				// inject some services for use
				computed: {
					$configuration: function() { return application.configuration },
					$services: function() { return services },
					$views: function() { return application.views },
					$application: function() { return application }
				},
				methods: {
					formatDateTime: function(value) {
						return value ? new Date(value).toLocaleString() : null;
					}
				}
			});	
		},
		nabu.services.Q,
		application.definitions.Swagger,
		application.definitions.Manager,
		function router($services) {
			this.$initialize = function() {
				return new nabu.services.VueRouter({
					useHash: true,
					unknown: function(alias, parameters, anchor) {
						return application.services.router.register({
							alias: alias,
							enter: function() {
								return alias;
							}
						});
					},
					enter: function(anchor, newRoute, newParameters, oldRoute, oldParameters, newRouteReturn) {
						$services.vue.route = newRoute.alias;
						// reset scroll
						document.body.scrollTop = 0;
					}
				});
			}
		},
		function vue() {
			this.$initialize = function() {
				return new Vue({
					el: "body",
					data: {
						route: null
					}
				});
			}
		},
		application.routes);
	return application.services.$initialize();
};
