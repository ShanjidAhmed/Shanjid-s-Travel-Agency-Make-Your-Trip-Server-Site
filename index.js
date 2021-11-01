const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

// const ObjectId = require('mongodb').ObjectId;

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;
// app.use(bodyParser.urlencoded({ extended: true }));

const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r7uyw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, {
    useNewUrlParser: true, useUnifiedTopology: true
});


async function run() {
    try {
        await client.connect();
        const database = client.db('tripsdb');
        const placeCollection = database.collection('places');
        const userOrders = database.collection("userorders");
        const membershipInfoCollection = database.collection("membershipinfo");


        // GET API
        app.get('/services', async (req, res) => {
            const cursor = placeCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/membership', async (req, res) => {
            const cursor = membershipInfoCollection.find({});
            const membershipResults = await cursor.toArray();
            res.send(membershipResults);
        });

        app.get("/usersorders", async (req, res) => {
            const cursor = userOrders.find({})
            const userInfo = await cursor.toArray();
            res.send(userInfo)
        })
        // GET Single Service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        // POST API
        app.post('http://localhost:5000/services', async (req, res) => {
            const service = req.body;
            console.log('confirm', service);

            const result = await placeCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });
        //POST API for USERS ORDERS
        app.post("http://localhost:5000/usersorders", async (req, res) => {
            const usersOrdersInfo = req.body;
            console.log(usersOrdersInfo)
            const result = await userOrders.insertOne(usersOrdersInfo)
            res.json(result)
        })

        // DELETE API
        app.delete('http://localhost:5000/usersorders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userOrders.deleteOne(query);
            res.json(result);
        })

    }
    finally {
        // await client.close();
    }
}


run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('yayy');
})

app.listen(port, () => {
    console.log('listening to', port, 'port');
})