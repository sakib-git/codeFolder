const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('codeFolder');
});

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@mongodb.0ps5adl.mongodb.net/?appName=MongoDB`;

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
    await client.connect();
    const bd = client.db('CodeFolder');
    const getDataCollection = bd.collection('getData');

    app.get('/datas', async (req, res) => {
      const result = await getDataCollection.find().toArray();
      res.send(result);
    });

    app.post('/datas', async (req, res) => {
      try {
        const newData = req.body;

        const result = await getDataCollection.insertOne(newData);
        res.send(result);
      } catch (err) {
        res.status(500).send({ error: 'Failed to add data' });
      }
    });

 app.patch('/datas/:id', async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;

  const query = { _id: new ObjectId(id) };

  const result = await getDataCollection.updateOne(
    query,
    { $set: updatedData }  
  );

  res.send(result);
});

app.delete('/datas/:id', async (req, res) => {
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await getDataCollection.deleteOne(query)
  res.send(result)
})


    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
