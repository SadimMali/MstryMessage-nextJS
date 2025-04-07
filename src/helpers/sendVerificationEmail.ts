// import { resend } from "@/lib/resend";
// import VerificationEmail from "../../emails/VerificationEmail";
// import { ApiResponse } from "@/types/ApiResponse";

// export async function sendVerificationEmail(
//   email: string,
//   username: string,
//   verifyCode: string
// ): Promise<ApiResponse> {
//   try {
//     const {data, error} = await resend.emails.send({
//       from: "dev@sadim.com.np",
//       to: email,
//       subject: "Mystry message | Verification code",
//       react: VerificationEmail({ username, otp: verifyCode }),
//     });
//     if(error) {
//       return {success: false, message: error.message }
//     }
//     return { success: true, message: "Emali send successfully" };
//   } catch (emailError) {
//     console.error("Error sending verification email", emailError);
//     return { success: false, message: "Failed to send verification emali" };
//   }
// }


import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import nodemailer from "nodemailer";
import { render } from "@react-email/components";


const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const emailHtml = render(VerificationEmail({ username, otp: verifyCode }));

    const response = await transporter.sendMail({
      from: "dev@sadim.com.np",
      to: email,
      subject: "Mystry message | Verification code",
      html: emailHtml,

    })
    if (response.rejected) {

      return { success: false, message: response.response }
    }

    return { success: true, message: "Emali send successfully" };
  } catch (emailError) {
    console.error("Error sending verification email", emailError);
    return { success: false, message: "Failed to send verification emali" };
  }
}


