import { db } from "../libs/db.js";

export const createPlaylist = async (req, res) => {
    try {
        const { name, description } = req.body;

        const userId = req.user.id;

        const playlist = await db.playlist.create({
            data: {
                name,
                description,
                userId,
            },
        });

        res.stuatus(200).json({
            success: true,
            message: "Playlist created successfully!",
            playlist,
        });
    } catch (error) {
        console.log("Error creating playlist: ", error);
        res.status(500).jsonI({
            success: false,
            message: "Error creating playlist!",
        });
    }
};

export const getAllPlaylist = async (req, res) => {
    try {
        const playlists = await db.playlist.findMany({
            where: {
                userId: req.user.id,
            },
            include: {
                problems: {
                    include: {
                        problem: true,
                    },
                },
            },
        });

        res.status(200).json({
            success: true,
            message: "Playlist fetched successfully!",
            playlists,
        });
    } catch (error) {
        console.log("Error while fetching playlist: ", error);
        res.status(500).json({
            success: false,
            message: "Error fetching playlist!",
        });
    }
};

export const getPlaylistDetails = async (req, res) => {
    const { playlistId } = req.params;

    try {
        const playlist = await db.playlist.findUnique({
            where: {
                id: playlistId,
                userId: req.user.id,
            },
            include: {
                problems: {
                    include: {
                        problem: true,
                    },
                },
            },
        });

        if (!playlist) {
            return res.status(404).json({
                success: false,
                message: "Playlist not found!",
            });
        }

        res.status(200).json({
            success: true,
            message: "Playlist fetched successfully!",
            playlist,
        });
    } catch (error) {
        console.log("Error while fetching playlist: ", error);
        res.status(500).json({
            success: false,
            message: "Error fetching playlist!",
        });
    }
};

export const addProblemToPlaylist = async (req, res) => {
    const { playlistId } = req.params;
    const { problemId } = req.body;

    try {
        if (!Array.isArray(problemId) || problemId.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Problem ID is required!",
            });
        }

        const problemsInPlaylist = await db.problemsInPlaylist.createMany({
            data: problemId.map((problemId) => ({
                playlistId,
                problemId,
            })),
        });

        res.status(200).json({
            success: true,
            message: "Problems added to playlist successfully!",
            problemsInPlaylist,
        });
    } catch (error) {
        console.log("Error while adding problems to playlist: ", error);
        res.status(500).json({
            success: false,
            message: "Error adding problems to playlist!",
        });
    }
};

export const deletePlaylist = async (req, res) => {
    const { playlistId } = req.params;

    try {
        const deletePlaylist = await db.playlist.delete({
            where: {
                id: playlistId,
                // userId: req.user.id
            },
        });

        res.status(200).json({
            success: true,
            message: "Playlist deleted successfully!",
            deletePlaylist,
        });
    } catch (error) {
        console.log("Error while deleting playlist: ", error);
        res.status(500).json({
            success: false,
            message: "Error deleting playlist!",
        });
    }
};

export const removeProblemFromPlaylist = async (req, res) => {
    const { playlistId } = req.params;
    const { problemId } = req.body;

    try {
        if (!Array.isArray(problemId) || problemId.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Problem ID is required!",
            });
        }

        const deleteProblem = await db.problemsInPlaylist.deleteMany({
            where: {
                playlistId,
                problemId: {
                    in: problemId,
                },
            },
        });

        res.status(200).json({
            success: true,
            message: "Problems removed from playlist successfully!",
            deleteProblem,
        });
    } catch (error) {
        console.log("Error while removing problem from playlist: ", error);
        res.status(500).json({
            success: false,
            message: "Error removing problem from playlist!",
        });
    }
};
