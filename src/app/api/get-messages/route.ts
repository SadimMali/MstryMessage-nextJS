import dbConnect from "@/lib/dbConnector";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        mnessage: "Not authenticated",
      },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id); //convert userId to mongoose user id
  try {
    // aggregation pipeline
    const user = await UserModel.aggregate([
      { $match: { id: userId } },
      { $unwind: "$messages" }, //unwind to open up array of messages
      { $sort: { "messages.createdAt": -1 } }, //sort messages by createdAt
      { $group: { _id: "$_id", nessages: { $push: "$messages" } } },
    ]);
    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        message: user[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting messages", error)
    return Response.json(
      {
        success: false,
        message: "Error getting messages",
      },
      { status: 500 }
    );
  }
}
