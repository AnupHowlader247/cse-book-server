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
  try {
    //insert userinfo into the database
    app.post("/storeUser", async (req, res) => {
      const userInfo = req.body;
      console.log(userInfo)
      const result = await userCollection.insertOne(userInfo);
      res.send(result);
    });
     //login user
     app.post("/loginUser", async (req, res) => {
      const userInfo = req.body;
      const result = await userCollection.findOne({email: userInfo.email});
      if(result.password === userInfo.password){
        res.send({success: true})
      }
      else{
        res.send({success: false})
      }
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