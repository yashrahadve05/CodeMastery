import express from 'express';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';

dotenv.config()
const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/test", (req, res) => {
    try {
        res.send({
            message: "Wow app sahi se chal gaya 🔥",
        })
    } catch (error) {
        console.log(error);
        
    }
})

app.use("/api/v1/auth", authRoutes);








app.listen(process.env.PORT, () => {
    console.log(`Bhai server chal rha hai aur PORT: ${process.env.PORT} hai`);
})