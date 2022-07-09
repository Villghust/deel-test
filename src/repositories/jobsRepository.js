const { Contract, Job, Profile, Op, sequelize } = require('../model');

const HttpError = require('../error/httpError');

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

    postPayment: async ({ jobId, userId }) => {
        return await sequelize.transaction(async (t) => {
            const job = await Job.findOne(
                {
                    where: {
                        id: jobId,
                    },
                    include: [
                        {
                            model: Contract,
                            required: true,
                            attributes: ['ContractorId'],
                            where: {
                                ClientId: userId,
                            },
                        },
                    ],
                },
                { transaction: t }
            );

            if (!job) {
                throw new HttpError(404, 'Job not found');
            }

            if (job.paid) {
                throw new HttpError(409, 'Job already paid');
            }

            const client = await Profile.findByPk(userId, { transaction: t });
            const contractor = await Profile.findByPk(
                job.Contract.ContractorId,
                {
                    transaction: t,
                }
            );

            if (client.balance < job.price) {
                throw new HttpError(400, 'Insufficient funds');
            }

            client.balance = client.balance - job.price;

            contractor.balance = contractor.balance + job.price;

            job.paid = true;
            job.paymentDate = new Date().toISOString();

            await client.save({ transaction: t });
            await contractor.save({ transaction: t });
            await job.save({ transaction: t });

            return job;
        });
    },
};
