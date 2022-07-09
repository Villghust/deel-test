const { Contract, Job, Profile, Op, sequelize } = require('../model');

const HttpError = require('../error/httpError');

// Since the oldest date inside the seed file i found is from 2020,
// I decided to create a default value to ensure these routes always work
// even if we don't send any start or end date

module.exports = {
    getBestProfession: async ({
        start: startDate = '2019-01-01',
        end: endDate = new Date().toISOString(),
    }) => {
        const [job] = await Job.findAll({
            attributes: [
                [sequelize.fn('sum', sequelize.col('price')), 'totalPaid'],
            ],
            order: [[sequelize.fn('sum', sequelize.col('price')), 'DESC']],
            group: ['Contract.Contractor.profession'],
            limit: 1,
            where: {
                paid: true,
                createdAt: {
                    [Op.between]: [startDate, endDate],
                },
            },
            include: [
                {
                    model: Contract,
                    attributes: ['createdAt'],
                    include: [
                        {
                            model: Profile,
                            as: 'Contractor',
                            where: { type: 'contractor' },
                            attributes: ['profession'],
                        },
                    ],
                },
            ],
        });

        if (!job) {
            throw new HttpError(404, 'No paid job in this date range');
        }

        const result = job.get({ plain: true });

        return {
            profession: result.Contract.Contractor.profession,
            jobs_paid_sum: result.totalPaid,
        };
    },

    getBestClient: async ({
        start: startDate = '2019-01-01',
        end: endDate = new Date().toISOString(),
        limit = 2,
    }) => {
        const clients = await Job.findAll({
            attributes: [[sequelize.fn('sum', sequelize.col('price')), 'paid']],
            order: [[sequelize.fn('sum', sequelize.col('price')), 'DESC']],
            group: ['Contract.Client.id'],
            limit,
            where: {
                paid: true,
                paymentDate: {
                    [Op.between]: [startDate, endDate],
                },
            },
            include: [
                {
                    model: Contract,
                    attributes: ['id'],
                    include: [
                        {
                            model: Profile,
                            as: 'Client',
                            where: { type: 'client' },
                            attributes: ['id', 'firstName', 'lastName'],
                        },
                    ],
                },
            ],
        });

        return clients.map((job) => ({
            name: `${job.Contract.Client.firstName} ${job.Contract.Client.lastName}`,
            total_paid: job.paid,
            client_id: job.Contract.Client.id,
        }));
    },
};
