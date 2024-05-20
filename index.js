const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app= express()
const port = process.env.PORT || 5000

// midlewear 
app.use(cors())
app.use(express.json())

// ShiningRestaurant
// iMuZafvqqNZnKTmT



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.76h69in.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();
    const menuCollection = client.db("shiningDB").collection('menu');
    const reviewCollection = client.db("shiningDB").collection('reviews');
    const cartCollection = client.db("shiningDB").collection('carts');

    app.get('/menu', async (req,res)=>{
        const result = await menuCollection.find().toArray()
        res.send(result)
    })

    app.get('/reviews', async (req,res)=>{
        const result = await reviewCollection.find().toArray()
        res.send(result)
    })

    // ======== carts ==========
    app.get('/carts', async (req, res)=>{
      const email = req.query.email;
      const query = {email: email}
      const result = await cartCollection.find(query).toArray()
      res.send(result)
    })

    app.post('/carts', async (req, res)=>{
      const newCart = req.body;
      const result = await cartCollection.insertOne(newCart)
      res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);



app.get('/', (req, res)=>{
    res.send("Shining Restaurant is Runnig")
})

app.listen(port, ()=>{
    console.log("Server Running on Port:", port);
})