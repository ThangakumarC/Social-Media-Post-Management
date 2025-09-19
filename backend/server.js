const express = require("express");
const cors = require("cors");
const {MongoClient, ObjectId} = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "recommend";

let db, users, posts;

async function initDB() {
    await client.connect();
    db = client.db(dbName);
    users = db.collection("users");
    posts = db.collection("posts");
    console.log("Connected to MongoDB");
}

initDB();

app.post("/login",async (req,res)=>{
    const {username,password} = req.body;
    const user = await users.findOne({username,password});
    if(user){
        console.log("Login success");
        res.json({status:"success",userId:user._id});
    }else{
        console.log("Login failed");
        res.json({status:"failed"});
    }
});

app.post("/addPost",async (req,res)=>{
    const {userId,content,tags} = req.body;
    const user = await users.findOne({_id: new ObjectId(userId)});
    if(user){
        const newPost = {
            userId: user._id.toString(),
            user: user.username,
            content,
            tags:tags || [],
            likes: []
        };
        const result = await posts.insertOne(newPost);
        res.json({status:"success",postId:result.insertedId});
        console.log("Post added");
    }else{
        res.status(404).json({error:"User not found"});
    }
});

app.post("/deletePost",async (req,res)=>{
    const {userId,postId} = req.body;
    const post = await posts.findOne({_id: new ObjectId(postId)});
    if (post.userId.toString() !== userId) {
    return res.status(403).json({ error: "Not allowed to delete this post" });
    }
    if(!post){
        return res.status(404).json({error:"Post not found"});
    }
    else{
            await posts.deleteOne({_id: new ObjectId(postId)});
            res.json({status:"success"});
            console.log("Deleted");
    }
})
app.get("/feed",async (req,res)=>{
    console.log("Fetching feed");
    const data = await posts.find().toArray();
    console.log("Feed fetched");
    res.json(data);
});

app.post("/like",async (req,res)=>{
    console.log("Like request body:", req.body);
    const {userId,postId} = req.body;

    const post = await posts.findOne({_id: new ObjectId(postId)});
    if(!post){
        return res.status(404).json({error:"Post not found"});
    }
    console.log(`User ${userId} liked post ${postId}`);

    const alreadyLiked = post.likes.includes(userId);
    if(alreadyLiked){
        await posts.updateOne({_id: new ObjectId(postId)},{$pull:{likes:userId}});
        console.log(`User ${userId} Unliked post ${postId}`);
        return res.json({status:"unliked"});
    }
    else{
    await posts.updateOne({_id: new ObjectId(postId)},{$addToSet:{likes:userId}});
    if(post.tags && post.tags.length > 0){
        await users.updateOne({_id: new ObjectId(userId)},{$addToSet:{interests:{$each:post.tags}}});
    }
    res.json({status:"liked"});
    }
});

app.post("/recommend", async (req, res) => {
    const { userId } = req.body;
    const user = await users.findOne({ _id: new ObjectId(userId) });

    // Fetch posts based on interests first
    let interestPosts = [];
    if (user && user.interests && user.interests.length > 0) {
        interestPosts = await posts.aggregate([
            { $match: { tags: { $in: user.interests } } },
            { $addFields: { likeCount: { $size: { $ifNull: ["$likes", []] } } } },
            { $sort: { likeCount: -1 } }
        ]).toArray();
    }

    // Fetch other popular posts not in interestPosts
    const interestPostIds = interestPosts.map(p => p._id);
    const otherPosts = await posts.aggregate([
        { $match: { _id: { $nin: interestPostIds } } },
        { $addFields: { likeCount: { $size: { $ifNull: ["$likes", []] } } } },
        { $sort: { likeCount: -1 } }
    ]).toArray();

    // Combine interest-based posts first, then other popular posts
    const recommendedPosts = [...interestPosts, ...otherPosts];
    res.json(recommendedPosts);
});


app.listen(5000, ()=>{
    console.log("Server running on port 5000");
});
