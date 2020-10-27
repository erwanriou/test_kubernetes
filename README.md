# Experimental Micro Service Project

It's a very simple and experimental micro-service solution that is implemented with NATS streaming in async. The objective is to be able to test communication between services and detect if anything wrong goes.

The project have been implemented respecting the TDD approach to avoid create all the time ClusterPort services to verify endpoints.

In the mean time we also experiment an object oriented approach to manage the listeners and the publishers. The main class and types are relegated in a separate library to avoid unintentional changes that might lead to a desynchronisation of databases. Challenge are in the test of the NATS streaming events that are mocked.

We also manage to handle transactions with mongoDB to avoid potential errors of saved && not shared elements.

No deploy is planned but you can try it locally with skaffold dev (just make sure to create your own common library with the other repository)
