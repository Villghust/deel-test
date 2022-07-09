const { Contract, Op } = require('../model');

module.exports = {
    getContractByID: async ({ userId, contractId }) => {
        return Contract.findOne({
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
};
