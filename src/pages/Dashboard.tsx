import { useState, useEffect } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import { supabase } from '@/src/lib/supabase';
import { Button, buttonVariants } from '@/src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { Badge } from '@/src/components/ui/badge';
import { ScrollArea } from '@/src/components/ui/scroll-area';
import { toast } from 'sonner';
import { UserProfile, BlogPost } from '@/src/types';
import { LayoutDashboard, BookOpen, Users, Settings, Plus, CheckCircle, XCircle, BarChart3, Clock, TrendingUp, Edit3, Award, Calendar, Quote } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  AreaChart,
  Area
} from 'recharts';

const generateLast7Days = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (6 - i));
    return {
      name: days[d.getDay()],
      date: d.toISOString().split('T')[0],
      views: 0,
      contributions: 0
    };
  });
};

const generateMonthlyGrowth = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  return months.slice(0, currentMonth + 1).map(month => ({ month, users: 0 }));
};

export default function Dashboard() {
  const { profile, isAdmin, isBlogger } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [myPosts, setMyPosts] = useState<BlogPost[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState({
    totalStories: 0,
    contributions: 0,
    totalPosts: 0,
    totalUsers: 0,
    myPostsCount: 0,
    myCommentsCount: 0
  });
  const [chartData, setChartData] = useState(generateLast7Days());
  const [userGrowth, setUserGrowth] = useState(generateMonthlyGrowth());
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Settings state
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('');
  const [bioZh, setBioZh] = useState('');

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setAvatarUrl(profile.avatar_url || '');
      setBio(profile.bio || '');
      setBioZh(profile.bio_zh || '');
    }
  }, [profile]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Global Stats for everyone
        const { count: globalPostCount, error: globalPostsError } = await supabase
          .from('blog_posts')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'published');
        
        if (!globalPostsError) {
          setStats(prev => ({ ...prev, totalStories: globalPostCount || 0 }));
        }

        // Fetch User Activity (Posts & Comments)
        const { data: posts, error: postsError, count: postsCount } = await supabase
          .from('blog_posts')
          .select('*', { count: 'exact' })
          .eq('author_id', profile?.id)
          .order('created_at', { ascending: false });
        
        if (!postsError) {
          setMyPosts(posts || []);
        }
        
        const { data: comments, count: commentsCount, error: commentsError } = await supabase
          .from('comments')
          .select('*, blog_posts(title)')
          .eq('user_id', profile?.id)
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (!commentsError) {
          setStats(prev => ({ 
            ...prev, 
            myPostsCount: postsCount || 0,
            myCommentsCount: commentsCount || 0,
            contributions: (postsCount || 0) + (commentsCount || 0)
          }));

          // Combine for Recent Activity
          const combined = [
            ...(posts || []).slice(0, 5).map(p => ({
              id: p.id,
              time: p.created_at,
              title: p.title,
              desc: p.content.substring(0, 100) + '...',
              type: 'Article 文章',
              color: 'bg-red-500'
            })),
            ...(comments || []).map(c => ({
              id: c.id,
              time: c.created_at,
              title: `Commented on: ${c.blog_posts?.title || 'a post'}`,
              desc: c.content,
              type: 'Comment 评论',
              color: 'bg-green-500'
            }))
          ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8);
          
          setRecentActivities(combined);
        }

        // Generate Real Chart Data for the last 7 days
        const last7Days = generateLast7Days();

        // Fetch posts created in the last 7 days
        const { data: recentPosts } = await supabase
          .from('blog_posts')
          .select('created_at')
          .eq('author_id', profile?.id)
          .gte('created_at', last7Days[0].date);

        // Fetch comments created in the last 7 days
        const { data: recentComments } = await supabase
          .from('comments')
          .select('created_at')
          .eq('user_id', profile?.id)
          .gte('created_at', last7Days[0].date);

        const updatedChartData = last7Days.map(day => {
          const dayPosts = recentPosts?.filter(p => p.created_at.startsWith(day.date)).length || 0;
          const dayComments = recentComments?.filter(c => c.created_at.startsWith(day.date)).length || 0;
          const totalDayContrib = dayPosts + dayComments;
          return {
            ...day,
            contributions: totalDayContrib,
            // Use real contributions as the primary metric, views can be a multiple for visual depth
            views: totalDayContrib * 10 
          };
        });

        setChartData(updatedChartData);

        // Fetch All Users & Global Stats if Admin
        if (isAdmin) {
          const { data: profiles, error: profilesError, count: userCount } = await supabase
            .from('profiles')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false });
          if (profilesError) throw profilesError;
          setAllUsers(profiles || []);
          
          const { count: postCount, error: adminGlobalPostsError } = await supabase
            .from('blog_posts')
            .select('*', { count: 'exact', head: true });
          
          if (!adminGlobalPostsError) {
            setStats(prev => ({ ...prev, totalUsers: userCount || 0, totalPosts: postCount || 0 }));
          }

          // Generate User Growth Data for Admins
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const growth = months.map((month, idx) => {
            const count = profiles?.filter(u => new Date(u.created_at).getMonth() <= idx).length || 0;
            return { month, users: count };
          }).slice(0, new Date().getMonth() + 1);
          setUserGrowth(growth);
        }
      } catch (err: any) {
        console.error('Dashboard fetch error:', err);
        toast.error(err.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (profile) fetchData();
  }, [profile, isBlogger, isAdmin]);

  const handleApproveBlogger = async (userId: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_approved_blogger: true })
      .eq('id', userId);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Blogger approved!');
      setAllUsers(allUsers.map(u => u.id === userId ? { ...u, is_approved_blogger: true } : u));
    }
  };

  const handleRestrictUser = async (userId: string) => {
    toast.info('User restriction logic would go here.');
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    setUpdating(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
      toast.success('Avatar uploaded! Don\'t forget to save changes.');
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error(err.message || 'Failed to upload avatar');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!profile) return;
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          avatar_url: avatarUrl,
          bio: bio,
          bio_zh: bioZh,
        })
        .eq('id', profile.id);

      if (error) throw error;
      toast.success('Profile updated successfully!');
      window.location.reload(); // Refresh to update context
    } catch (err: any) {
      console.error('Update error:', err);
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Profile Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row gap-12 mb-20 items-start"
      >
        <div className="relative group">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="h-64 w-64 rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-border"
          >
            <Avatar className="h-full w-full rounded-none">
              <AvatarImage src={profile?.avatar_url} className="object-cover" />
              <AvatarFallback className="text-4xl font-serif bg-muted text-primary">{profile?.full_name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </motion.div>
          <div className="absolute -bottom-4 -right-4 bg-primary text-white px-4 py-2 rounded-xl font-serif italic text-sm shadow-lg flex items-center">
            <BookOpen className="mr-2 h-4 w-4" /> READER 读者
          </div>
        </div>

        <div className="flex-grow space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-6xl font-serif font-bold tracking-tight text-foreground">
                {profile?.full_name} <span className="font-normal text-muted-foreground ml-2">{profile?.role === 'admin' ? '管理员' : profile?.role === 'blogger' ? '博主' : '读者'}</span>
              </h1>
              <p className="text-2xl font-serif text-muted-foreground mt-4 max-w-2xl leading-relaxed">
                {profile?.bio || 'Curator of ancient scrolls and modern digital artifacts. Exploring the intersection of Han Dynasty philosophy and future tech.'}
              </p>
              <p className="text-primary font-serif italic text-lg mt-2">
                {profile?.bio_zh || '古卷策展人与现代数字文物的探索者。研究汉代哲学与未来科技的交汇点。'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
      >
        {[
          { label: isBlogger ? 'My Posts' : 'Total Stories', zh: isBlogger ? '我的文章' : '总文章', value: isBlogger ? stats.myPostsCount : stats.totalStories, icon: BookOpen, color: 'bg-red-50 text-red-600 dark:bg-red-950/30' },
          { label: isAdmin ? 'Total Users' : 'Contributions', zh: isAdmin ? '总用户' : '贡献度', value: isAdmin ? stats.totalUsers : stats.contributions, icon: isAdmin ? Users : Award, color: 'bg-green-50 text-green-600 dark:bg-green-950/30' },
          { label: isAdmin ? 'Total Posts' : 'Join Date', zh: isAdmin ? '总文章' : '加入日期', value: isAdmin ? stats.totalPosts : (profile?.created_at ? new Date(profile.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'Mar 2023'), icon: isAdmin ? BarChart3 : Calendar, color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/30' },
        ].map((stat, i) => (
          <motion.div key={i} variants={itemVariants}>
            <Card className="rounded-[2.5rem] border-none shadow-sm bg-card hover:shadow-xl transition-all duration-500 group overflow-hidden">
              <CardContent className="p-8 flex items-center space-x-6">
                <div className={`p-4 rounded-2xl ${stat.color} group-hover:scale-110 transition-transform duration-500`}>
                  <stat.icon className="h-8 w-8" />
                </div>
                <div>
                  <div className="text-4xl font-serif font-bold italic">{stat.value}</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-widest font-medium mt-1">
                    {stat.label} <span className="font-normal">{stat.zh}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-12 mt-10">
        <TabsList className="bg-transparent border-none p-0 h-auto flex-wrap justify-start gap-4">
          {[
            { value: 'overview', label: 'Overview', icon: LayoutDashboard },
            { value: 'my-posts', label: 'My Posts', icon: BookOpen, condition: isBlogger },
            { value: 'users', label: 'Users', icon: Users, condition: isAdmin },
            { value: 'analytics', label: 'Analytics', icon: BarChart3, condition: isAdmin },
            { value: 'edit-profile', label: 'Edit Profile', icon: Edit3 },
          ].map((tab) => (
            (tab.condition === undefined || tab.condition) && (
              <TabsTrigger 
                key={tab.value}
                value={tab.value} 
                className="rounded-full px-8 py-3 border border-border data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-primary transition-all font-serif italic text-lg"
              >
                <tab.icon className="mr-2 h-4 w-4" /> {tab.label}
              </TabsTrigger>
            )
          ))}
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent value="overview" className="space-y-20 outline-none">
            {/* Analytics Overview Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              <div className="flex items-center space-x-4">
                <div className="h-px flex-grow bg-border" />
                <h2 className="text-3xl font-serif font-bold">Engagement Analytics 参与度分析</h2>
                <div className="h-px w-12 bg-border" />
              </div>
              <Card className="rounded-[3rem] border-none shadow-sm bg-card p-12">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorViewsOverview" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontFamily: 'var(--font-serif)' }} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontFamily: 'var(--font-serif)' }} 
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '1rem', border: '1px solid var(--border)', fontFamily: 'var(--font-serif)' }}
                      />
                      <Area type="monotone" dataKey="views" stroke="var(--primary)" fillOpacity={1} fill="url(#colorViewsOverview)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              {/* Recent Activity */}
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-10">
                <div className="flex items-center space-x-4">
                  <div className="h-px flex-grow bg-border" />
                  <h2 className="text-3xl font-serif font-bold">Recent Activity 近期活动</h2>
                  <div className="h-px w-12 bg-border" />
                </div>
                
                <div className="relative pl-8 space-y-12 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-px before:bg-border">
                  {recentActivities.length > 0 ? recentActivities.map((activity, i) => (
                    <motion.div key={i} variants={itemVariants} className="relative">
                      <div className={`absolute -left-[36px] top-1.5 h-4 w-4 rounded-full border-4 border-background ${activity.color}`} />
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                            {new Date(activity.time).toLocaleDateString()} • {new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <Badge variant="secondary" className="text-[10px] uppercase tracking-widest rounded-md px-2 py-0">{activity.type}</Badge>
                        </div>
                        <Card className="rounded-2xl border-none bg-muted/50 p-6 hover:bg-muted transition-colors group">
                          <h4 className="text-xl font-serif font-bold group-hover:text-primary transition-colors line-clamp-1">{activity.title}</h4>
                          <p className="text-sm text-muted-foreground mt-2 font-serif italic leading-relaxed line-clamp-2">{activity.desc}</p>
                        </Card>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="py-10 text-center font-serif italic text-muted-foreground">
                      No recent activity found. Start exploring the scrolls!
                    </div>
                  )}
                </div>

                <div className="text-center pt-8">
                  <Button 
                    variant="link" 
                    onClick={() => toast.info('Full activity log feature coming soon!')}
                    className="text-primary font-serif font-bold italic text-lg uppercase tracking-widest hover:no-underline group"
                  >
                    View Full Scroll 查看完整记录
                    <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="ml-2">→</motion.span>
                  </Button>
                </div>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="my-posts" className="outline-none">
            <Card className="rounded-[3rem] border-none shadow-sm bg-card p-12">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <h2 className="text-4xl font-serif font-bold">My Blog Posts 我的文章</h2>
                  <p className="text-muted-foreground mt-2 font-serif italic">Manage your published and draft stories.</p>
                </div>
                <Link to="/blog/new" className={buttonVariants({ className: "bg-primary hover:bg-primary/90 text-white rounded-2xl px-8 py-6 font-serif italic" })}>
                  <Plus className="mr-2 h-5 w-5" /> New Post 新文章
                </Link>
              </div>
              
              {loading ? (
                <div className="py-20 text-center font-serif italic text-muted-foreground">Loading scrolls...</div>
              ) : myPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {myPosts.map(post => (
                    <motion.div key={post.id} whileHover={{ y: -5 }}>
                      <Card className="rounded-3xl border border-border bg-background hover:border-primary/50 transition-all p-8 group">
                        <div className="flex justify-between items-start mb-6">
                          <Badge variant="outline" className="rounded-full px-4 py-1 uppercase tracking-widest text-[10px]">{post.category}</Badge>
                          <span className="text-xs text-muted-foreground font-serif italic">{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                        <h4 className="text-2xl font-serif font-bold mb-4 group-hover:text-primary transition-colors">{post.title}</h4>
                        <div className="flex items-center space-x-4 pt-4 border-t border-border">
                          <Link to={`/blog/edit/${post.id}`} className="text-sm font-serif italic hover:text-primary transition-colors">Edit 编辑</Link>
                          <button 
                            onClick={() => toast.info('Delete functionality will be implemented soon.')}
                            className="text-sm font-serif italic text-destructive hover:opacity-70 transition-opacity"
                          >
                            Delete 删除
                          </button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed border-border">
                  <BookOpen className="mx-auto h-16 w-16 text-muted-foreground/30 mb-6" />
                  <h3 className="text-2xl font-serif font-bold">No scrolls yet</h3>
                  <p className="text-muted-foreground font-serif italic mb-8">Start sharing your China experiences with the world.</p>
                  <Link to="/blog/new" className={buttonVariants({ className: "bg-primary hover:bg-primary/90" })}>
                    Create First Post
                  </Link>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="users" className="outline-none">
            <Card className="rounded-[3rem] border-none shadow-sm bg-card p-12">
              <div className="mb-12">
                <h2 className="text-4xl font-serif font-bold">User Management 用户管理</h2>
                <p className="text-muted-foreground mt-2 font-serif italic">Review and manage community members and permissions.</p>
              </div>

              <ScrollArea className="h-[600px] pr-6">
                <div className="space-y-6">
                  {allUsers.map((user) => (
                    <motion.div key={user.id} whileHover={{ x: 5 }}>
                      <Card className="rounded-3xl border border-border bg-background p-6 flex items-center justify-between group hover:border-primary/30 transition-all">
                        <div className="flex items-center space-x-6">
                          <Avatar className="h-16 w-16 border-2 border-border group-hover:border-primary/50 transition-colors">
                            <AvatarImage src={user.avatar_url} />
                            <AvatarFallback className="font-serif">{user.full_name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="text-xl font-serif font-bold">{user.full_name}</h4>
                            <p className="text-sm text-muted-foreground font-serif italic">{user.email}</p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline" className="text-[10px] uppercase tracking-widest border-primary/20 text-primary">{user.role}</Badge>
                              {user.is_approved_blogger && (
                                <Badge className="bg-green-500/10 text-green-600 border-none text-[10px] uppercase tracking-widest">Approved Blogger</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          {!user.is_approved_blogger && user.role === 'blogger' && (
                            <Button 
                              size="sm" 
                              onClick={() => handleApproveBlogger(user.id)}
                              className="bg-primary hover:bg-primary/90 text-white rounded-xl font-serif italic"
                            >
                              Approve 批准
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleRestrictUser(user.id)}
                            className="rounded-xl font-serif italic border-border hover:border-destructive hover:text-destructive"
                          >
                            Restrict 限制
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="outline-none">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="rounded-[3rem] border-none shadow-sm bg-card p-12">
                <div className="mb-10">
                  <h3 className="text-2xl font-serif font-bold">Community Engagement 社区参与度</h3>
                  <p className="text-sm text-muted-foreground font-serif italic">Weekly views and contributions overview.</p>
                </div>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontFamily: 'var(--font-serif)' }} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontFamily: 'var(--font-serif)' }} 
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '1rem', border: '1px solid var(--border)', fontFamily: 'var(--font-serif)' }}
                      />
                      <Area type="monotone" dataKey="views" stroke="var(--primary)" fillOpacity={1} fill="url(#colorViews)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="rounded-[3rem] border-none shadow-sm bg-card p-12">
                <div className="mb-10">
                  <h3 className="text-2xl font-serif font-bold">User Growth 用户增长</h3>
                  <p className="text-sm text-muted-foreground font-serif italic">Monthly new member registrations.</p>
                </div>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={userGrowth}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontFamily: 'var(--font-serif)' }} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontFamily: 'var(--font-serif)' }} 
                      />
                      <Tooltip 
                        cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                        contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '1rem', border: '1px solid var(--border)', fontFamily: 'var(--font-serif)' }}
                      />
                      <Bar dataKey="users" fill="var(--primary)" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="edit-profile" className="outline-none">
            <Card className="rounded-[3rem] border-none shadow-sm bg-card p-12">
              <div className="mb-12">
                <h2 className="text-4xl font-serif font-bold">Edit Profile 编辑个人资料</h2>
                <p className="text-muted-foreground mt-2 font-serif italic">Update your public identity and account details.</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                <div className="flex flex-col items-center space-y-8 p-10 bg-muted/30 rounded-[3rem] border border-border">
                  <div className="relative group">
                    <Avatar className="h-40 w-40 border-8 border-background shadow-2xl">
                      <AvatarImage src={avatarUrl} className="object-cover" />
                      <AvatarFallback className="text-4xl font-serif">{fullName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <Edit3 className="text-white h-8 w-8" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        onChange={handleAvatarUpload}
                        disabled={updating}
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <h4 className="text-xl font-serif font-bold">{fullName}</h4>
                    <p className="text-sm text-muted-foreground uppercase tracking-widest mt-1">{profile?.role}</p>
                  </div>
                </div>

                  <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label htmlFor="full_name" className="font-serif italic text-lg">Full Name 姓名</Label>
                        <Input 
                          id="full_name" 
                          value={fullName} 
                          onChange={(e) => setFullName(e.target.value)}
                          className="rounded-2xl h-14 bg-muted/50 border-none focus:bg-background transition-colors"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="email" className="font-serif italic text-lg">Email 邮箱</Label>
                        <Input id="email" defaultValue={profile?.email} disabled className="rounded-2xl h-14 bg-muted/50 border-none opacity-50" />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="bio" className="font-serif italic text-lg">Bio 个人简介 (English)</Label>
                      <textarea 
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full rounded-2xl p-4 bg-muted/50 border-none focus:bg-background transition-colors font-serif min-h-[100px]"
                        placeholder="Tell the world about your journey..."
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="bio_zh" className="font-serif italic text-lg">Bio 个人简介 (Chinese)</Label>
                      <textarea 
                        id="bio_zh"
                        value={bioZh}
                        onChange={(e) => setBioZh(e.target.value)}
                        className="w-full rounded-2xl p-4 bg-muted/50 border-none focus:bg-background transition-colors font-serif min-h-[100px]"
                        placeholder="用中文分享你的故事..."
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="avatar" className="font-serif italic text-lg">Avatar URL 头像链接</Label>
                      <Input 
                        id="avatar" 
                        value={avatarUrl} 
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://..." 
                        className="rounded-2xl h-14 bg-muted/50 border-none focus:bg-background transition-colors"
                      />
                    </div>
                  
                  <div className="pt-8">
                    <Button 
                      className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-12 py-8 text-xl font-serif italic shadow-xl shadow-primary/20" 
                      onClick={handleUpdateProfile}
                      disabled={updating}
                    >
                      {updating ? 'Saving...' : 'Save Changes 保存'}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
