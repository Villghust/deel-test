const { Contract, Job, Profile, sequelize } = require('../model');

const HttpError = require('../error/httpError');

module.exports = {
    postDeposit: async ({ userId, amount }) => {
        return await sequelize.transaction(async (t) => {
            const client = await Profile.findByPk(userId, { transaction: t });

            if (!client || client.type !== 'client') {
                throw new HttpError(404, 'Client not found');
            }

            const unpaidSum = await Job.sum('price', {
                where: {
                    paid: false,
                },
                include: [
                    {
                        model: Contract,
                        required: true,
                        attributes: [],
                        where: {
                            status: 'in_progress',
                            ClientId: userId,
                        },
                    },
                ],
            });

            const threshold = unpaidSum * 0.25;

            if (amount > threshold) {
                throw new HttpError(400, 'Deposit exceeds limit');
            }

            client.balance = parseFloat((client.balance + amount).toFixed(2));

            await client.save({ transaction: t });

            return client;
        });
    },
};
