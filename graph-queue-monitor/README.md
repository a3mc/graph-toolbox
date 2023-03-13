# graph-queue-monitor

As a new The Graph community member we've been using this tool to debug and study our indexer properties and agent queue. More features can be added, please ping us on Discord server. We are professional developers who enjoy modern high complexity space, specialized on protocols research, data crawling, user interfaces, automation and monitoring.

### How it works

The tool is a simple Node.js server (coupled with a frontend) that connects to aAgent DB and Graph Node DB and displays some overview of the Indexer status and Actions queue in a browser. It can be run locally or deployed to a server. We strongly recommend not to expose it publicly. Even though it only makes read-only "SELECT" queries, publicly exposing such tools goes against best practices.

### How to run

_Create a separate user with read-only access to the database or reuse Agent_db user in test environment._

1. Clone the repo and create a `.env` file in the root directory. `example.env ` is provided as a template.
2. Fill in the values for the variables in `.env` file.

Docker:
```sh
$ docker build -t graph-queue-monitor .
```
```sh
$ docker run --restart=unless-stopped --name graph-queue-monitor -p 3111:3111 -d graph-queue-monitor
```
Without docker:

Install Node.js 16x and npm. Run `npm i && npm start` to start the service. By default interface runs on port `3111` and if env variables are configured correctly, you'll be able to see the queue somewhere around http://localhost:3111.

_Make sure docker can access Postgres. There are too many variations of deployment, please think about appropriate solution._

### Frontend part

The frontend part is a simple Angular app that displays the overview and queue in a table and periodically refreshes it. It is already prebuilt, but if you want you can compile it from the `/frontend` directory.

### How it looks

![Queue](/queue.jpg)
