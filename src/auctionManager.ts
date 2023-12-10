import { io } from './app';
import AuctionModel, { IAuction } from './models/Auction';
import { startAuctionTimer } from './sockets/auctionSocket';

// Define a dictionary to store auction information
const auctionsData: Record<string, IAuction> = {}

// Example function to check and move auctions to auctionsData when they start
const checkAndMoveAuctions = async (allAuctions: Record<string, IAuction>) => {

    const now = new Date()
    // Add 5 hours and 30 minutes
    now.setHours(now.getHours() + 5);
    now.setMinutes(now.getMinutes() + 30);

    console.log(now)

    for (const auctionId in allAuctions) {
        const auction = allAuctions[auctionId];

        console.log(auction.status)
        console.log(auction.start_datetime, now)

        if (auction && auction.status === 'Not Started' && auction.start_datetime <= now) {
            try {
                console.log("Starting Auction:- ", auction)

                // Convert the plain object to a Mongoose document
                const auctionDocument = new AuctionModel(auction);

                // Update the status in MongoDB
                await AuctionModel.updateOne({ _id: auction._id }, { $set: { status: 'In Progress' } });

                // Update auctionsData with the Mongoose document
                auctionsData[auctionId] = auctionDocument.toObject();

                // Update the status in memory
                auctionsData[auctionId].status = 'In Progress';

                // Additional logic if needed when an auction starts
                console.log(`Auction ${auctionId} has started.`);

                // If it's a new auction, start the timer
                startAuctionTimer(io, auctionId, auction.start_datetime, auction.duration 
                    - (1.98e+7)
                );


            } catch (error: any) {
                console.error('Error converting to Mongoose document:', error.message);
            }
        }
    }
};

// Function to check and update the status of ended auctions
const checkAndEndAuctions = async () => {
    const now = new Date();
    // Add 5 hours and 30 minutes
    now.setHours(now.getHours() + 5);
    now.setMinutes(now.getMinutes() + 30);

    for (const auctionId in auctionsData) {
        const auction = auctionsData[auctionId];

        if (auction && auction.status === 'In Progress') {
            const auctionStartTime = new Date(auction.start_datetime).getTime();
            const auctionEndTime = new Date(auctionStartTime + auction.duration);

            console.log("Now: ", now, "Auction End Time:", auctionEndTime);

            if (now >= auctionEndTime) {
                try {
                    // Update the status in memory
                    auction.status = 'Ended';

                    // Update the entire auction information in MongoDB
                    await AuctionModel.updateOne({ _id: auction._id }, { $set: { ...auction } });

                    // Remove the auction from memory if needed
                    delete auctionsData[auctionId];
                    console.log(`Auction ${auctionId} has ended.`);

                } catch (error: any) {
                    console.error('Error updating auction in MongoDB:', error.message);
                }
            }
        }
    }
};

// Example function to retrieve 'Not Started' auctions from the database
const getNotStartedAuctions = async (): Promise<Record<string, IAuction>> => {
    try {
        // Fetch 'Not Started' auctions from the database using your Mongoose model
        const auctions = await AuctionModel.find({ status: 'Not Started' }).lean().exec();

        // Convert the array of documents to a Record with auctionId as the key
        const auctionsById: Record<string, IAuction> = auctions.reduce((acc: any, auction) => {
            // Use a non-null assertion to let TypeScript know that auction._id is not undefined
            acc[auction._id!.toString()] = auction;
            return acc;
        }, {});

        return auctionsById;
    } catch (error: any) {
        console.error('Error fetching auctions from the database:', error.message);
        return {};
    }
};


// Set the interval to check and move auctions every 1 minute (adjust as needed)
const checkAuctionsInterval = setInterval(async () => {
    const allAuctions = await getNotStartedAuctions();
    checkAndMoveAuctions(allAuctions);
    checkAndEndAuctions();
}, 60000 / 20); // 60000 milliseconds = 1 minute

// Uncomment the line below if you want to stop the interval when needed (e.g., when the server is shutting down)
// clearInterval(checkAuctionsInterval);

export default auctionsData