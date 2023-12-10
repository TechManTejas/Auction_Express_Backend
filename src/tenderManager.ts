import Tender from "./models/Tender";

const checkAndEndTenders = async () => {
    const now = new Date();

    try {
        // Find tenders that are 'In Progress' and have bidEndsOn in the past
        const notEndedTenders = await Tender.find({
            status: 'In Progress',
            bidEndsOn: { $lt: now },
        });

        for (const tender of notEndedTenders) {
            // Update the status to 'Ended'
            await Tender.findByIdAndUpdate(tender._id, { $set: { status: 'Ended' } });
            console.log(`Tender ${tender._id} has ended.`);
        }
    } catch (error: any) {
        console.error('Error updating tenders:', error.message);
    }
};

export default checkAndEndTenders