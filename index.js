const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cwirz.mongodb.net/assignment9?retryWrites=true&w=majority`;
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(cors());
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("hi from database");
});
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const allSellerCollection = client.db("imponexpo").collection("Sellers");
  const allProductCollection = client.db("imponexpo").collection("allProducts");
  app.post("/addNewSeller", (req, res) => {
    const newSeller = req.body;
    allSellerCollection
      .insertOne(newSeller)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => console.log(err));
  });
  app.get("/seller_info/:sellerEmail", (req, res) => {
    allSellerCollection
      .find({ sellerEmail: req.params.sellerEmail })
      .toArray((err, items) => {
        res.send(items);
      });
  });
  app.post("/addproduct", (req, res) => {
    const newproduct = req.body;
    allProductCollection
      .insertOne(newproduct)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => console.log(err));
  });
  app.get("/allProducts", (req, res) => {
    allProductCollection.find().toArray((err, items) => {
      res.send(items);
      console.log(items);
    });
  });
  app.get("/products/:productID", (req, res) => {
    allProductCollection
      .find({ _id: ObjectId(req.params.productID) })
      .toArray((err, items) => {
        res.send(items);
        console.log(items);
      });
  });
});

app.listen(process.env.PORT || 5001);
