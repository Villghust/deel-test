const { Router } = require('express');

const { getProfile } = require('./middlewares/getProfile');

const {
    getContractByID,
    getNonTerminatedContracts,
} = require('./controllers/contractsController');

const router = new Router();

router.get('/contracts/:id', getProfile, getContractByID);
router.get('/contracts', getProfile, getNonTerminatedContracts);

module.exports = router;
