import { Server, Socket } from 'socket.io';
import auctionsData from '../auctionManager';

export function startAuctionTimer(io: Server, auctionId: string, startDatetime: Date, duration: number) {
    // Calculate the auction end time
    const auctionEndTime = new Date(startDatetime).getTime() + duration; // Convert duration to milliseconds

    // Update clients with time remaining
    const intervalId = setInterval(() => {
        const timeRemaining = Math.max(0, auctionEndTime - Date.now());
        console.log("Time remaining for", auctionId, " is ", timeRemaining)
        io.to(auctionId).emit('updateTime', { timeRemaining });

        // If the time is up, end the auction and clear the interval
        if (timeRemaining === 0) {
            io.to(auctionId).emit('auctionEnd');
            clearInterval(intervalId);
        }
    }, 1000);
}


const auctionSockets = (io: Server) => {
    // Function to start the auction timer for a specific auction
    io.on('connection', (socket: Socket) => {
        console.log(`User connected: ${socket.id}`);

        // Handle joining an auction room
        socket.on('joinAuction', (data) => {
            try {
                const { auctionId, bidder_id, bidder_name } = data;
                console.log({ auctionId, bidder_id, bidder_name })

                // Check if the auction is active and not ended yet
                const auction = auctionsData[auctionId];
                if (!auction || auction.status !== 'In Progress') {
                    throw new Error('Auction is not active or has ended');
                }

                // Join the room specific to the auction
                socket.join(auctionId);

                // Add the user's information to the auctionData for that auction
                if (!auction.users.find(u => u._id === bidder_id)) {
                    auction.users.push({
                        _id: bidder_id,
                        name: bidder_name,
                        // Add other user-related fields as needed
                    });
                }

                // Send the initial information about the auction to the user
                socket.emit('initialAuctionInfo', {
                    auctionId,
                    title: auction.title,
                    description: auction.description,
                    openingBidAmount: auction.opening_bid_amount,
                    winnerName: auction ? auction.winner_name : 'Unknown Bidder', 
                    winnerBidAmount: auction.winner_bid_amount,
                    // Add other relevant auction information as needed
                });

                console.log(`User ${socket.id} joined auction room: ${auctionId}`);
            } catch (error: any) {
                console.error('Error joining auction room:', error.message);
            }
        });

        // Handle bidding events
        socket.on('placeBid', async (data) => {
            try {
                // Extract relevant information from the bid data
                const { auctionId, bidderId, raiseOptionId } = data;

                // Get the auction from auctionsData
                const auction = auctionsData[auctionId];

                // Check if the auction has not ended (current time < start_datetime + duration)
                const now = new Date();
                const auctionEndTime = new Date(auction.start_datetime);
                auctionEndTime.setMinutes(auctionEndTime.getMinutes() + auction.duration);

                if (now < auctionEndTime) {
                    // Find the raise option amount based on the provided raiseOptionId
                    const raiseAmount = parseInt(JSON.parse(auction.raise_options.toString())[raiseOptionId])

                    console.log(`Raise option`, raiseAmount);
                    // Check if the raise option exists
                    if (raiseAmount) {
                        // Calculate the total bid amount by adding the raise option amount to the current winner_bid amount
                        const totalBidAmount = auction.winner_bid_amount + raiseAmount;

                        // Find the bidder's information based on their ID
                        const bidder = auction.users.find(user => user._id === bidderId);

                        // Update winner information in auctionsData
                        auction.winner_id = bidderId;
                        auction.winner_bid_amount = totalBidAmount;
                        auction.winner_name = bidder ? bidder.name : 'Unknown Bidder', 

                        // Broadcast the updated bid information to other users in the auction room
                        io.to(auctionId).emit('updateBids', {
                            auctionId,
                            winnerName: bidder ? bidder.name : 'Unknown Bidder', // Send the bidder's name to the frontend
                            winnerBidAmount: totalBidAmount,
                        });

                        // Additional logic if needed when a bid is successfully placed
                        console.log(`Bid placed by ${bidderId} in auction ${auctionId} with a total bid amount of ${totalBidAmount}.`);
                    } else {
                        // Additional logic if needed when the raise option ID is not valid
                        console.log(`Invalid raise option ID: ${raiseOptionId}`);
                    }
                } else {
                    // Additional logic if needed when the auction has ended
                    console.log(`Auction ${auctionId} has ended. Bids cannot be placed.`);
                }
            } catch (error: any) {
                console.error('Error placing bid:', error.message);
            }
        });


        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};

export default auctionSockets;
