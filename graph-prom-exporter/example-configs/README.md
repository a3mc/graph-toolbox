# Example configs

This directory contains example configuration files for the various use cases.
They can be used as a starting point to create your own configuration files.

Copy the files from this directory to the `configs` directory and script will go through each of them when a request from Prometheus metrics is received.

### Structure of the config file
File should have a `.js` extension and should be a valid JS script. However, it has a simple structure and doesn't require deep knowledge of JS to create a new config file.
You can use any file names as you wish.

The file should contain a JS script, used as a config with the following parts:

`export default {` - Just start with this line.

`name: ['name_of_the_prometheus_metrics']` - This is the name of the metric that will be used to identify the config file. It should be the same as the name of the metric in Prometheus. You can use multiple names if you want to use the same config for multiple metrics. Make sure you have no spaces and follow the Prometheus standards for naming. Lowercase names with underscores are a good start.

`url: 'http://example.com'` - This is the URL that will be used to make a query. You can set them in your `.env` file and use them here. For example, `url: process.env.EXAMPLE_URL`.

`query: 'query'` - This is the query that will be used to make a request to the URL. If you want just to check if some endpoint is alive you can omit it.

`method: 'post'` - This is the method that will be used to make a request to the URL. It's optional and defaults to `post`.

`callback: (response, prometheus) => {...}` - This is the callback function that will be used to process the data. You can filter it as you like and set the prometheus metrics like follows: `prometheus['metrics_name'].set(value)`. You can also use `prometheus['metrics_name'].inc()` to increment the value for the Counters.
