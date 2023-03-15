## Toolbox Suite for Indexers, Developers and Data Consumers

Set of tools to monitor various components and get alerts when something goes wrong or otherwise right.

#### This is a Monorepo consisting of the following:

#### [Graph Queue and Indexer Status Monitor](graph-queue-monitor)

This tool provides expanded indexer status including multiple fields which are not available in console and detailed actions queue table. This is useful in allocations debugging which we found hard to do with already available toolset. Interface is easily available in browser, application can be run on a remote server or on laptop through ssh tunnel. Setup is flexible and varies depending on the individual stack architecture.

#### [Graph Prometheus Exporter](graph-prom-exporter)

This exporter was built specifically to fetch data from subgraphs. However, exporter is able to fetch any data from any source with additional configuration and can be used to build any sorts of exporters in no time. We are tired to constantly build new scrappers for new revolution software daily and so here this tool comes to reduce time consumption. Currently, it is in testing, and we plan to continue development in this direction. End metrics is provided in Prometheus format and ready to be consumed by Grafana for continuous alerts and visual representation.

Tool comes with an example suite that would be a good for getting started. Check `example-configs` folder for more details.

Not limited to **Indexers**, it might be a good tool for **Subgraph developers** to monitor their subgraphs, and even for **Subgraph data consumers** to monitor the data they consume. As it is easy to extend by adding your own configs.

#### [HTTP Failover Proxy](rpc-failover-proxy)

In current stage of multichain integration we are dealing with tons of unstable software feeding our indexers. RPC failover proxy is built for critical situations when main archive fails, and we need to swap fast to the backup instance. We found setting up traditional proxy solutions as  a very much time-consuming process, specifically when chains have different parameters as such as block time for example. This requires custom control scripts to be set in place depending on which chain we are about to serve. Our solution makes this process easy and limited to one simple configuration file which contains essential variables. Docker can be integrated in to swarm and is well controlled externally. Rich metrics provided in Prometheus format gives precise expanded overview of proxy processes and consequentially provides general RPC nodes performance.

#### Contributing

We welcome contributions from everyone. If you have any ideas or suggestions, please open an issue or a pull request.

#### License

All tools are licensed under the MIT license.

*Developed with love and care by [ART3MIS.CLOUD](https://art3mis.cloud) for The Graph Indexers, Subgraph Developers and data consumers.*

![image](toolbox.png)
