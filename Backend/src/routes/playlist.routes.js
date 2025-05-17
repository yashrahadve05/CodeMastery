import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
    addProblemToPlaylist,
    createPlaylist,
    deletePlaylist,
    getAllPlaylist,
    getPlaylistDetails,
    removeProblemFromPlaylist,
} from "../controllers/playlist.controllers";

const playlistRoutes = Router();

playlistRoutes.get("/", authMiddleware, getAllPlaylist);
playlistRoutes.get("/:playlistId", authMiddleware, getPlaylistDetails);
playlistRoutes.post("/create-playlist", authMiddleware, createPlaylist);
playlistRoutes.post("/add-problem/:playlistId", authMiddleware, addProblemToPlaylist);
playlistRoutes.delete("/delete-playlist/:playlistId", authMiddleware, deletePlaylist);
playlistRoutes.delete("/remove-problem/:playlistId", authMiddleware, removeProblemFromPlaylist);

export default playlistRoutes;
