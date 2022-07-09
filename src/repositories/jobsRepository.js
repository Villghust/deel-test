const { Contract, Job, Op } = require('../model');

module.exports = {
    getUnpaidJobs: async ({ userId }) => {
        return await Job.findAll({
            where: {
                paid: false,
            },
            include: [
                {
                    model: Contract,
                    required: true,
                    attributes: [],
                    where: {
                        [Op.or]: [
                            {
                                ClientId: userId,
                            },
                            {
                                ContractorId: userId,
                            },
                        ],
                        status: 'in_progress',
                    },
                },
            ],
        });
    },
};
