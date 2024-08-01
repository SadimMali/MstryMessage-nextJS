import mongoose, { connections } from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URL || "", {});
    console.log("db", db)
    connection.isConnected = db.connections[0].readyState;
    console.log("connections", connections)
    console.log("Database connected succesfully");
  } catch (err) {
    console.log("Database connection failed", err);
    process.exit(1);
  }
}

export default dbConnect;
