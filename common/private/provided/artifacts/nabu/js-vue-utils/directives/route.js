Vue.directive("route", {
	// the argument should be the name of the route, any value is passed in as parameters
	// the modifier is interpreted as the anchor to route it to
	bind: function(element, binding, vnode) {
		// make sure we don't do anything else
		if (element.tagName.toLowerCase() == "a") {
			element.setAttribute("href", "javascript:void(0)");
		}
		var keys = null;
		if (binding.modifiers) {
			keys = Object.keys(binding.modifiers);
		}
		element.addEventListener("click", function(event) {
			vnode.context.$services.router.route(binding.arg, binding.value, keys && keys.length ? keys[0] : null);
		});
	}
});