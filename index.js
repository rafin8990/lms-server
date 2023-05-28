const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(express.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nuouh7o.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const moduleCollection = client.db('lms-client').collection('modules');
async function run() {
    try {
// get all modules 
        app.get('/modules', async (req, res) => {
            const query = {};
            const result = await moduleCollection.find(query).toArray();
            res.send(result)
        });

        app.put('/modules/lessons/:index', async (req, res) => {
            const index = parseInt(req.params.index);
            try {
                const result = await moduleCollection.updateOne({ index }, { $set: { unlocked: true } });
                if (result.modifiedCount === 1) {
                    res.sendStatus(200);
                } else {
                    res.sendStatus(404);
                }
            } catch (error) {
                console.error('Error unlocking video:', error);
                res.status(500).json({ error: 'An error occurred' });
            }
        })

    }
    finally {

    }
}
run().catch(error => console.error(error))

app.get('/', (req, res) => {
    res.send('lms server is running')
});

app.listen(port, () => {
    console.log(`lms-server running on port ${port}`)
})