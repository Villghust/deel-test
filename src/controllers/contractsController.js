const contractsRepository = require('../repositories/contractsRepository');

module.exports = {
    getContractByID: async (req, res) => {
        const { id: contractId } = req.params;
        const userId = req.profile.id;

        const contract = await contractsRepository.getContractByID({
            userId,
            contractId,
        });

        if (!contract) return res.status(404).end();

        res.status(200).json(contract);
    },

    getNonTerminatedContracts: async (req, res) => {
        const userId = req.profile.id;

        const contracts = await contractsRepository.getNonTerminatedContracts({
            userId,
        });

        res.status(200).json(contracts);
    },
};
