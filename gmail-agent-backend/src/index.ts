import express from "express"
import authRoutes from "./routes/auth"
import gmailRoutes from "./routes/gmail"


const app = express();
app.use(express.json())

app.use("/auth", authRoutes)
app.use("/gmail", gmailRoutes)

app.get("/", (req, res) => {
    res.send("Backend is alive!");
});

app.listen(3000, "0.0.0.0", () => {
    console.log("Server running on http://localhost:3000");
});
