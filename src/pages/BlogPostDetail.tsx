import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/src/lib/supabase';
import { BlogPost, Comment } from '@/src/types';
import { useAuth } from '@/src/contexts/AuthContext';
import { Button, buttonVariants } from '@/src/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { Textarea } from '@/src/components/ui/textarea';
import { Badge } from '@/src/components/ui/badge';
import { Calendar, User as UserIcon, MessageSquare, Share2, ArrowLeft, Flag, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

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

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="font-serif italic text-2xl animate-pulse">Unrolling the scroll...</p>
    </div>
  );

  if (!post) return (
    <div className="text-center py-48 space-y-8">
      <h2 className="text-6xl font-serif font-bold italic">Story Lost in Time</h2>
      <Link to="/blog" className={buttonVariants({ variant: "outline", className: "rounded-full px-12 h-14 text-lg font-serif italic" })}>
        Return to Archive
      </Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-12"
      >
        <Link to="/blog" className="group inline-flex items-center text-muted-foreground hover:text-primary transition-colors font-serif italic text-xl">
          <ArrowLeft className="mr-3 h-5 w-5 group-hover:-translate-x-2 transition-transform" /> Back to Archive
        </Link>
      </motion.div>

      <article className="space-y-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8 text-center"
        >
          <div className="inline-flex items-center space-x-4 text-primary">
            <Sparkles className="h-5 w-5" />
            <span className="font-serif italic text-lg font-bold uppercase tracking-widest">{post.category}</span>
          </div>
          <h1 className="text-7xl md:text-8xl font-serif font-bold tracking-tight leading-[0.85] max-w-4xl mx-auto">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center gap-10 py-10 border-y border-border">
            <div className="flex items-center space-x-4">
              <Avatar className="h-14 w-14 border-2 border-primary/20">
                <AvatarImage src={post.author?.avatar_url} />
                <AvatarFallback className="bg-muted text-primary font-serif">{post.author?.full_name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-xl font-serif font-bold">{post.author?.full_name}</p>
                <p className="text-sm font-serif italic text-muted-foreground uppercase tracking-widest">Scribe</p>
              </div>
            </div>
            <div className="flex items-center text-lg font-serif italic text-muted-foreground">
              <Calendar className="mr-3 h-5 w-5 text-primary" />
              {new Date(post.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
            </div>
            <div className="flex items-center text-lg font-serif italic text-muted-foreground">
              <MessageSquare className="mr-3 h-5 w-5 text-primary" />
              {comments.length} Reflections
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon" className="rounded-full h-12 w-12 border-border hover:border-primary hover:text-primary transition-all">
                <Share2 className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full h-12 w-12 border-border hover:text-destructive transition-all" onClick={handleReport}>
                <Flag className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative aspect-[21/9] rounded-[4rem] overflow-hidden shadow-2xl"
        >
          <img 
            src={post.thumbnail_url || `https://picsum.photos/seed/${post.id}/1600/900`} 
            alt={post.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="max-w-3xl mx-auto"
        >
          <div className="prose prose-stone dark:prose-invert prose-2xl max-w-none font-serif italic leading-relaxed prose-headings:font-bold prose-headings:not-italic prose-headings:tracking-tight prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:p-8 prose-blockquote:rounded-3xl">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </motion.div>

        {post.attachments && post.attachments.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto bg-card p-12 rounded-[3rem] border border-border shadow-xl space-y-8"
          >
            <h3 className="font-serif font-bold text-3xl italic flex items-center">
              <Sparkles className="mr-4 h-6 w-6 text-primary" /> Supplementary Scrolls
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {post.attachments.map((url, i) => (
                <a 
                  key={i} 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between bg-muted/50 p-6 rounded-2xl border border-border hover:border-primary hover:bg-primary/5 transition-all group"
                >
                  <span className="font-serif italic text-lg truncate">Document {i + 1}</span>
                  <ArrowLeft className="h-5 w-5 text-primary rotate-180 group-hover:translate-x-2 transition-transform" />
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </article>

      {/* Comments Section */}
      <section className="mt-40 max-w-3xl mx-auto space-y-16">
        <div className="flex items-center space-x-6">
          <div className="h-px flex-grow bg-border" />
          <h2 className="text-5xl font-serif font-bold italic whitespace-nowrap">Reflections ({comments.length})</h2>
          <div className="h-px flex-grow bg-border" />
        </div>

        {user ? (
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            onSubmit={handleCommentSubmit} 
            className="space-y-6 bg-card p-12 rounded-[3rem] border border-border shadow-xl"
          >
            <div className="flex items-start space-x-6">
              <Avatar className="h-14 w-14 border-2 border-primary/20">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="bg-muted text-primary font-serif">{profile?.full_name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-grow space-y-6">
                <Textarea 
                  placeholder="Inscribe your thoughts..." 
                  className="min-h-[180px] rounded-[2rem] bg-muted/50 border-border font-serif italic text-xl p-8 focus:ring-primary focus:border-primary"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                />
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-white rounded-full h-16 px-12 text-xl font-serif italic shadow-xl shadow-primary/20 group" disabled={submitting}>
                  {submitting ? 'Inscribing...' : (
                    <>
                      Post Reflection <MessageSquare className="ml-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.form>
        ) : (
          <div className="bg-card p-16 rounded-[4rem] text-center border border-border shadow-xl space-y-8">
            <p className="text-2xl font-serif italic text-muted-foreground">Join the conversation to share your reflections.</p>
            <Link to="/auth" className={buttonVariants({ className: "bg-primary hover:bg-primary/90 text-white rounded-full h-16 px-12 text-xl font-serif italic shadow-xl shadow-primary/20" })}>
              Login to Comment
            </Link>
          </div>
        )}

        <div className="space-y-12">
          <AnimatePresence mode="popLayout">
            {comments.length > 0 ? (
              comments.map((comment, idx) => (
                <motion.div 
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex space-x-6 group"
                >
                  <Avatar className="h-14 w-14 border-2 border-primary/20 shrink-0">
                    <AvatarImage src={comment.user?.avatar_url} />
                    <AvatarFallback className="bg-muted text-primary font-serif">{comment.user?.full_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow space-y-4">
                    <div className="bg-card p-10 rounded-[3rem] rounded-tl-none border border-border shadow-lg group-hover:shadow-xl transition-all">
                      <div className="flex items-center justify-between mb-6">
                        <span className="font-serif font-bold text-xl">{comment.user?.full_name}</span>
                        <span className="text-sm font-serif italic text-muted-foreground">{new Date(comment.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xl font-serif italic text-muted-foreground leading-relaxed">{comment.content}</p>
                    </div>
                    <div className="flex items-center space-x-8 ml-6">
                      <button className="text-sm font-serif font-bold italic text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">Reply</button>
                      <button className="text-sm font-serif font-bold italic text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">Like</button>
                      <button className="text-sm font-serif font-bold italic text-muted-foreground hover:text-destructive transition-colors uppercase tracking-widest" onClick={handleReport}>Report</button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24 space-y-6"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
                  <MessageSquare className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-2xl font-serif italic text-muted-foreground">No reflections yet. Be the first to inscribe your thoughts.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
