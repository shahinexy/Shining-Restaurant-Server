const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

// midlewear 
app.use(cors())
app.use(express.json())



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
    const userCollection = client.db("shiningDB").collection('users');
    const menuCollection = client.db("shiningDB").collection('menu');
    const reviewCollection = client.db("shiningDB").collection('reviews');
    const cartCollection = client.db("shiningDB").collection('carts');

    // JWT related api
    app.post('/jwt', async (req, res)=>{
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'})
      res.send({token})
    })

    // midlewear
    const verifyToken = (req,res,next)=>{
      console.log("inside verify token",req.headers);
      next()
    }

    // ====== User =======
    app.get('/users', verifyToken, async (req,res)=>{
      
      const result = await userCollection.find().toArray()
      res.send(result)
    })

    app.post('/users', async (req, res) => {
      const newUser = req.body;
      const query = { email: newUser.email }
      const isExist = await userCollection.findOne(query)
      if (isExist) {
        return res.send({ message: 'user already Exist', insertedId: null })
      }
      const result = await userCollection.insertOne(newUser)
      res.send(result)
    })

    app.patch('/users/admin/:id', async (req,res)=>{
      const filter = {_id: new ObjectId(req.params.id)}
      const updateUser = {
        $set: {
          role : 'admin'
        }
      }
      const result = await userCollection.updateOne(filter, updateUser)
      res.send(result)
    })

    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await userCollection.deleteOne(query)
      res.send(result)
    })

    // ===== Menu =========
    app.get('/menu', async (req, res) => {
      const result = await menuCollection.find().toArray()
      res.send(result)
    })

    // =========== review =======
    app.get('/reviews', async (req, res) => {
      const result = await reviewCollection.find().toArray()
      res.send(result)
    })

    // ======== carts ==========
    app.get('/carts', async (req, res) => {
      const email = req.query.email;
      const query = { email: email }
      const result = await cartCollection.find(query).toArray()
      res.send(result)
    })

    app.post('/carts', async (req, res) => {
      const newCart = req.body;
      const result = await cartCollection.insertOne(newCart)
      res.send(result)
    })

    app.delete('/carts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await cartCollection.deleteOne(query)
      res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send("Shining Restaurant is Runnig")
})

app.listen(port, () => {
  console.log("Server Running on Port:", port);
})