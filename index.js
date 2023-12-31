const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const { MongoClient, ObjectId } = require('mongodb');
var jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin:['http://localhost:5173/'],
    credentials:true
}));
app.use(express.json());
app.use(cookieParser());

const uri = `mongodb+srv://${process.env.VITE_USER}:${process.env.VITE_PASS}@cluster0.35x3s48.mongodb.net`;

// Rest of the code...


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('cerDoctor');
        const servicesCollection = database.collection('services');

       
        // auth related api
        app.post('jwt', async(req, res)=>{
            const user = req.body;
            console.log(user)
            const token  = jwt.sign(user, process.env.ACESS_TOKEN, {expiresIn: '1h'} )
            res. 
            cookie('token', token, {
                httpOnly:true,
                secure:false,
                sameSite:'none'

            }).
            send({success: true});
        })


        // get oparetion
        app.get('/services', async(req, res)=>{
            
        })



        console.log("Connected to MongoDB!");
    } finally {
        // The client will close when you finish/error
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Car Doctor server is running');
});

app.listen(port, () => {
    console.log(`Car Doctor Server is running on Port: ${port}`);
});


