const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middle wares 
app.use(cors());
app.use(express.json());

// mongo
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rdk2cfs.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
 
async function run() {
  const userCollection = client.db("CSE-BOOK").collection("users");
  const postCollection = client.db("CSE-BOOK").collection("posts");
  const messagesCollection = client.db("CSE-BOOK").collection("messages");
  
  try {
    //insert userinfo into the database
    app.post("/storeUser", async (req, res) => {
      const userInfo = req.body;
      const result = await userCollection.insertOne(userInfo);
      res.send(result);
    });
     //insert post
     app.post("/post", async (req, res) => {
      const post = req.body;
      const result = await postCollection.insertOne(post);
      res.send(result);
    });
     //insert messages
     app.post("/storeMessages", async (req, res) => {
      const post = req.body;
      const result = await messagesCollection.insertOne(post);
      res.send(result);
    });

     //get all post
     app.get("/allPost", async (req, res) => {
      const result = await postCollection.find({}).toArray();
      res.send(result);
    });

     //get search post
     app.get("/searchPost/:name", async (req, res) => {
      const name = req.params.name
      const result = await postCollection.find({topic:name}).toArray();
      res.send(result);
    });

     //get all chat users
     app.get("/allchatUsers/:name", async (req, res) => {
      const name = req.params.name;
      const result = await messagesCollection.find({ $or: [ { to:name }, { sender:name } ] }).toArray();
      res.send(result);
    });

      //get all chat with individual
      app.get("/individualChat/:name", async (req, res) => {
        const name = req.params.name;
        const result = await messagesCollection.find({ $or: [ { to:name.split('&')[0], sender: name.split('&')[1] }, { to:name.split('&')[1], sender: name.split('&')[0]  } ] }).toArray();
        res.send(result);
      });

  }
  catch (error) {
    console.log(error) 
  }
}
     
run().catch((err) => console.log(err));

  
app.get("/", (req, res) => {
  res.send("api found");
});
app.listen(port, () => {
  console.log("server running");
});