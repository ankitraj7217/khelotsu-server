const emitOfferToAvailableUsers = (io, roomName, msg) => {
    try {
        // offer contains userName, offerDetails, offerIceCandidates
        const offer = JSON.parse(msg);

        if (!offer || !offer.offererUserName || !offer.answererUserName || !offer.offerDetails) 
            throw new Error("Please send offer details correctly")

        io.in(roomName).emit("receive_rtc_new_offer", JSON.stringify({
            status: 200,
            data: offer
        }));
    } catch (err) {
        const response = {status: 400, error: err?.message};
        io.in(roomName).emit("receive_rtc_new_offer", JSON.stringify(response));
    }
}

const emitICEToAvailableUsers = (io, roomName, msg) => {
    try {
        // offer contains userName, offerDetails, offerIceCandidates
        const offer = JSON.parse(msg);

        if (!offer || !offer.offererUserName || !offer.answererUserName || !offer.iceCandidate) 
            throw new Error("Please send offer details correctly")

        io.in(roomName).emit("receive_rtc_new_ice", JSON.stringify({
            status: 200,
            data: offer
        }));
    } catch (err) {
        const response = {status: 400, error: err?.message};
        io.in(roomName).emit("receive_rtc_new_ice", JSON.stringify(response));
    }
}

const emitAnswer = (io, roomName, msg) => {
    try {
        // answer contains userName, answerDetails, offererUserName
        const answer = JSON.parse(msg);

        if (!answer || !answer.answererUserName || !answer.answerDetails || !answer.offererUserName)
            throw new Error("Please send all details in answer.");

        io.in(roomName).emit("receive_rtc_answer", JSON.stringify({
            status: 200,
            data: answer
        }));
    } catch (err) {
        const response = {status: 400, error: err?.message};
        io.in(roomName).emit("receive_rtc_answer", JSON.stringify(response));
    }
}

const emitIceCandidates = (io, roomName, msg) => {
    try {
        // answer contains userName, iceCandidateDetails, offererUserName
        const iceCandidates = JSON.parse(msg);

        if (!iceCandidates || !iceCandidates.userName || !iceCandidates.answerIceCandidates || !iceCandidates.offererUserName)
            throw new Error("Please send all details in ice candidates.");

        io.in(roomName).emit("receive_rtc_answer_ice", JSON.stringify({
            status: 200,
            data: iceCandidates
        }));
    } catch (err) {
        const response = {status: 400, error: err?.message};
        io.in(roomName).emit("receive_rtc_ice", JSON.stringify(response));
    }
}

export { emitOfferToAvailableUsers, emitICEToAvailableUsers, emitAnswer, emitIceCandidates };