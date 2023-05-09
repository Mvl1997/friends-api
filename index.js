import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;
const url = process.env.MONGO_URI;
const { FRONTEND_URL } = process.env;
const corsOptions = {
  origin: FRONTEND_URL,
};

app.use(express.json());
app.use(cors(corsOptions));

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.log(err);
  });

const schema = new mongoose.Schema(
  {
    name: String,
    age: String,
    photo: String,
    body: String,
    likes: { type: Number, default: 0 },
  },
  { collection: "FriendsApi" }
);

const Post = mongoose.model("Post", schema);

app.use(express.json());

app.get("/", async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

app.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) {
      res.status(404).json({ message: "Friend not found" });
      return;
    }
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/", async (req, res) => {
  const post = new Post(req.body);
  await post.save();
  res.json(post);
});

app.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findByIdAndDelete(id);
    if (!post) {
      res.status(404).json({ message: "Friend not found" });
      return;
    }
    res.json({ message: "Friend deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const post = await Post.findByIdAndUpdate(id, updates, { new: true });
    if (!post) {
      res.status(404).json({ message: "Friend not found" });
      return;
    }
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => console.log(`Listening on port ${port}...`));
