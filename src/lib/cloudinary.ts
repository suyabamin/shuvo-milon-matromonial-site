/**
 * Helper to upload image to Cloudinary using signed upload parameters.
 * Validates maximum size (5MB) and acceptable image mime types.
 */
export async function uploadToCloudinary(
  file: File,
  signedParams?: { signature: string; timestamp: number; apiKey: string }
): Promise<string> {
  const MAX_SIZE_MB = 5;
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    throw new Error("ছবির সর্বোচ্চ সাইজ ৫ মেগাবাইট হতে হবে");
  }

  const validTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!validTypes.includes(file.type)) {
    throw new Error("শুধুমাত্র JPG, PNG বা WEBP ছবি গ্রহণযোগ্য");
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "shuvo-milon";
  const formData = new FormData();
  formData.append("file", file);

  if (signedParams) {
    formData.append("api_key", signedParams.apiKey);
    formData.append("timestamp", String(signedParams.timestamp));
    formData.append("signature", signedParams.signature);
  } else {
    // Unsigned fallback or upload preset for client testing
    formData.append("upload_preset", "shuvo_milon_profiles");
  }

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("ছবি আপলোড ব্যর্থ হয়েছে, অনুগ্রহ করে আবার চেষ্টা করুন");
  }

  const data = await response.json();
  return data.secure_url as string;
}
