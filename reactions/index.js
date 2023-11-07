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
    const reactionId = randomBytes(4).toString("hex");

    const { content, status, react } = req.body;

    const reaction = reactionByPostId[req.params.id] || [];

    reaction.push({ id: reactionId, content, status, react });

    reactionByPostId[req.params.id] = reaction;

    await axios.post("http://event-bus-srv:4005/events", {
        type: "ReactionCreated",
        data: {
            id: reactionId,
            content,
            postId: req.params.id,
            status,
            react,
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

// const express = require("express");
// const bodyParser = require("body-parser");
// const axios = require("axios");

// const app = express();
// app.use(bodyParser.json());

// app.post("/events", async (req, res) => {
//     const { type, data } = req.body;
//     if (type === "ReactionCreated") {
//         const { reactions, status, content, postId, id } = data;

//         await axios.post("http://event-bus-srv:4005/events", {
//             type: "ReactionModerated",
//             data: {
//                 id,
//                 postId,
//                 reactions,
//                 status,
//                 content,
//             },
//         });
//     }
//     res.send({});
// });

// app.listen(4004, () => {
//     console.log("Listening on 4004");
// });
