const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.crbp5cr.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {
    try {
        const serviceCollection = client.db('motorMedics').collection('services'); //create database & collection
        const productsCollection = client.db('motorMedics').collection('products');
        const orderCollection = client.db('motorMedics').collection('orders');

        //services api
        app.get('/services', async (req, res) => {
            const query = {};  // in this query you have to say, what you want to search? if you search for all then give a empty object
            const cursor = serviceCollection.find(query); // for find have to take a cursor. And find is doing base of query.
            const services = await cursor.toArray(); // promise convert to an array for using client site.
            res.send(services);
        });

        // products api
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })

        // service by id
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }; // in mongodb database _id have ObjectId form.
            const service = await serviceCollection.findOne(query); // use findOne method for finding a specific item
            res.send(service);
        });

        // product by id
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }; // in mongodb database _id have ObjectId form.
            const product = await productsCollection.findOne(query); // use findOne method for finding a specific item
            res.send(product);
        });

        // orders api
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        })
    }
    finally {

    }

}
run().catch(err => console.error(err));


app.get('/', (req, res) => {
    res.send('App is running');
})

app.listen(port, () => {
    console.log(`MOTOR MEDICS is running in port ${port}`);
})