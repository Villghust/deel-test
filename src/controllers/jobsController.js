const jobsRepository = require('../repositories/jobsRepository');

module.exports = {
    getUnpaidJobs: async (req, res) => {
        const userId = req.profile.id;

        const unpaidJobs = await jobsRepository.getUnpaidJobs({ userId });

        res.status(200).json(unpaidJobs);
    },
};
