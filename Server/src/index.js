// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app} from './app.js'
import { initializeSocket } from './services/socket.service.js';
const http = require('http');

dotenv.config({
    path: './.env'
})

const startServer = async () => {
    try {
        await connectDB();
        console.log('MongoDB connected successfully');

        const server = http.createServer(app);
        
        // Initialize Socket.IO
        initializeSocket(server);

        const port = process.env.PORT || 8000;
        server.listen(port, () => {
            console.log(`Server is running at port: ${port}`);
        });

    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};

startServer();










/*
import express from "express"
const app = express()
( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("errror", (error) => {
            console.log("ERRR: ", error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        })

    } catch (error) {
        console.error("ERROR: ", error)
        throw err
    }
})()

*/