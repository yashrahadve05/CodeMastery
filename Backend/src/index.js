import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problem.routes.js";
import executionRoutes from "./routes/execute-code.route.js";
import submissionRoutes from "./routes/submission.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());


app.use(
    cors({
        origin: "https://code-mastery-opal.vercel.app",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.get("/yash", (req, res) => {
    try {
        res.send({
            imageUrl:
                "https://media.licdn.com/dms/image/v2/D4D03AQEe-L2jOGgzgg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1720979704506?e=1753920000&v=beta&t=0EAfYx2jaY-jEsAb6TeC7kjCE6mtt54sMd1Ec8OV4RY",
            message:
                "This application was completely developed by Yash Kumar Rahadve. 😎🔥",
        });
    } catch (error) {
        console.log(error);
    }
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/execute-code", executionRoutes);
app.use("/api/v1/submission", submissionRoutes);
app.use("/api/v1/playlist", playlistRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Bhai server chal rha hai aur PORT: ${process.env.PORT} hai`);
});
