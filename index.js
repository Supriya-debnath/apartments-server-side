const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;


const cors = require('cors');
require('dotenv').config()


const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.crceb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);

async function run(){
    try{
        await client.connect();
        console.log('database connected successfully');

        
    const database = client.db('onlineApartment');
    const apartmentCollection = database.collection('apartments');
    const bookingCollection = database.collection('booking');
    const reviewCollection = database.collection('review');
    const usersCollection = database.collection('users');


    
     // POST API
     app.post('/apartments', async (req, res) => {
      const product = req.body;
      console.log('hitting the post api', product);

      const result = await apartmentCollection.insertOne(product);
      console.log(result);
      res.json(result);
  });


    // GET PRODUCTS API
    app.get('/apartments', async (req, res) => {
      const cursor = apartmentCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
  });



    app.delete('/apartments/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await apartmentCollection.deleteOne(query);
      res.json(result);
    })




   //get api for a single data
   app.get('/apartments/:id', async(req, res) => {
     const carsor = req.params.id;
     const query = {_id: ObjectId(carsor)}
    const result = await apartmentCollection.find(query).toArray();
    res.send(result[0]);
  })


    // POST order
   app.post("/booking", async(req, res) => {
     const query = req.body;
     const result = await bookingCollection.insertOne(req.body);
     console.log(result);
     res.send(result);
   })


   // All Orders
   app.get("/booking", async(req, res) => {
    const query = bookingCollection.find({});
    const result = await query.toArray();
    console.log(result);
    res.send(result);
});


   // My booking
  app.get("/myBooking", async(req, res) => {
    const email = req.query.email;
    const query = {email:email}
    const cursor = bookingCollection.find(query);
    const result = await cursor.toArray();
    res.send(result); 
  })


  // Delete API

  app.delete('/booking/:id', async (req, res) => {
    const id = req.params.id;
    const query = {_id: ObjectId(id)};
    const result = await bookingCollection.deleteOne(query);
    res.json(result);
  })


  



       //  Creating admin API

       
       app.put("/users/admin", async (req, res) => {
        const user = req.body;
        // console.log(user);
        const filter = { email: user.email };
        const updateDoc = { $set: { role: "admin" } };
        const result = await usersCollection.updateOne(filter, updateDoc);
        res.json(result);
    });




    // get api admin panel
    app.get("/users/:email", async (req, res) => {
        const email = req.params.email;
        const query = { email: email };
        const user = await usersCollection.findOne(query);
        console.log(user);
        let isAdmin = false;
        if (user?.role === "admin") {
            isAdmin = true;
        }
        res.json({ admin: isAdmin });
    });



    // post API for reviews
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      console.log(review);
      const result = await reviewCollection.insertOne(review);
      console.log(result);
      res.json(result);
  });


   // get API for reviews
   app.get("/reviews", async (req, res) => {
    const allReview = await reviewCollection.find({}).toArray();
    res.send(allReview);
});



     // post API user
     app.post("/users", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await usersCollection.insertOne(user);
      console.log(result);
      res.json(result);
  });


  // put API user
  app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(filter, updateDoc, options);
      res.json(result);
  });
    


//       // POST API
//       app.post('/apartments', async (req, res) => {
//         const apartment = req.body;
//         console.log('hitting the post api', apartment);
  
//         const result = await apartmentCollection.insertOne(apartment);
//         console.log(result);
//         res.json(result);
//     });


//     // GET API
//     app.get('/apartments', async (req, res) => {
//         const cursor = apartmentCollection.find({});
//         const apartments = await cursor.toArray();
//         res.send(apartments);
//     });


//     app.delete('/apartments/:id', async(req, res) => {
//         const id = req.params.id;
//         const query = {_id: ObjectId(id)};
//         const result = await apartmentCollection.deleteOne(query);
//         res.json(result);
//       })
  
  
//       // get tour booking
//     app.get('/apartmentBooking/:id', async(req, res) => {
//         const result = await apartmentCollection.find({_id: ObjectId(req.params.id)}).toArray();
//         res.send(result[0]);
//       })


//   // confirm order
//   app.post("/confirmOrder", async(req, res) => {
//     const query = req.body;
//     const result = await bookingCollection.insertOne(req.body);
//     res.send(result);
//   })

//   // All Booking
//   app.get("/booking", async(req, res) => {
//     const query = bookingCollection.find({});
//     const result = await query.toArray();
//     res.send(result);
// })



//   // My Booking
//   app.get("/booking/:email", async (req, res) => {
//     const query = bookingCollection.find({email:req.params.email})
//     const result = await query.toArray();
//     res.send(result);
//   })

  


//   // Delete API

//   app.delete('/booking/:id', async (req, res) => {
//     const id = req.params.id;
//     const query = {_id: ObjectId(id)};
//     const result = await bookingCollection.deleteOne(query);
//     res.json(result);
//   })

  }

    finally{
        // await client.close();
    }
}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello apartment Server Site!')
  })
  
  app.listen(port, () => {
    console.log(`Running server:${port}`)
  })