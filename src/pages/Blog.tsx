import { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import { BlogPost } from '@/src/types';
import { Card, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Input } from '@/src/components/ui/input';
import { Search, Filter, Calendar, User as UserIcon } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-5xl font-bold tracking-tighter mb-2">COMMUNITY <span className="text-red-600">STORIES</span></h1>
          <p className="text-stone-500">Insights, guides, and personal experiences from across China.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 h-4 w-4" />
            <Input 
              placeholder="Search stories..." 
              className="pl-10 rounded-full bg-white border-stone-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={categoryFilter === cat.toLowerCase() ? "default" : "outline"}
                size="sm"
                className={`rounded-full whitespace-nowrap ${categoryFilter === cat.toLowerCase() ? 'bg-red-600 hover:bg-red-700' : ''}`}
                onClick={() => setSearchParams({ category: cat.toLowerCase() })}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-96 bg-stone-100 animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-24 bg-red-50 rounded-[3rem] border border-red-100">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
            <Filter className="h-8 w-8" />
          </div>
          <h3 className="text-2xl font-bold text-red-900 mb-2">Connection Error</h3>
          <p className="text-red-700 max-w-md mx-auto mb-8">
            {error.includes('Failed to fetch') 
              ? 'Could not connect to Supabase. Please check your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the Secrets panel.' 
              : error}
          </p>
          <Button onClick={() => window.location.reload()} variant="outline" className="border-red-200 text-red-700 hover:bg-red-100">
            Try Again
          </Button>
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link to={`/blog/${post.id}`}>
                <Card className="group h-full overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-[2rem]">
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={post.thumbnail_url || `https://picsum.photos/seed/${post.id}/800/500`} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <Badge className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-stone-900 hover:bg-white border-none uppercase text-[10px] tracking-widest font-bold">
                      {post.category}
                    </Badge>
                  </div>
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-4 mb-4 text-xs text-stone-400 font-medium uppercase tracking-wider">
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {new Date(post.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <UserIcon className="mr-1 h-3 w-3" />
                        {post.author?.full_name || 'Anonymous'}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 group-hover:text-red-600 transition-colors line-clamp-2 leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-stone-500 line-clamp-3 text-sm leading-relaxed mb-6">
                      {post.content.replace(/[#*`]/g, '').substring(0, 150)}...
                    </p>
                    <div className="flex items-center text-stone-900 font-bold text-sm group-hover:translate-x-2 transition-transform">
                      Read Story <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-[3rem] border border-stone-100">
          <Filter className="mx-auto h-16 w-16 text-stone-200 mb-6" />
          <h3 className="text-2xl font-bold mb-2">No stories found</h3>
          <p className="text-stone-500">Try adjusting your search or category filter.</p>
        </div>
      )}
    </div>
  );
}

function ArrowRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
