'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ThumbsUp, Eye, Tag, Send, RefreshCw, Plus, Clock, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import CreatePostModal from '@/components/blog/CreatePostModal';
import ReadMoreModal from '@/components/blog/ReadMoreModal';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import cn from 'classnames';
import { formatDistanceToNow } from 'date-fns';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  likes: number;
  views: number;
  tags: string[];
  coverImage?: string;
  createdAt: Date;
  author: {
    name: string;
    image: string;
  };
}

interface ChatMessage {
  id: string;
  content: string;
  authorHash: string;
  createdAt: Date;
  likes: number;
  replyTo?: string;
}

const generateAuthorHash = () => {
  if (typeof window !== 'undefined') {
    let hash = sessionStorage.getItem('authorHash');
    if (!hash) {
      hash = Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('authorHash', hash);
    }
    return hash;
  }
  return Math.random().toString(36).substring(2, 15);
};

export default function BlogPage() {
  const { data: session } = useSession();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [authorHash] = useState(generateAuthorHash);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    fetchPosts();
    fetchChatMessages();
    checkUserRole();
    const interval = setInterval(fetchChatMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkUserRole = async () => {
    if (session?.user) {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        setIsSuperAdmin(data.role === 'SUPERADMIN');
      } catch (error) {
        console.error('Error checking user role:', error);
      }
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!isSuperAdmin) return;

    try {
      const response = await fetch(`/api/blog/posts/${postId}/delete`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      toast.success('Post deleted successfully');
      fetchPosts(); // Refresh the posts list
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog/posts');
      const data = await response.json();
      setPosts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load blog posts');
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!session?.user) {
      toast.error('Please sign in to like posts');
      return;
    }

    try {
      const response = await fetch(`/api/blog/posts/${postId}/like`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to like post');
      }

      const { liked } = await response.json();

      // Update the liked posts set
      const newLikedPosts = new Set(likedPosts);
      if (liked) {
        newLikedPosts.add(postId);
      } else {
        newLikedPosts.delete(postId);
      }
      setLikedPosts(newLikedPosts);

      // Update the post likes count in the UI
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: liked ? post.likes + 1 : post.likes - 1,
          };
        }
        return post;
      }));

      toast.success(liked ? 'Post liked!' : 'Post unliked');
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Failed to like post');
    }
  };

  const fetchChatMessages = async () => {
    try {
      const response = await fetch('/api/blog/chat');
      const data = await response.json();
      setChatMessages(data);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch('/api/blog/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newMessage,
          authorHash,
          roomId: 'blog-discussion',
        }),
      });

      if (response.ok) {
        setNewMessage('');
        fetchChatMessages();
        toast.success('Message sent!');
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage();
  };

  const likeMessage = async (messageId: string) => {
    try {
      await fetch(`/api/blog/chat/${messageId}/like`, { method: 'POST' });
      fetchChatMessages();
    } catch (error) {
      console.error('Error liking message:', error);
      toast.error('Failed to like message');
    }
  };

  return (
    <div className="min-h-screen bg-[#1a237e] pb-8">
      <div className="relative">
        {/* Content */}
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6 inline-block rounded-full bg-indigo-900/50 px-4 py-1.5 backdrop-blur-md"
                  >
                    <span className="flex items-center text-sm font-medium text-white">
                      <MessageCircle className="mr-2 h-4 w-4 text-indigo-400" />
                      Blog & Discussions
                    </span>
                  </motion.div>
                  <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                    Community Blog
                  </h1>
                  <p className="text-xl text-indigo-200/70">
                    Latest updates and discussions
                  </p>
                </motion.div>
              </div>
              {session?.user && (
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Write Post
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <RefreshCw className="h-8 w-8 animate-spin text-indigo-400" />
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-12 bg-indigo-900/20 rounded-lg border border-indigo-500/20">
                    <p className="text-indigo-200/70">No posts yet. Be the first to write one!</p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <Card
                      key={post.id}
                      className="bg-indigo-900/20 border-indigo-500/20 hover:border-indigo-500/40 transition-colors backdrop-blur-sm"
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarImage src={post.author.image} alt={post.author.name} />
                              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg font-semibold text-indigo-100">
                                {post.title}
                              </CardTitle>
                              <CardDescription className="text-indigo-200/70">
                                {post.author.name} •{' '}
                                {formatDistanceToNow(new Date(post.createdAt), {
                                  addSuffix: true,
                                })}
                              </CardDescription>
                            </div>
                          </div>
                          {isSuperAdmin && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeletePost(post.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardHeader>

                      {post.coverImage && (
                        <div className="px-6">
                          <div className="relative w-full h-48 overflow-hidden rounded-lg">
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </div>
                      )}

                      <CardContent>
                        <p className="text-indigo-100/90 line-clamp-3">{post.content}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {post.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="bg-blue-500/10 text-blue-200 border-blue-500/30"
                            >
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>

                      <CardFooter className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLikePost(post.id)}
                            className={cn(
                              "flex items-center gap-1",
                              likedPosts.has(post.id)
                                ? "text-pink-400 hover:text-pink-500"
                                : "text-indigo-200/70 hover:text-indigo-100"
                            )}
                          >
                            <ThumbsUp
                              className={cn(
                                "h-4 w-4",
                                likedPosts.has(post.id) && "fill-current"
                              )}
                            />
                            {post.likes}
                          </Button>
                          <span className="flex items-center gap-1 text-indigo-200/70">
                            <Eye className="h-4 w-4" />
                            {post.views}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={() => setSelectedPost(post)}
                          className="text-indigo-200 hover:text-indigo-100 hover:bg-indigo-500/20"
                        >
                          Read More
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>

              <div className="lg:col-span-1">
                <Card className="bg-indigo-900/20 border-indigo-500/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                      Anonymous Chat
                    </CardTitle>
                    <CardDescription className="text-indigo-200/70">
                      Join the discussion anonymously
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4 max-h-[400px] overflow-y-auto">
                      {chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className="flex items-start gap-3 text-sm"
                        >
                          <div className="flex-shrink-0">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-indigo-500/20 text-indigo-200">
                                {message.authorHash.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-indigo-100">
                                Anonymous_{message.authorHash.slice(0, 6)}
                              </span>
                              <span className="text-xs text-indigo-200/70">
                                {formatDistanceToNow(new Date(message.createdAt), {
                                  addSuffix: true,
                                })}
                              </span>
                            </div>
                            <p className="text-indigo-100/90">{message.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <form
                      onSubmit={handleSubmit}
                      className="flex items-center gap-2 w-full"
                    >
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 bg-indigo-900/20 border-indigo-500/20 focus:border-indigo-500/40 text-indigo-100 placeholder:text-indigo-200/50"
                      />
                      <Button
                        type="submit"
                        size="icon"
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          fetchPosts();
        }}
      />

      {selectedPost && (
        <ReadMoreModal
          post={selectedPost}
          isOpen={!!selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
}
