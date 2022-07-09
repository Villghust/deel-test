const contractRepository = require('../repositories/contractRepository');

module.exports = {
    getContractByID: async (req, res) => {
        const { id: contractId } = req.params;
        const userId = req.profile.id;

        const contract = await contractRepository.getContractByID({
            userId,
            contractId,
        });

        if (!contract) return res.status(404).end();

        res.json(contract);
    },
};
