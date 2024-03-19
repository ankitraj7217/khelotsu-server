import dotenv from "dotenv";
import connectDB from "./db/db.connection.js";
import {httpServer} from "./app.js";

dotenv.config({
    path: "./env"
})

connectDB().then(() => {
    httpServer.listen(process.env.PORT || 8000, () => {
        console.log(`Server running at port: ${process.env.PORT}`);
    })
    
})
.catch((err) => {
    console.log("Connection to db failed. Error: ", err);
})