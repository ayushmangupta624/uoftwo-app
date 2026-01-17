# Image Upload Setup

This project requires users to upload 4 images after completing their profile.

## Supabase Storage Setup

You need to create a storage bucket in Supabase for user images:

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the sidebar
3. Click **New bucket**
4. Name it: `user-images`
5. Set it to **Public** (or configure RLS policies if you prefer private)
6. Click **Create bucket**

## Storage Policies (if using RLS)

If you want to use Row Level Security for the bucket, create these policies:

### Policy 1: Allow authenticated users to upload their own images
```sql
CREATE POLICY "Users can upload their own images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### Policy 2: Allow authenticated users to read all images
```sql
CREATE POLICY "Users can read all images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'user-images');
```

### Policy 3: Allow users to delete their own images
```sql
CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'user-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## Database Schema

The `users` table includes an `images` field that stores an array of image URLs (strings).

## User Flow

1. User completes profile form → redirected to `/upload-images`
2. User must upload exactly 4 images
3. After all 4 images are uploaded, user can continue to dashboard
4. Dashboard redirects to `/upload-images` if images are incomplete

## Image Requirements

- Formats: JPEG, PNG, WebP
- Maximum size: 5MB per image
- Total required: 4 images

## API Endpoints

- `POST /api/upload-image` - Upload an image at a specific index (0-3)
- `DELETE /api/upload-image?index=X` - Remove an image at a specific index

