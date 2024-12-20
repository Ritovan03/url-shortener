const express = require("express");
const app = express();
const PORT = 8080;
const cookieParser = require('cookie-parser');
const path = require('path');


const {restrictToLoggedinUserOnly,checkAuth} = require('./middlewares/auth');
const {connectToMongoDB} = require('./connect');
const URL = require('./models/url');
const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRouter');
const userRoute = require('./routes/user');


connectToMongoDB('mongodb://localhost:27017/short-url')
.then(()=> console.log("MongoDB connected"));

app.set('view engine', 'ejs');
app.set('views', path.resolve("./views/"));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use("/url",restrictToLoggedinUserOnly,urlRoute);
app.use("/user",userRoute);
app.use("/",checkAuth,staticRoute);

app.get('/url/:shortId', async (req, res) => {
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
