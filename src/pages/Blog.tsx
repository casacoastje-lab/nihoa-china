import { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import { BlogPost } from '@/src/types';
import { Card, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Input } from '@/src/components/ui/input';
import { Search, Filter, Calendar, User as UserIcon, ArrowRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';

const categories = ['All', 'Food', 'Art', 'History', 'Landmark', 'Culture'];

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category') || 'all';
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        let query = supabase
          .from('blog_posts')
          .select('*, author:profiles(*)')
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (categoryFilter !== 'all') {
          query = query.eq('category', categoryFilter);
        }

        const { data, error: fetchError } = await query;
        if (fetchError) throw fetchError;
        setPosts(data || []);
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message || 'Failed to connect to the database.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [categoryFilter]);

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-12"
      >
        <div className="space-y-6 max-w-2xl">
          <div className="inline-flex items-center space-x-4 text-primary">
            <div className="h-px w-12 bg-primary" />
            <span className="font-serif italic text-xl font-bold uppercase tracking-widest">The Chronicle 编年史</span>
          </div>
          <h1 className="text-7xl font-serif font-bold tracking-tight leading-[0.85]">
            COMMUNITY <br /> <span className="text-primary italic">STORIES</span>
          </h1>
          <p className="text-2xl font-serif text-muted-foreground leading-relaxed italic">
            Insights, guides, and personal experiences from the heart of the Middle Kingdom.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 w-full md:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input 
              placeholder="Search stories..." 
              className="pl-12 h-14 rounded-full bg-card border-border font-serif italic text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </motion.div>

      <div className="flex gap-3 overflow-x-auto pb-0 mb-16 no-scrollbar border-b border-border pl-[3px] pr-[3px]">
        {categories.map(cat => (
          <Button
            key={cat}
            variant={categoryFilter === cat.toLowerCase() ? "default" : "outline"}
            className={`rounded-full px-8 py-6 text-lg font-serif italic transition-all ${categoryFilter === cat.toLowerCase() ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'border-border bg-card text-foreground hover:border-primary hover:text-primary'}`}
            onClick={() => setSearchParams({ category: cat.toLowerCase() })}
          >
            {cat}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-[500px] bg-muted animate-pulse rounded-[3rem]" />
          ))}
        </div>
      ) : error ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24 bg-card rounded-[4rem] border border-border shadow-xl"
        >
          <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-primary">
            <Filter className="h-10 w-10" />
          </div>
          <h3 className="text-4xl font-serif font-bold italic mb-4">Connection Error</h3>
          <p className="text-xl font-serif italic text-muted-foreground max-w-md mx-auto mb-10">
            {error.includes('Failed to fetch') 
              ? 'Could not connect to the archive. Please check your configuration.' 
              : error}
          </p>
          <Button onClick={() => window.location.reload()} className="bg-primary hover:bg-primary/90 text-white rounded-full px-12 h-14 text-lg font-serif italic">
            Try Again 重新尝试
          </Button>
        </motion.div>
      ) : filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Link to={`/blog/${post.id}`}>
                <Card className="group h-full overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-700 rounded-[3rem] bg-card flex flex-col">
                  <div className="relative h-72 overflow-hidden">
                    <img 
                      src={post.thumbnail_url || `https://picsum.photos/seed/${post.id}/800/500`} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <Badge className="absolute top-6 left-6 bg-primary text-white border-none font-serif italic px-4 py-1">
                      {post.category}
                    </Badge>
                  </div>
                  <CardContent className="p-10 flex flex-col flex-grow">
                    <div className="flex items-center space-x-6 mb-6 text-sm font-serif italic text-muted-foreground uppercase tracking-widest">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-primary" />
                        {new Date(post.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <UserIcon className="mr-2 h-4 w-4 text-primary" />
                        {post.author?.full_name || 'Anonymous'}
                      </div>
                    </div>
                    <h3 className="text-3xl font-serif font-bold mb-6 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-lg font-serif italic text-muted-foreground line-clamp-3 leading-relaxed mb-8">
                      {post.content.replace(/[#*`]/g, '').substring(0, 150)}...
                    </p>
                    <div className="mt-auto flex items-center text-foreground font-serif font-bold italic text-lg group-hover:translate-x-3 transition-transform">
                      Read Story 阅读故事 <ArrowRight className="ml-3 h-5 w-5 text-primary" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-32 space-y-6"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted mb-4">
            <Filter className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-3xl font-serif font-bold italic">No stories found</h3>
          <p className="text-xl font-serif italic text-muted-foreground">Try adjusting your search or category filters.</p>
        </motion.div>
      )}
    </div>
  );
}
