// express/src/server.js
import app from "./app.js";
import connectDB from "./config/dbConnect.js";

const port = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Connect to the database
        await connectDB();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error("Failed to connect to DB:", error);
        process.exit(1);
    }
};

startServer();
