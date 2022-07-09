const { Router } = require('express');

const { getProfile } = require('./middlewares/getProfile');

const { getContractByID } = require('./controllers/contractsController');

const router = new Router();

router.get('/contracts/:id', getProfile, getContractByID);

module.exports = router;
