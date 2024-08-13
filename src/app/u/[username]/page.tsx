"use client";

import { messageSchema } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";

const page = () => {
  const { username } = useParams();
  const {toast} = useToast();

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content')

  const onSubmit = async(data: z.infer<typeof messageSchema>) => {
    try {
        const response = await axios.post<ApiResponse>('/api/send-message', {username, content: data.content})
        if(response.data.success) {
          toast({
            title: "Send message",
            description: response.data.message
          })
          form.setValue("content", "")
        }
    } catch(error){
      console.error("error sending message", error);
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error sending message",
        description: axiosError.response?.data.message,
        variant: 'destructive'
      })

    }
  };
  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="font-bold  text-4xl mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={!messageContent}>
            Send it
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default page;
