exports.createTeamValidator = (req, res, next) => {
    const body = req.body;
    if(!body?.team_name || body?.team_name?.trim() === '')  {
        return res.status(400).json({message: 'Provide a valid team name'})
    }
    if(!body?.team_name || body?.team_name?.length < 3)  {
        return res.status(400).json({message: 'Team name must need minimum 3 characters'})
    }
    next()
}