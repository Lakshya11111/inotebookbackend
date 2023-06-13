const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Notes = require("../models/Notes");
const { check, validationResult } = require('express-validator');

//ROUTE 1 - fetchin notes : POST "/api/notes/fetchnotes" .login required
router.get('/fetchnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.json(500).send("Some error occured");
    }
})

//ROUTE 2 - Adding new note : POST "/api/notes/addnotes" .login required
router.post('/addnotes', fetchuser, [
    check('title', "Enter a valid title").not().isEmpty(),
    check('description', "Discription cannot be blanked").not().isEmpty()
], async (req, res) => {
    const { title, description, tags } = req.body;
    try {
        //if error is found, returns bad request and errors 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const note = new Notes({
            title, description, tags, user: req.user.id
        })

        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.json(500).send("Some error occured");
    }
})

//ROUTE 3 - updating existing note : put "/api/notes/updatenotes/:id" .login required
router.put('/updatenotes/:id', fetchuser, async (req, res) => {
    const { title, description, tags } = req.body;

    try {
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tags) { newNote.tags = tags };

        //find the note to be updated and update it
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not found");
        }

        if (note.user.toString() != req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.json(500).send("Some error occured");
    }
})

//ROUTE 4 - Deleting existing note : put "/api/notes/deletenotes/:id" .login required
router.delete('/deletenotes/:id', fetchuser, async (req, res) => {

    try {
        //find the note to be updated and update it
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not found");
        }

        if (note.user.toString() != req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({ "Succes": "Note is succesfully deleted", note: note});
    } catch (error) {
        console.error(error.message);
        res.json(500).send("Some error occured");
    }
})

module.exports = router;