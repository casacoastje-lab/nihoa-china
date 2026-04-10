import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/src/lib/supabase';
import { BlogPost, Comment } from '@/src/types';
import { useAuth } from '@/src/contexts/AuthContext';
import { Button, buttonVariants } from '@/src/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { Textarea } from '@/src/components/ui/textarea';
import { Badge } from '@/src/components/ui/badge';
import { Calendar, User as UserIcon, MessageSquare, Share2, ArrowLeft, Flag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

export default function BlogPostDetail() {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      setLoading(true);
      try {
        // Fetch Post
        const { data: postData, error: postError } = await supabase
          .from('blog_posts')
          .select('*, author:profiles(*)')
          .eq('id', id)
          .single();

        if (postError) throw postError;
        setPost(postData);

        // Fetch Comments
        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select('*, user:profiles(*)')
          .eq('post_id', id)
          .order('created_at', { ascending: true });

        if (commentsError) throw commentsError;
        setComments(commentsData || []);
      } catch (err: any) {
        console.error('Fetch error:', err);
        toast.error(err.message || 'Failed to load story');
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to comment');
      return;
    }
    if (!newComment.trim()) return;

    setSubmitting(true);
    const { data, error } = await supabase
      .from('comments')
      .insert([
        {
          post_id: id,
          user_id: user.id,
          content: newComment.trim()
        }
      ])
      .select('*, user:profiles(*)')
      .single();

    if (error) {
      toast.error(error.message);
    } else {
      setComments([...comments, data]);
      setNewComment('');
      toast.success('Comment posted!');
    }
    setSubmitting(false);
  };

  const handleReport = () => {
    toast.info('Report submitted to admin.');
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading story...</div>;
  if (!post) return <div className="text-center py-24">Post not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/blog" className="inline-flex items-center text-stone-500 hover:text-stone-900 mb-8 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Stories
      </Link>

      <article className="space-y-8">
        <div className="space-y-6">
          <Badge className="bg-red-100 text-red-600 hover:bg-red-100 border-none uppercase text-xs tracking-widest font-bold px-4 py-1">
            {post.category}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 py-6 border-y border-stone-100">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.author?.avatar_url} />
                <AvatarFallback>{post.author?.full_name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-bold">{post.author?.full_name}</p>
                <p className="text-xs text-stone-500">Author</p>
              </div>
            </div>
            <div className="flex items-center text-sm text-stone-500">
              <Calendar className="mr-2 h-4 w-4" />
              {new Date(post.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
            </div>
            <div className="flex items-center text-sm text-stone-500">
              <MessageSquare className="mr-2 h-4 w-4" />
              {comments.length} Comments
            </div>
            <div className="ml-auto flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full text-stone-400 hover:text-red-600" onClick={handleReport}>
                <Flag className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl">
          <img 
            src={post.thumbnail_url || `https://picsum.photos/seed/${post.id}/1200/800`} 
            alt={post.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="prose prose-stone prose-lg max-w-none prose-headings:tracking-tighter prose-headings:font-bold prose-p:leading-relaxed prose-a:text-red-600">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        {post.attachments && post.attachments.length > 0 && (
          <div className="bg-stone-100 p-8 rounded-[2rem] space-y-4">
            <h3 className="font-bold text-lg">Attachments</h3>
            <div className="flex flex-wrap gap-4">
              {post.attachments.map((url, i) => (
                <a 
                  key={i} 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white px-4 py-2 rounded-full text-sm font-medium border border-stone-200 hover:border-red-600 transition-colors"
                >
                  Document {i + 1}
                </a>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Comments Section */}
      <section className="mt-24 space-y-12">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Comments ({comments.length})</h2>
        </div>

        {user ? (
          <form onSubmit={handleCommentSubmit} className="space-y-4 bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm">
            <div className="flex items-start space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback>{profile?.full_name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-grow space-y-4">
                <Textarea 
                  placeholder="Share your thoughts..." 
                  className="min-h-[120px] rounded-2xl border-stone-200 focus:ring-red-600"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                />
                <Button type="submit" className="bg-red-600 hover:bg-red-700 rounded-full px-8" disabled={submitting}>
                  {submitting ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <div className="bg-stone-100 p-8 rounded-[2rem] text-center">
            <p className="text-stone-600 mb-4">Please login to join the conversation.</p>
            <Link to="/auth" className={buttonVariants({ className: "bg-red-600 hover:bg-red-700 rounded-full" })}>
              Login to Comment
            </Link>
          </div>
        )}

        <div className="space-y-8">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={comment.user?.avatar_url} />
                  <AvatarFallback>{comment.user?.full_name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <div className="bg-stone-50 p-6 rounded-3xl rounded-tl-none border border-stone-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm">{comment.user?.full_name}</span>
                      <span className="text-xs text-stone-400">{new Date(comment.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-stone-700 leading-relaxed">{comment.content}</p>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 ml-2">
                    <button className="text-xs font-bold text-stone-400 hover:text-red-600">Reply</button>
                    <button className="text-xs font-bold text-stone-400 hover:text-red-600">Like</button>
                    <button className="text-xs font-bold text-stone-400 hover:text-red-600" onClick={handleReport}>Report</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-stone-500 text-center py-12 italic">No comments yet. Be the first to share your thoughts!</p>
          )}
        </div>
      </section>
    </div>
  );
}
