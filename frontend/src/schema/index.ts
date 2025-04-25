import * as z from 'zod';
const ACCEPTED_AUDIO_TYPES = ["audio/mpeg"];
const ACCEPTED_COVER_TYPES = ["image/jpeg", "image/png"];
const MAX_FILE_SIZE = 20000000;


export const RegisterSchema = z.object({
    title: z.string().min(1, {
        message: "Please enter the title"
    }),
    artist: z.string().min(1, {
        message: "Please enter the artist"
    }),
    // file: z.instanceof(File, {
    //     message: "Please upload a file"
    // }) 
    // file: z
    // .any()
    // .refine((files) => files?.length == 1, "Audio is required.")
    // .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 20MB.`)
    // .refine(
    //   (files) => ACCEPTED_AUDIO_TYPES.includes(files?.[0]?.type),
    //   "only .mp3 files are accepted"
    // ),
    file: z.instanceof(File).refine(
        (file) => file.size <= MAX_FILE_SIZE, 
        `Max file size is 20MB.`
      ).refine(
        (file) => ACCEPTED_AUDIO_TYPES.includes(file.type), 
        "Only .mp3 files are accepted."
      ),

      cover: z.instanceof(File).refine(
        (cover) => cover.size <= MAX_FILE_SIZE, 
        `Max file size is 20MB.`
      ).refine(
        (cover) => ACCEPTED_COVER_TYPES.includes(cover.type), 
        "Only .jpg and .png files are accepted."
      )
});