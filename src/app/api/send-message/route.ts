import dbConnect from "@/lib/dbConnector";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();
  const { username, content } = await request.json();
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    //Is user accepting the message
    if (!user.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting the messages",
        },
        { status: 403 }
      );
    }
    const newMessage = {
      content: content,
      createdAt: new Date(),
    };
    user.messages.push(newMessage as Message);
    await user.save();
    return Response.json(
      {
        success: true,
        message: "Message send successfully",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error sending message", err);
    return Response.json(
      {
        success: false,
        message: "Error sending message",
      },
      { status: 500 }
    );
  }
}
