import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Tag } from 'lucide-react';

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

interface ReadMoreModalProps {
  post: BlogPost;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReadMoreModal({ post, isOpen, onClose }: ReadMoreModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-[#0A0118] border-indigo-500/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {post.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center gap-2 mt-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.author.image} alt={post.author.name} />
            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-indigo-300">{post.author.name}</p>
            <p className="text-xs text-slate-400">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>

        {post.coverImage && (
          <div className="mt-4 relative w-full h-48 overflow-hidden rounded-lg">
            <img
              src={post.coverImage}
              alt={post.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        <div className="mt-4 text-slate-300 whitespace-pre-wrap">{post.content}</div>

        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="bg-indigo-500/10 text-indigo-300 border-indigo-500/30"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
