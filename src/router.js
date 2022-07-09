const { Router } = require('express');

const { getProfile } = require('./middlewares/getProfile');

const {
    getContractByID,
    getNonTerminatedContracts,
} = require('./controllers/contractsController');

const { getUnpaidJobs, postPayment } = require('./controllers/jobsController');

const { postDeposit } = require('./controllers/balancesController');

const {
    getBestClient,
    getBestProfession,
} = require('./controllers/adminsController');

const router = new Router();

router.get('/contracts/:id', getProfile, getContractByID);
router.get('/contracts', getProfile, getNonTerminatedContracts);
router.get('/jobs/unpaid', getProfile, getUnpaidJobs);
router.post('/jobs/:id/pay', getProfile, postPayment);
router.post('/balances/deposit/:userId', postDeposit);
router.get('/admin/best-profession', getBestProfession);
router.get('/admin/best-clients', getBestClient);

module.exports = router;
