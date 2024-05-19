"use strict";

const express = require('express')
const router = express.Router()
const {register, login, subscribeTeam, getNotificationsOfUser}  = require('../controllers/users');
const { authenticate, authenticateUser } = require('../middlewares/auth.middleware');
const { registerValidator, loginValidator } = require('../middlewares/validators/userValidator.middleware');


router.post('/register', registerValidator, register)
router.post('/login', loginValidator, login)
router.patch('/subscribe/:teamId', authenticate, subscribeTeam)
router.get('/authenticate', authenticateUser)
router.get("/notifications", authenticate, getNotificationsOfUser)


module.exports = router