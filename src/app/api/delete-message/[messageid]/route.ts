import dbConnect from "@/lib/dbConnector";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

type Params = {
  params: { messageid: string };
};

export async function DELETE(request: Request, { params }: Params) {
  await dbConnect();
  const messageId = params.messageid;
  const session = await getServerSession(authOptions);
  const _user = session?.user;

  if (!session?.user || !_user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }

  try {
    const updatedResult = await UserModel.updateOne(
      { _id: _user._id },
      {
        $pull: { messages: { _id: messageId } },
      }
    );

    if (updatedResult.modifiedCount === 0) {
      return Response.json(
        {
          success: false,
          message: "Message not found or already deleted",
        },
        { status: 404 }
      );
    }

    Response.json(
      {
        success: true,
        message: "message deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting message:", error);
    return Response.json(
      { message: "Error deleting message", success: false },
      { status: 500 }
    );
  }
}
