import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors';
import userRoutes from "./Routes/user.routes.js"
import teamRoutes from "./Routes/team.routes.js"
import taskRoutes from "./Routes/task.routes.js"
import messageRoutes from "./Routes/message.routes.js";



 
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use(express.json({limit: "40kb"}));
app.use(express.urlencoded({limit: "40kb", extended: true}))
app.use("/api/auth",userRoutes); 
app.use("/api/teams", teamRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/messages", messageRoutes);


app.get("/", (req, res) => {
    return res.json({"hello" : "World"})
})



const start = async() => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB connected");

        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`)
        })
    } catch (err) {
        console.error("❌ Error connecting to MongoDB:", err.message);
        process.exit(1);
    }
}

start();