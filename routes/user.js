const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const PlayTime = require("../models/PlayTime");
const rewardPlayTime = 5 * 60;

router.get("/task/:id", getTask, (req, res) => {
    res.send(res.task);
});

router.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        // 500 status means it's server's fault
        res.status(500).json({ message: err.message });
    }
});

router.post("/create-task", async (req, res) => {
    const task = new Task({
        taskName: req.body.taskName,
        taskTime: req.body.taskTime
    });

    try {
        const newTask = await task.save();
        // 201 status means successfully CREATED something
        res.status(201).json(newTask);
    } catch (err) {
        // 400 status means it's user's fault
        res.status(400).json({ message: err.message });
    }
});

router.delete("/delete-task/:id", getTask, async (req, res) => {
    try {
        await res.task.remove();
        res.json({ message: "Deleted Task" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete("/checkin-task/:id", getTask, getPlayTime, createPlayTime, async (req, res) => {
    try {
        await res.task.remove();
        await PlayTime.findByIdAndUpdate(res.playTime._id, {time: res.playTime.time + rewardPlayTime}, (err) => {
            if (err) { return res.status(500).json({message: err.message}); }
        });
        res.json({ message: "Checked-In Task" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/play-time", getPlayTime, createPlayTime, (req, res) => {
    res.json(res.playTime.time);
});

router.delete("/delete-time", getPlayTime, createPlayTime, async (req, res) => {
    const deletingTime = 1;

    try {
        await PlayTime.findByIdAndUpdate(res.playTime._id, {time: Math.max(res.playTime.time - deletingTime, 0)}, (err) => {
            if (err) { return res.status(500).json({message: err.message}); }
        });
        res.json({ message: "Deleted " + deletingTime + " sec" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getTask(req, res, next) {
    let task;
    try {
        task = await Task.findById(req.params.id);
        if (task == null) {
            // 404 status means can't find object
            return res.status(404).json({ message: "Can't find task"} );
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.task = task;
    next();
}

async function createPlayTime(req, res, next) {
    if (res.playTime == null) {
        let playTime = new PlayTime({time: 0});
        try {
            await playTime.save();
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }

        res.playTime = playTime;
        return next();
    }

    return next();
}

async function getPlayTime(req, res, next) {
    let playTime;
    try {
        playTime = await PlayTime.find();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.playTime = playTime.length ? playTime[0] : null;
    next();
}

module.exports = router;