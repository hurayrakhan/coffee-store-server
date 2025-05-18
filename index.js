const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/*DB_name : coffee_store_DB
password : kOi0Ry4WKM1RZW2T
*/ 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.PASSWORD}@cluster0.4kv6tdj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeCollection = client.db('coffee_store_DB').collection('coffees');

    app.get('/coffees', async(req, res) => {
        const cursor = coffeeCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })

    app.post('/coffees', async(req, res) => {
        const newCoffee = req.body;
        
        const result = await coffeeCollection.insertOne(newCoffee);
        res.send(result);

    })

    app.delete('/coffees/:id', async(req, res) => {
        const id = req.params.id;
        console.log(id)
        const query = {_id: new ObjectId(id)};
        console.log(query)
        const result = await coffeeCollection.deleteOne(query);
        res.send(result);
    })

    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('hello hurayra khan your server ready')
});


app.listen(port, () => {
    console.log('server running on port', port)
})