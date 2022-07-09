const balancesRepository = require('../repositories/balancesRepository');

module.exports = {
    postDeposit: async (req, res) => {
        try {
            const userId = req.params.userId;
            const { amount } = req.body;

            const balance = await balancesRepository.postDeposit({
                userId,
                amount,
            });

            res.status(200).json(balance);
        } catch (error) {
            res.status(error.code).json({ error: error.message });
        }
    },
};
