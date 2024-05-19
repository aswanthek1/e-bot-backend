"use strict";

const express = require('express')
const router = express.Router()
const { authenticate, checkAdmin } = require('../middlewares/auth.middleware');
const { createTeam, getTeamsData, editTeam } = require('../controllers/team');
const { createTeamValidator } = require('../middlewares/validators/teamValidator.middleware');


router.post("/create-team", authenticate, checkAdmin, createTeamValidator, createTeam)
router.get("/get-teams", authenticate, getTeamsData)
router.put("/edit-team/:id", authenticate, checkAdmin, editTeam)



module.exports = router