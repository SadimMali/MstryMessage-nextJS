import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  //Check if we have a connection to the database or it's currently connecting
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }

  try {
    //Attempt to connect to the database
    const db = await mongoose.connect(process.env.MONGODB_URL || "", {});
    connection.isConnected = db.connections[0].readyState;
    console.log("Database connected succesfully");
  } catch (err) {
    console.log("Database connection failed", err);
    //Gracefully exit in case of a connection error
    process.exit(1); 
  }
}

export default dbConnect;
