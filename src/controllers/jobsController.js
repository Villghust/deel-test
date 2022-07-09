const jobsRepository = require('../repositories/jobsRepository');

module.exports = {
    getUnpaidJobs: async (req, res) => {
        try {
            const userId = req.profile.id;

            const unpaidJobs = await jobsRepository.getUnpaidJobs({ userId });

            res.status(200).json(unpaidJobs);
        } catch (error) {
            res.status(error.code).json({ error: error.message });
        }
    },

    // IMO, we should be using a PATCH request instead of POST request
    postPayment: async (req, res) => {
        try {
            const jobId = req.params.id;
            const userId = req.profile.id;

            const jobPayed = await jobsRepository.postPayment({
                jobId,
                userId,
            });

            res.status(200).json(jobPayed);
        } catch (error) {
            res.status(error.code).json({ error: error.message });
        }
    },
};
