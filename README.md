Baby Beats Polymer
==================

Baby Beats Polymer is a Polymer-based client-side demo application, which
uses elements from the [Polymer Catalog](https://elements.polymer-project.org/), Icons used are provided by [Icons8](https://icons8.com/).


Backend
-------

The client-side application uses static JSON files as its "backend". These files are located
in ```app/data``` directory. In the same directory you will also find a Node script
that can be used to generate more example data. It could also be easily modified
to a Node-based REST API.

Development
-----------

Clone this repository and run the following command(s) to start the application
for development.

```npm install && bower install && gulp```


Deployment
----------

Clone this repository and run the following command(s) to package the application
for deployment.

```npm install && bower install && gulp dist```

This will result in a distributable application in the ```dist``` subdirectory.


Test Data
---------

Use the sample-data-generator project to generate test data. Then import the data into mongodb.
Then export valid json using the command options given below.

mongoimport -d babybeats -c sensordata --file output.json
mongoexport -d babybeats -c sensordata --jsonArray --pretty --out source.json
