const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
    res.send(posts);
});

app.post("/posts", async (req, res) => {
    const id = randomBytes(4).toString("hex");
    const like = 0;
    const { title } = req.body;

    posts[id] = {
        id,
        title,
        like,
    };
    
    await axios.post("http://localhost:4005/events", {
        type: "PostCreated",
        data: {
            id,
            title,
            like,
        },
    });

    res.status(201).send(posts[id]);
});

app.post("/posts/:id/like", async (req, res) => {
    const { id } = req.params;
    const { like } = req.body;

    await axios.post("http://localhost:4005/events", {
        type: "PostLikeCreated",
        data: {
            id,
            like,
        },
    });

    res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
    console.log("Received Event", req.body.type);

    res.send({});
});

app.listen(4000, () => {
    // make changes for image
    console.log("v50");
    console.log("Listening on 4000");
});
