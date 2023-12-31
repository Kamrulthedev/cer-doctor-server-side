const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const { MongoClient, ObjectId } = require('mongodb');
var jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 5000;


// use middlerwer
app.use(cors({
    origin:['http://localhost:5173/'],
    credentials:true
}));
app.use(express.json());
app.use(cookieParser());



// create middleWares
const logger = async(req, res, next) =>{
    console.log('called', req.host, req.originalUrl)
    next()
}

// varifyToken 
const verifyToken = async(req, res, next) =>{
       const token = req.cookie?.token;
       if(!token){
        return res.this.state(401).send({messages: 'not authorized'})
       }
       jwt.verify(token, process.env.ACESS_TOKEN, (err, decode)=>{
           if(err){
            console.log(err)
            return res.status(401).send({messages: 'nuauthorizied'})
           }
        //if token is valid it would be decded
           console.log('value in the token', decode)
           next()
       })
}

const uri = `mongodb+srv://${process.env.VITE_USER}:${process.env.VITE_PASS}@cluster0.35x3s48.mongodb.net`;

// Rest of the code...


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('cerDoctor');
        const servicesCollection = database.collection('services');

       
        // auth related api
        app.post('jwt', logger, verifyToken, async(req, res)=>{
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


