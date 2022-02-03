const express = require("express");
var cors = require("cors");

const needle = require("needle");
require("dotenv").config();
const app = express();
app.use(cors({ origin: "*" }));
const port = 4000;
app.get("/find-tweet", async (req, res) => {
  const address = req.query.address;
  if (!address) {
    return res.status(404).send("MISSING_ADDRESS");
  }

  const token = process.env.TWITTER_TOKEN;

  const endpointUrl = "https://api.twitter.com/2/tweets/search/recent";
  const tweetBodyText = "I'm verifying something for someone ";
  const tweetResponse = await needle(
    "get",
    endpointUrl,
    {
      query: `${tweetBodyText}${address}`,
    },
    {
      headers: {
        "User-Agent": "v2TweetLookupJS",
        authorization: `Bearer ${token}`,
      },
    }
  );

  const tweetData = tweetResponse.body.data;
  if (!tweetData) {
    return res.status(404).send("TWEET_NOTFOUND");
  }
  return res.status(200).send(JSON.stringify({ success: true, ...tweetData }));
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
