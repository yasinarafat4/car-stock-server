const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qx5eerd.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // Collections
    const categoryCollection = client.db("carStock").collection("categories");
    const toysCollection = client.db("carStock").collection("toys");

    app.get("/categories/:category", async (req, res) => {
      console.log(req.params.category);
      if (
        req.params.category == "Sports Car" ||
        req.params.category == "Regular Car" ||
        req.params.category == "Truck"
      ) {
        const cursor = categoryCollection.find({
          category: req.params.category,
        });
        const result = await cursor.toArray();
        return res.send(result);
      }
    });

    app.get("/categories/:category/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await categoryCollection.findOne(query);
      res.send(result);
    });

    // Getting all data
    app.get("/addToys", async (req, res) => {
      const result = await toysCollection.find().toArray();
      res.send(result);
    });

    // POST method for Add Toy Page
    app.post("/addToys", async (req, res) => {
      const body = req.body;
      const result = await toysCollection.insertOne(body);
      res.send(result);
      console.log(body);
    });

    // GET method for Add Toy Page to show the all added data
    app.get("/addToys", async (req, res) => {
      const result = await toysCollection.find().toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Car Stock is Running");
});

app.listen(port, () => {
  console.log(`Car Stock Server is Running on Port ${port}`);
});
