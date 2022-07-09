const { Router } = require('express');

const { getProfile } = require('./middlewares/getProfile');

const {
    getContractByID,
    getNonTerminatedContracts,
} = require('./controllers/contractsController');

const { getUnpaidJobs } = require('./controllers/jobsController');

const router = new Router();

router.get('/contracts/:id', getProfile, getContractByID);
router.get('/contracts', getProfile, getNonTerminatedContracts);
router.get('/jobs/unpaid', getProfile, getUnpaidJobs);

module.exports = router;
