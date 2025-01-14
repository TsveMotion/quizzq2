'use client';

import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { 
  Mail, 
  MessageSquare, 
  Phone, 
  MapPin,
  Loader2,
  School,
  User,
  Briefcase,
  Sparkles
} from "lucide-react";

const formSchema = z.object({
  schoolName: z.string().min(1, "School name is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schoolName: "",
      name: "",
      email: "",
      role: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Message Sent",
          description: "We'll get back to you as soon as possible.",
          duration: 5000,
        });
        form.reset();
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#1a237e]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#311b92] opacity-100" />
        
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="container relative mx-auto px-4 py-24"
          >
            <div className="relative z-10 mx-auto max-w-4xl text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-6 inline-block rounded-full bg-white/20 px-4 py-1.5 backdrop-blur-md shadow-lg"
              >
                <span className="flex items-center text-sm font-medium text-white">
                  <Sparkles className="mr-2 inline-block h-4 w-4 animate-pulse text-blue-200" />
                  We'd Love to Hear from You
                </span>
              </motion.div>

              <motion.h1 
                className="mb-6 font-bold text-white md:text-6xl text-4xl tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Get in Touch with{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 animate-glow bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
                    QUIZZQ
                  </span>
                  <span className="absolute -inset-x-4 -inset-y-2 z-0 bg-gradient-to-r from-blue-500/40 via-indigo-500/40 to-purple-500/40 blur-xl" />
                </span>
              </motion.h1>

              <motion.p 
                className="mb-8 text-xl text-white/90"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Have questions? We're here to help you transform your educational journey.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="relative z-10 py-20 bg-gradient-to-b from-[#1a237e] to-[#283593]">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Contact Information */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
                <CardContent className="p-6">
                  <div className="space-y-8">
                    <motion.div 
                      variants={itemVariants}
                      className="flex items-start gap-4"
                    >
                      <div className="rounded-lg bg-white/20 p-3">
                        <Mail className="h-6 w-6 text-blue-300" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Email</h3>
                        <p className="text-white/70">support@quizzq.edu</p>
                        <p className="text-white/70">info@quizzq.edu</p>
                      </div>
                    </motion.div>

                    <motion.div 
                      variants={itemVariants}
                      className="flex items-start gap-4"
                    >
                      <div className="rounded-lg bg-white/20 p-3">
                        <Phone className="h-6 w-6 text-purple-300" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Phone</h3>
                        <p className="text-white/70">+1 (555) 123-4567</p>
                        <p className="text-white/70">Mon-Fri 9am-6pm EST</p>
                      </div>
                    </motion.div>

                    <motion.div 
                      variants={itemVariants}
                      className="flex items-start gap-4"
                    >
                      <div className="rounded-lg bg-white/20 p-3">
                        <MapPin className="h-6 w-6 text-indigo-300" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Address</h3>
                        <p className="text-white/70">
                          123 Education Street<br />
                          Suite 456<br />
                          New York, NY 10001
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
                <CardContent className="p-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <motion.div variants={itemVariants}>
                        <FormField
                          control={form.control}
                          name="schoolName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">School Name</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <School className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                                  <Input 
                                    placeholder="Enter your school name" 
                                    className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                                    {...field} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Your Name</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                                  <Input 
                                    placeholder="Enter your name" 
                                    className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                                    {...field} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Email</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                                  <Input 
                                    placeholder="Enter your email" 
                                    className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                                    {...field} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <FormField
                          control={form.control}
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Role</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <div className="relative">
                                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                                    <SelectTrigger className="pl-9 bg-white/5 border-white/10 text-white">
                                      <SelectValue placeholder="Select your role" />
                                    </SelectTrigger>
                                  </div>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="teacher">Teacher</SelectItem>
                                  <SelectItem value="administrator">Administrator</SelectItem>
                                  <SelectItem value="student">Student</SelectItem>
                                  <SelectItem value="parent">Parent</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Message</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                                  <Textarea 
                                    placeholder="How can we help you?" 
                                    className="pl-9 min-h-[120px] bg-white/5 border-white/10 text-white placeholder:text-white/40"
                                    {...field} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <Button 
                          type="submit" 
                          className="w-full bg-white text-blue-600 hover:bg-white/90"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            'Send Message'
                          )}
                        </Button>
                      </motion.div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
