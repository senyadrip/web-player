import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RegisterSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { z } from "zod";
import { ResetIcon } from "@radix-ui/react-icons";
import NodeID3 from "node-id3";

const Admin = () => {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      title: "",
      artist: "",
      file: "",
      cover: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    // console.log(data);
    setSubmitted(true);
    form.reset();

    const formData = new FormData();
    let filePath;
    let coverPath;

    formData.append("title", data.title);
    formData.append("artist", data.artist);
    formData.append("file", data.file);
    // formData.append("APIC", data.cover);

    let jsonData: { [key: string]: string } = {};
    formData.forEach((value, key) => {
      jsonData[key] = value as string;
    });

    try {
      const response = await fetch("http://localhost:5100/api/music", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const responseData = await response.json();
        filePath = responseData.filePath;
        console.log("Form submitted successfully!");
        console.log(filePath);
      } else {
        console.error("Form submission failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }

    try {
      const response = await fetch(
        `http://localhost:5100/api/music/metadata/${encodeURIComponent(
          filePath
        )}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonData),
        }
      );
      if (response.ok) {
        console.log("Meta Data Updated!");
      } else {
        console.log("Meta Data Failed!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[400px]">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>Upload Music</CardTitle>
            <Link to="/">
              <svg
                className="w-[20px]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
              >
                <path d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" />
              </svg>
            </Link>
          </div>
          <CardDescription>MP3's Only</CardDescription>
        </CardHeader>
        <CardContent>
          {!submitted ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="artist"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Artist</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Song</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            onChange={(e) =>
                              field.onChange(e.target.files?.[0])
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cover"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cover</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            onChange={(e) =>
                              field.onChange(e.target.files?.[0])
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" variant="outline">
                    Upload
                  </Button>
                  {/* <Button type='submit' variant='outline'>Update</Button> */}
                </div>
              </form>
            </Form>
          ) : (
            <div className="text-center">
              <p>Thanks for submitting your music!</p>
              <Button onClick={() => setSubmitted(false)} variant="outline">
                Submit Another
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center"></CardFooter>
      </Card>
    </div>
  );
};

export default Admin;