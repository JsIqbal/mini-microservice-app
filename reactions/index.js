const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const { default: axios } = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const reactionByPostId = {};

app.get("/posts/:id/reaction", (req, res) => {
    res.send(reactionByPostId[req.params.id] || []);
});

app.post("/posts/:id/reaction", async (req, res) => {
    const { id } = req.params;

    const reactionId = randomBytes(4).toString("hex");
    const reaction = reactionByPostId[id] || { react: 0 };

    reaction.react++;

    reactionByPostId[id] = reaction;

    await axios.post("http://event-bus-srv:4005/events", {
        type: "ReactionCreated",
        data: {
            id: reactionId,
            postId: id,
            react: reaction.react,
        },
    });

    res.status(201).send(reaction);
});

app.post("/events", async (req, res) => {
    console.log("Recieved Event: ", req.body.type);

    const { type, data } = req.body;

    if (type === "ReactionCreated") {
        console.log("will do something in here----data", data);
    }

    res.send({});
});

app.listen(3004, () => {
    console.log("listening on http://localhost:3004");
});
