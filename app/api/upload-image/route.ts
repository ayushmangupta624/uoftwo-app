import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Ethnicity, Gender } from "@/types/profile";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const index = formData.get("index") as string;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // Create unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}-${index}.${fileExt}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("user-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("user-images").getPublicUrl(fileName);

    // Get current user's images
    const currentUser = await prisma.user.findUnique({
      where: { userId: user.id },
    });

    const currentImages = ((currentUser as any)?.images as string[]) || [];
    const imageIndex = parseInt(index);

    // Update the specific image at the index
    const updatedImages = [...currentImages];
    if (updatedImages.length < 4) {
      // Initialize array with empty strings if needed
      while (updatedImages.length < 4) {
        updatedImages.push("");
      }
    }
    updatedImages[imageIndex] = publicUrl;

    // Update user record with new image URL

    
    await prisma.user.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id, 
        images: updatedImages as any, 
        gender: "other" as Gender,
        fname: "",
        lname: "",
        ethnicity: "OTHER" as Ethnicity,
      }, 
      update: {
        images: updatedImages as any,
      },
    });

    return NextResponse.json({
      success: true,
      url: publicUrl,
      index: imageIndex,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const index = searchParams.get("index");

    if (!index) {
      return NextResponse.json(
        { error: "Index is required" },
        { status: 400 }
      );
    }

    const imageIndex = parseInt(index);

    // Get current user's images
    const currentUser = await prisma.user.findUnique({
      where: { userId: user.id },
    });

    const currentImages = ((currentUser as any)?.images as string[]) || [];
    const updatedImages = [...currentImages];

    // Remove the image at the index
    if (imageIndex >= 0 && imageIndex < updatedImages.length) {
      // Delete from storage if exists
      const imageUrl = updatedImages[imageIndex];
      if (imageUrl) {
        const fileName = imageUrl.split("/user-images/")[1];
        if (fileName) {
          await supabase.storage.from("user-images").remove([fileName]);
        }
      }
      updatedImages[imageIndex] = "";
    }

    // Update user record
    await prisma.user.upsert({
      where: { userId: user.id },
      update: {
        images: updatedImages as any,
      }, 
      create: {
        userId: user.id,
        images: updatedImages as any,
        gender: "other" as Gender,
        fname: "",
        lname: "",
        ethnicity: "OTHER" as Ethnicity,
      },
    });

    return NextResponse.json({
      success: true,
      index: imageIndex,
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

