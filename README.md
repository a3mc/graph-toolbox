## Introduction

We created this tool to help you monitor your subgraphs and get alerts when something goes wrong.
During the MIPs program we found that as Indexer, we need more control and monitoring, than existing tools provide.

# Graph Prometheus Exporter

This tool allows to fetch data from subgraphs (or, actually any web sources) and export it to Prometheus.
You can use it, for example, to monitor your subgraphs and get alerts when something goes wrong.
Not limited to that though, you can use it to monitor any web source.

## How it works

Script goes through all the config files in the `configs` directory and makes a request to the URL specified in the config.
Then it processes the response using the callback function specified in the config.
Finally, it sets the Prometheus metrics with the values returned by the callback function.

The collected Prometheus metrics can be accessed at the `/metrics` endpoint. By default, it uses 9090 port.

## Installation

Check the example configs in the `example-configs` directory.
You can use them as a starting point to create your own configuration files.

To run outside of Docker, you need to have Node.js installed.
Then, run the following commands:

1. `npm install`
2. `cp .env.example .env`
3. Edit `.env` file and set the variables
4. Copy the config files from `example-configs` to `configs` directory: `cp example-configs/*.js configs/`
5. Run the script: `npm start`

You may want to add the process to systemd or use some other process manager, like PM2.

## Docker

You can also run the script in Docker.
To do that, you need to have Docker installed.
Then, run the following commands:

## Use cases

You can use this tool to monitor your subgraphs and get alerts when something goes wrong.
For example, you can monitor the number of entities in your subgraph and get an alert when it drops below a certain threshold.
You can also monitor the number of entities in your subgraph and get an alert when it grows above a certain threshold.
You can check the network health, and much more.
You can even use data returned by subgraphs, such as price or whatever to display it in your Grafana.

## Example configs

This directory contains example configuration files for the various use cases.
They can be used as a starting point to create your own configuration files.
Please check the `README.md` file in the `example-configs` directory for more information.

## Contributing

Contributions are welcome! If you have any ideas or suggestions, please open an issue or a pull request.

## License

MIT

