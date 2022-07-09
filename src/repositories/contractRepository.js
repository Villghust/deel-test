const { Contract, Op } = require('../model');

module.exports = {
    getContractByID: async ({ userId, contractId }) => {
        return await Contract.findOne({
            where: {
                id: contractId,
                [Op.or]: [
                    {
                        ClientId: userId,
                    },
                    {
                        ContractorId: userId,
                    },
                ],
            },
        });
    },

    getNonTerminatedContracts: async ({ userId }) => {
        return await Contract.findAll({
            where: {
                [Op.or]: [
                    {
                        ClientId: userId,
                    },
                    {
                        ContractorId: userId,
                    },
                ],
                status: { [Op.ne]: 'terminated' },
            },
        });
    },
};
