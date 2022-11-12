const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const {ObjectId} = require('mongodb')

// app
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// apis
app.get("/", (req, res) => {
  res.send("Hello from Webwork server running");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

//   database collection
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.shv7buz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const userCollection = client.db("WebWorks").collection("services");
    // geting data
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });
    // geting data for home
    app.get("/services/home", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query).limit(3);
      const services = await cursor.toArray();
      res.send(services);
    });
    //getting data for showing service details
    app.get("/services/:id", async (req, res) => {
        const id = req.params.id;
        console.log(id)

        const query = { _id: ObjectId(id) };
        // const query = {_id:ObjectId(id)};
        const service = await userCollection.findOne(query);
        res.send(service);
      });
  
  } 
  finally {
  }
}

run().catch((err) => {
    console.error(err);
  });
