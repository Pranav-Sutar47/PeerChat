import axios from "axios";

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "peerchat_upload");
  formData.append("folder", "peerchat");
  try {
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dailaa9bp/image/upload",
      formData
    );
    return response.data.secure_url;
  } catch (error) {
    console.error("Upload failed", error);
    return null;
  }
};

export default uploadToCloudinary;
