
const shortId = require('shortid');
const URL = require('../models/url');

async function handleGenerateNewShortURL(req, res) {
    const shortID = shortId();
    const body = req.body;
    if(!body.url) return res.status(400).json({error :'URL is required'});
    const newURL = new URL({
        shortId: shortID,
        redirectURL: body.url,
        visitHistory: [],
    });

    try {
        await newURL.save(); // Save the new URL to the database
        return res.render('home', 
            { id: shortID,
                
            }
        ); // Render the home page with the generated short ID
        
        //return res.status(201).json({ id: shortID }); // Respond with the generated short ID
    } catch (error) {
        console.error("Error saving URL:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }

}

async function handleGetAnalytics(req,res) {
    const shortID = req.params.shortId;
    const result = await URL.findOne({shortID});
    return res.json({
        totalClicks:result.visitHistory.length,
        analytics:result.visitHistory
    });
    
}

async function handleGetAnalytics(req, res) {  
    const shortID = req.params.shortID;
    const result = await URL.findOne({shortID});
    return res.json({
        totalClicks:result.visitHistory.length,analytics:result.visitHistory,
    });
}

module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics
}