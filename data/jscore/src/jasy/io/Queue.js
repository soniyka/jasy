(function() {
	
	var loading = {};
	var completed = {};
	
	var typeLoader = 
	{
		js : jasy.io.Script,
		css : jasy.io.StyleSheet,
		png : jasy.io.Image,
		gif : jasy.io.Image,
		jpg : jasy.io.Image,
		jpeg : jasy.io.Image
	};
	
	var extractExtension = function(filename) {
		var dot = filename.lastIndexOf(".");
		return dot > 0 ? filename.slice(dot+1) : null;
	};
	
	/** {Array} List of function, context where each entry consumes two array fields */
	var cachedCallbacks = [];

	/**
	 * Flushes the cached callbacks as soon as no more active scripts are detected.
	 * This methods is called by the different complete scenarios from the loader functions.
	 */
	var flushCallbacks = function()
	{
		// Check whether all known scripts are loaded
		for (var uri in loading) {
			return;
		}
		
		// Then execute all callbacks (copy to protect loop from follow-up changes)
		var todo = cachedCallbacks.concat();
		cachedCallbacks.length = 0;
		for (var i=0, l=todo.length; i<l; i+=2) {
			todo[i].call(todo[i+1]);
		}
	};

	
	
	Module("jasy.io.Queue",
	{
		/**
		 * Whether the given URI or URIs are loaded through the queue
		 *
		 * @param uris {String|Array} One or multiple URIs to verify
		 * @return {Boolean} Whether all given URIs have been loaded
		 */
		isLoaded : function(uris) 
		{
			if (typeof uris === "string") {
				return !!completed[uris];
			}
			
			for (var i=0, l=uris.length; i<l; i++) 
			{
				if (!completed[uris[i]]) {
					return false;
				}
			}

			return true;
		},
		
		
		/**
		 * Loads the given URIs and optionally executes the given callback after all are completed
		 *
		 * @param uris {Array} List of URLs to load
		 * @param callback {Function ? null} Callback method to execute
		 * @param context {Object ? null} Context in which the callback function should be executed
		 * @param nocache {Boolean ? false} Whether a cache prevention logic should be applied (to force a fresh copy)
		 * @param type {String ? auto} Whether the automatic type detection should be disabled and the given type should be used.
		 */
		load : function(uris, callback, context, nocache, type) 
		{
			var executeDirectly = !!callback;
			var autoType = !type;
			
			// List of sequential items sorted by type
			var sequential = {};
			
			var onLoad = function(uri) 
			{
				delete loading[uri];
				completed[uri] = true;

				for (var queued in loading) {
					return;
				}

				flushCallbacks();
			};

			var executeOneByOne = function(type)
			{
				var uri = sequential[type].shift();
				if (uri) 
				{
					typeLoader[type].load(uri, function(uri) 
					{
						onLoad(uri);
						executeOneByOne(type);
					}, 
					null, nocache);
				} 
				else
				{
					flushCallbacks();
				}
			};
			
			for (var i=0, l=uris.length; i<l; i++)
			{
				var currentUri = uris[i];
				
				if (!completed[currentUri])
				{
					if (autoType) {
						type = extractExtension(currentUri);
					}	
					
					var loader = typeLoader[type];

					// Only queue callback once
					if (executeDirectly)
					{
						// As we are waiting for things to load, we can't execute the callback directly anymore
						executeDirectly = false;
						
						// Directly push to global callback list
						cachedCallbacks.push(callback, context);
					}

					// When script is not being loaded already, then start with it here
					// (Otherwise we just added the callback to the queue and wait for it to be executed)
					if (!loading[currentUri])
					{
						// Register globally as loading
						loading[currentUri] = true;
						
						// Differenciate between loader capabilities
						if (loader.SUPPORTS_PARALLEL) 
						{
							loader.load(currentUri, onLoad, null, nocache);
						}
						else
						{
							if (sequential[type]) {
								sequential[type].push(currentUri);
							} else {
								sequential[type] = [currentUri];
							}
						}
					}
				}
			}

			// If all scripts are loaded already, just execute the callback
			if (executeDirectly) 
			{
				// Nothing to load, execute callback directly
				callback.call(context);
			} 
			else
			{
				// Load and execute first script, then continue with next until last one
				for (var type in sequential) {
					executeOneByOne(type);
				}
			}
		}
	});
})();

