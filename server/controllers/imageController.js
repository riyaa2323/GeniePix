import userModel from "../models/userModel.js";
import mongoose from "mongoose";
import FormData from "form-data";
import axios from "axios";

const generateImage = async (req, res) => {
  try {
    const { userId, prompt } = req.body;

    // 🟡 Debug Logs
    console.log("🟡 Received userId:", userId);
    console.log("🟡 Full request body:", req.body);

    // 🛑 Validate userId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.json({ success: false, message: "Invalid userId format." });
    }

    const user = await userModel.findById(userId);
    if (!user || !prompt) {
      return res.json({ success: false, message: "Missing details." });
    }

    // 🛑 Check credit balance
    if (user.creditBalance <= 0) {
      return res.json({
        success: false,
        message: "No credit balance",
        creditBalance: user.creditBalance,
      });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API,
        },
        responseType: "arraybuffer",
      }
    );

    const base64Image = Buffer.from(data, "binary").toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    // 🟢 Deduct 1 credit after successful image generation
    await userModel.findByIdAndUpdate(user._id, {
      creditBalance: user.creditBalance - 1,
    });

    res.json({
      success: true,
      message: "Image generated",
      creditBalance: user.creditBalance - 1,
      resultImage,
    });
  } catch (error) {
    console.log("❌ Error:", error);
    res.json({ success: false, message: error.message });
  }
};

export default generateImage;
