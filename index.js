const express = require("express");
const app = express();
const PORT = 8080;
const urlRoute = require('./routes/url');
const {connectToMongoDB} = require('./connect');
const URL = require('./models/url');


connectToMongoDB('mongodb://localhost:27017/short-url')
.then(()=> console.log("MongoDB connected"));

app.set('view engine', 'ejs');

app.use(express.json());

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId: shortId
    }, 
    {$push: {visitHistory: {
        timestamp: Date.now()
    },

    }});
    res.redirect(entry.redirectURL);
});




app.listen(PORT, () => console.log(`server running on port ${PORT}`));

app.use("/url",urlRoute);
