## Toolbox Suite for Indexers, Developers and Data Consumers

Set of tools to monitor various components and get alerts when something goes wrong or overwise right.

#### This is a Monorepo consisting of the following:

#### [Graph Queue and Indexer Status Monitor](graph-queue-monitor)

This tool provide expanded indexer status including multiple fields which are not available in console and detailed actions queue table. This is useful in allocations debugging which we found hard to do with already available toolset. Interface easily available in browser, application can be run on remote server or on laptop trough ssh tunnel. Setup is flexible and vary depends on individual the stack architecture.

#### [Graph Prometheus Exporter](graph-prom-exporter)

This exporter build specifically to fetch data from subgraphs, however, exporter able to fetch any data from any source with additional configuration and can be used to build any sorts of exportes in no time. We are tired to constantly build new scrappers for new revolutional softwares daily and so here this tool come to reduce time consumption. Currently is in testing and we plan to continue development in this direction. End metrics provided in Prometheus format and ready to be consumed by Grafana for continious alerts and visual representation.

Tool comes with an example suite that would be a good for getting started check example-configs folder for more details.

Not limited to **Indexers**, it might be a good tool for **Subgraph developers** to monitor their subgraphs, and even for **Subgraph data consumers** to monitor the data they consume. As it is easy to extend by adding your own configs.

#### [HTTP Failover Proxy](rpc-failover-proxy)

In current stage of multichain integration we dealing with tons of unstable software feeding our indexers. RPC failover proxy build for critical situations when main archive fail and we need to swap fast on backup instance. We found setting up traditional proxy solutions as very much time consuming process, specifically when chains have different parameters as such as block time for example. This requare custom control scripts to be set in place depends on which chain we are about to serve. Our solution make this process easy and limited to one simple configuration file which contain essential variables. Docker can be integrated in to swarm and well controled externaly. Rich metrics provided in Prometheus format give precise expanded overview of proxy processes and consequentualy provide general RPC nodes performance.

#### Contributing

We welcome contributions from everyone. If you have any ideas or suggestions, please open an issue or a pull request.

#### License

All tools are licensed under the MIT license.

*Developed with love and care by [ART3MIS.CLOUD](https://art3mis.cloud) for The Graph Indexers, Subgraph Developers and data consumers.*

![image](toolbox.png)
