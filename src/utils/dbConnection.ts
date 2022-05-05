import mongoose from "mongoose";


import config from "config";

import log from "./logger"

async function connectToDb() {
    const dbUri = config.get<string>("dbUri");
    try {
        await mongoose.connect(dbUri)
        log.info("Connected to MongoDB")
    } catch (e) {
        //exit with failure
        process.exit(1)
    }
}

export default connectToDb