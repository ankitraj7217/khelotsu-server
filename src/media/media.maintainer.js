class MediaMaintainer {
    constructor() {
        if (MediaMaintainer.singletonInstance) return MediaMaintainer.singletonInstance;

        this.mediaMap = new Map();
        MediaMaintainer.singletonInstance = this;
    }

    getAllAvailableOffers(roomName) {
        const offers = this.mediaMap.get(roomName);

        if (!offers) throw new Error("Please send correct room name.");

        return offers;
    }

    addNewOffer(roomName, offer) {
        const offers = this.mediaMap.get(roomName);
        offers.push(offer);
        this.mediaMap.set(roomName, offers);
    }
}

const mediaMaintainer = new MediaMaintainer();

export { mediaMaintainer };