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
import { LayoutDashboard, BookOpen, Users, Settings, Plus, CheckCircle, XCircle, BarChart3, Clock, TrendingUp, Edit3, Award, Calendar, Quote, Globe } from 'lucide-react';
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
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
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
          .select('*, profiles(full_name)')
          .eq('author_id', profile?.id)
          .order('created_at', { ascending: false });
        
        if (!postsError) {
          setMyPosts(posts || []);
        }

        // Admin: Fetch ALL posts for management
        if (isAdmin) {
          const { data: allP, error: allPError } = await supabase
            .from('blog_posts')
            .select('*, profiles(full_name)')
            .order('created_at', { ascending: false });
          
          if (!allPError) {
            setAllPosts(allP || []);
          }
        }
        
        const { data: comments, count: commentsCount, error: commentsError } = await supabase
          .from('comments')
          .select('*, blog_posts(title)', { count: 'exact' })
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
              id: `post-${p.id}`,
              time: p.created_at,
              title: p.title,
              desc: p.content.substring(0, 100) + '...',
              type: 'Article 文章',
              color: 'bg-red-500'
            })),
            ...(comments || []).map(c => ({
              id: `comment-${c.id}`,
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
            posts: dayPosts,
            comments: dayComments,
            contributions: totalDayContrib,
            // Use real contributions as the primary metric, views can be a multiple for visual depth
            views: totalDayContrib * 10 
          };
        });

        setChartData(updatedChartData);

        // Fetch All Users & Global Stats if Admin
        if (isAdmin) {
          const { data: profilesData, error: profilesError, count: userCount } = await supabase
            .from('profiles')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false });
          if (profilesError) throw profilesError;
          setAllUsers(profilesData || []);
          
          const { count: postCount, error: adminGlobalPostsError } = await supabase
            .from('blog_posts')
            .select('*', { count: 'exact', head: true });
          
          if (!adminGlobalPostsError) {
            setStats(prev => ({ ...prev, totalUsers: userCount || 0, totalPosts: postCount || 0 }));
          }

          // Generate User Growth Data for Admins
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const growth = months.map((month, idx) => {
            const count = profilesData?.filter(u => new Date(u.created_at).getMonth() <= idx).length || 0;
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

  const handleDeletePost = async (postId: string) => {
    const confirm = window.confirm("Are you sure you want to delete this story? This cannot be undone.");
    if (!confirm) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      
      toast.success('Story unrolled and removed.');
      setMyPosts(prev => prev.filter(p => p.id !== postId));
      setAllPosts(prev => prev.filter(p => p.id !== postId));
      setStats(prev => ({ ...prev, totalStories: Math.max(0, prev.totalStories - 1) }));
    } catch (err: any) {
      console.error('Delete error:', err);
      toast.error(err.message || 'Failed to delete story.');
    } finally {
      setUpdating(false);
    }
  };

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
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'reader' })
        .eq('id', userId);

      if (error) throw error;

      setAllUsers(allUsers.map(u => u.id === userId ? { ...u, role: 'reader' } : u));
      toast.success('User restricted to Reader role.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to restrict user');
    }
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

  const handleResetArchive = async () => {
    if (!isAdmin) return;
    const confirm = window.confirm("Are you sure you want to delete ALL blog posts? This cannot be undone.");
    if (!confirm) return;

    setUpdating(true);
    try {
      // Use the actual supabase client which should have user session
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) throw error;
      toast.success('Archive wiped clean. You can now start fresh!');
      setMyPosts([]);
      setStats(prev => ({ ...prev, totalStories: 0, myPostsCount: 0 }));
    } catch (err: any) {
      console.error('Reset error:', err);
      toast.error(err.message || 'Failed to wipe archive. You may need to check RLS policies.');
    } finally {
      setUpdating(false);
    }
  };

  const handleSyncMapLandmarks = async () => {
    if (!isAdmin) {
      toast.error("Unauthorized: Admin credentials required.");
      return;
    }
    
    console.log('Sync button clicked. Admin status:', { isAdmin, isEmailAdmin });
    const confirm = window.confirm("This will PERMANENTLY REPLACE all database landmarks with your new high-quality images and data. Continue?");
    if (!confirm) return;

    setUpdating(true);
    toast.info("Starting master synchronization...");
    
    try {
      const landmarksToSeed = [
        { name: 'The Forbidden City', name_zh: '故宫博物院', province: 'Beijing', description: "The world's largest surviving wooden palace complex.", category: 'Ancient', lat: 39.9163, lng: 116.3972, image_url: 'https://sefqcqhksupblrprcuzi.supabase.co/storage/v1/object/public/3dfile/forbibden%20city.webp' },
        { name: 'Temple of Heaven', name_zh: '天坛', province: 'Beijing', description: 'An imperial complex of religious buildings visited by Emperors.', category: 'Ancient', lat: 39.8822, lng: 116.4066, image_url: 'https://sefqcqhksupblrprcuzi.supabase.co/storage/v1/object/public/3dfile/Temple%20of%20Heaven.webp' },
        { name: 'Potala Palace', name_zh: '布达拉宫', province: 'Tibet', description: 'A massive fortress-like complex and a masterpiece of Tibetan architecture.', category: 'Ancient', lat: 29.6577, lng: 91.1172, image_url: 'https://sefqcqhksupblrprcuzi.supabase.co/storage/v1/object/public/3dfile/Potala%20Palace.jpg' },
        { name: 'The Bund', name_zh: '外滩', province: 'Shanghai', description: 'A famous waterfront area with dozens of historical buildings.', category: 'Modern', lat: 31.2415, lng: 121.4842, image_url: 'https://sefqcqhksupblrprcuzi.supabase.co/storage/v1/object/public/3dfile/The%20Bund.jpg' },
        { name: 'Canton Tower', name_zh: '广州塔', province: 'Guangdong', description: 'A multipurpose observation tower with a unique hyper-curved design.', category: 'Modern', lat: 23.1065, lng: 113.3242, image_url: 'https://sefqcqhksupblrprcuzi.supabase.co/storage/v1/object/public/3dfile/canton%20tower.jpg' },
        { name: 'Terracotta Army', name_zh: '秦始皇兵马俑', province: 'Shaanxi', description: 'A collection of terracotta sculptures depicting the first Emperor\'s armies.', category: 'Ancient', lat: 34.3841, lng: 109.2785, image_url: 'https://sefqcqhksupblrprcuzi.supabase.co/storage/v1/object/public/3dfile/Terracotta%20Army.jpg' },
        { name: 'Lijiang Old Town', name_zh: '丽江古城', province: 'Yunnan', description: 'A UNESCO site known for its blend of indigenous architectural traditions.', category: 'Ancient', lat: 26.8721, lng: 100.2274, image_url: 'https://sefqcqhksupblrprcuzi.supabase.co/storage/v1/object/public/3dfile/Lijiang%20Old%20Town.jpg' },
        { name: 'Mogao Caves', name_zh: '莫高窟', province: 'Gansu', description: 'Also known as the Caves of the Thousand Buddhas, containing a system of 492 temples.', category: 'Ancient', lat: 40.0425, lng: 94.8111, image_url: 'https://sefqcqhksupblrprcuzi.supabase.co/storage/v1/object/public/3dfile/China_Magao-scaled.jpg' },
        { name: 'Chongqing Art Museum', name_zh: '重庆美术馆', province: 'Chongqing', description: 'A modern landmark known for its distincitve "red lattice" architectural design.', category: 'Modern', lat: 29.5630, lng: 106.5770, image_url: 'https://sefqcqhksupblrprcuzi.supabase.co/storage/v1/object/public/3dfile/Chongqing_Art_Museum.jpg' }
      ];

      console.log('Starting landmark synchronization...');
      toast.loading('Step 1: Clearing old database entries...', { id: 'sync-steps' });
      
      // Step 1: Delete all existing landmarks
      const { error: deleteError } = await supabase
        .from('landmarks')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (deleteError) {
        console.error('Delete step failed:', deleteError);
        toast.error(`Clear failed: ${deleteError.message}`, { id: 'sync-steps' });
        throw new Error(`Delete failed: ${deleteError.message}`);
      }

      console.log('Old landmarks cleared. Seeding new ones...');
      toast.loading('Step 2: Injecting new high-quality assets...', { id: 'sync-steps' });

      // Step 2: Insert the new ones
      const { error: insertError } = await supabase
        .from('landmarks')
        .insert(landmarksToSeed);

      if (insertError) {
        console.error('Insert step failed:', insertError);
        toast.error(`Injection failed: ${insertError.message}`, { id: 'sync-steps' });
        throw new Error(`Insert failed: ${insertError.message}`);
      }

      toast.success('Synchronization Complete! Page will refresh.', { id: 'sync-steps' });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      console.error('Sync process error:', err);
      toast.error(err.message || 'Synchronization failed.');
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
        className="flex flex-col lg:flex-row gap-8 sm:gap-12 mb-12 sm:mb-20 items-center lg:items-start text-center lg:text-left"
      >
        <div className="relative group">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="h-48 w-48 sm:h-64 sm:w-64 rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-border"
          >
            <Avatar className="h-full w-full rounded-none">
              <AvatarImage src={profile?.avatar_url} className="object-cover" />
              <AvatarFallback className="text-4xl font-serif bg-muted text-primary">{profile?.full_name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </motion.div>
          <div className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 bg-primary text-white px-3 py-1 sm:px-4 sm:py-2 rounded-xl font-serif italic text-xs sm:text-sm shadow-lg flex items-center">
            {profile?.role === 'admin' ? (
              <><Award className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> ADMIN 管理员</>
            ) : profile?.role === 'blogger' ? (
              <><Edit3 className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> BLOGGER 博主</>
            ) : (
              <><BookOpen className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> READER 读者</>
            )}
          </div>
        </div>

        <div className="flex-grow space-y-4 sm:space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            <div>
              <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight text-foreground">
                {profile?.full_name} <span className="block sm:inline font-normal text-muted-foreground sm:ml-2 text-2xl sm:text-4xl">{profile?.role === 'admin' ? '管理员' : profile?.role === 'blogger' ? '博主' : '读者'}</span>
              </h1>
              <p className="text-lg sm:text-2xl font-serif text-muted-foreground mt-4 max-w-2xl leading-relaxed">
                {profile?.bio || 'No bio provided yet.'}
              </p>
              <p className="text-primary font-serif italic text-base sm:text-lg mt-2">
                {profile?.bio_zh || '尚未提供简介。'}
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
          { label: 'Total Stories', zh: '总文章', value: stats.totalStories, icon: BookOpen, color: 'bg-red-50 text-red-600 dark:bg-red-950/30' },
          { label: isAdmin ? 'Total Users' : 'Contributions', zh: isAdmin ? '总用户' : '贡献度', value: isAdmin ? stats.totalUsers : stats.contributions, icon: isAdmin ? Users : Award, color: 'bg-green-50 text-green-600 dark:bg-green-950/30' },
          { label: isBlogger ? 'My Posts' : 'Join Date', zh: isBlogger ? '我的文章' : '加入日期', value: isBlogger ? stats.myPostsCount : (profile?.created_at ? new Date(profile.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'N/A'), icon: isBlogger ? Edit3 : Calendar, color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/30' },
        ].map((stat, i) => (
          <motion.div key={i} variants={itemVariants}>
            <Card className="rounded-[2rem] sm:rounded-[2.5rem] border-none shadow-sm bg-card hover:shadow-xl transition-all duration-500 group overflow-hidden">
              <CardContent className="p-6 sm:p-8 flex items-center space-x-4 sm:space-x-6">
                <div className={`p-3 sm:p-4 rounded-2xl ${stat.color} group-hover:scale-110 transition-transform duration-500`}>
                  <stat.icon className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <div>
                  <div className="text-2xl sm:text-4xl font-serif font-bold italic">{stat.value}</div>
                  <div className="text-[10px] sm:text-sm text-muted-foreground uppercase tracking-widest font-medium mt-1">
                    {stat.label} <span className="hidden sm:inline font-normal">{stat.zh}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-12 mt-10">
        <TabsList className="bg-transparent border-none p-0 h-auto flex flex-wrap justify-start gap-2 sm:gap-4">
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
                className="rounded-full px-4 sm:px-8 py-2 sm:py-3 border border-border data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-primary transition-all font-serif italic text-base sm:text-lg"
              >
                <tab.icon className="mr-2 h-4 w-4" /> {tab.label}
              </TabsTrigger>
            )
          ))}
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent key="overview" value="overview" className="space-y-20 outline-none">
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
              <Card className="rounded-[2rem] sm:rounded-[3rem] border-none shadow-sm bg-card p-6 sm:p-12">
                <div className="h-[250px] sm:h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorComments" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
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
                      <Area type="monotone" dataKey="posts" name="Posts 文章" stroke="var(--primary)" fillOpacity={1} fill="url(#colorPosts)" strokeWidth={3} />
                      <Area type="monotone" dataKey="comments" name="Comments 评论" stroke="#10b981" fillOpacity={1} fill="url(#colorComments)" strokeWidth={3} />
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
                  {recentActivities.length > 0 ? recentActivities.map((activity) => (
                    <motion.div key={activity.id} variants={itemVariants} className="relative">
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

                <div className="text-center pt-8 space-y-6">
                  <Button 
                    variant="link" 
                    onClick={() => toast.info('Full activity log feature coming soon!')}
                    className="text-primary font-serif font-bold italic text-lg uppercase tracking-widest hover:no-underline group"
                  >
                    View Full Scroll 查看完整记录
                    <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="ml-2">→</motion.span>
                  </Button>

                  {isAdmin && (
                    <div className="pt-12 border-t border-border/50 space-y-8">
                      <div className="inline-block p-8 border border-destructive/20 rounded-[2rem] bg-destructive/5 max-w-lg">
                        <h4 className="text-xl font-serif font-bold text-destructive mb-3">Admin Emergency Dashboard</h4>
                        <p className="text-sm text-muted-foreground font-serif italic mb-6">This will permanently delete all blog posts from the database to allow for a fresh start.</p>
                        <Button 
                          variant="destructive"
                          onClick={handleResetArchive}
                          disabled={updating}
                          className="rounded-xl px-8 h-12 font-serif italic shadow-lg shadow-destructive/10"
                        >
                          <XCircle className="mr-2 h-4 w-4" /> Clear All Blog Posts
                        </Button>
                      </div>

                      <div className="inline-block w-full p-8 border border-primary/20 rounded-[2rem] bg-primary/5 mt-8">
                        <div className="flex items-center justify-between mb-8">
                          <h4 className="text-xl font-serif font-bold text-primary">Map Navigator Management</h4>
                          <div className="flex items-center space-x-2 bg-background/50 px-3 py-1 rounded-full border border-border">
                            <div className={`h-2 w-2 rounded-full ${isAdmin ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                            <span className="text-[10px] font-mono font-bold uppercase tracking-widest">
                              {isAdmin ? 'Admin Authenticated' : 'Unauthorized Access'}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground font-serif italic mb-6">
                          Sync your latest high-quality images and landmarks. This will perform a <strong>Hard Reset</strong> on the database to ensure zero duplicates.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <Button 
                              onClick={handleSyncMapLandmarks}
                              disabled={updating}
                              className="w-full rounded-xl px-8 h-12 font-serif italic shadow-lg shadow-primary/10 bg-primary hover:bg-primary/90 text-white"
                            >
                              <Globe className="mr-2 h-4 w-4" /> Clear & Sync Landmarks
                            </Button>
                            
                            <div className="p-4 bg-muted/40 rounded-xl space-y-3">
                              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter flex items-center">
                                <Award className="mr-2 h-3 w-3 text-primary" /> Active Permissions Profile:
                              </p>
                              <div className="text-[10px] font-mono text-muted-foreground space-y-1.5 list-disc pl-2">
                                <p className="flex justify-between"><span>Email:</span> <span className="text-foreground">{profile?.email || 'casa.coast.je@gmail.com'}</span></p>
                                <p className="flex justify-between"><span>Database Role:</span> <span className="text-foreground font-bold">{profile?.role || 'user (bypass active)'}</span></p>
                                <p className="flex justify-between"><span>Session Level:</span> <span className="text-primary font-bold">SUPER ADMIN</span></p>
                                <div className="pt-2 border-t border-border/50 text-[8px] text-emerald-500 font-bold uppercase tracking-widest leading-tight">
                                  ✓ Bulk Map Sync Enabled<br />
                                  ✓ Global Archive Delete Enabled<br />
                                  ✓ Image Injection Enabled
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-black/50 p-4 rounded-xl border border-zinc-800">
                            <p className="text-[10px] text-zinc-500 mb-2 uppercase tracking-widest font-bold">Manual SQL Override (If button fails):</p>
                            <code className="text-primary font-mono text-[9px] leading-tight block whitespace-pre h-40 overflow-y-auto">
                              {`-- 1. CLEAN RESET
TRUNCATE landmarks;

-- 2. VERIFY PERMISSIONS
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'landmarks' AND policyname = 'Admin write') THEN
        CREATE POLICY "Admin write" ON landmarks FOR ALL USING (true);
    END IF;
END $$;

-- 3. SCHEMA ENSURANCE
CREATE TABLE IF NOT EXISTS landmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE,
  name_zh TEXT,
  province TEXT,
  description TEXT,
  category TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);`}
                            </code>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent key="my-posts" value="my-posts" className="outline-none">
            <Card className="rounded-[3rem] border-none shadow-sm bg-card p-12">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <h2 className="text-4xl font-serif font-bold">{isAdmin ? 'Manage All Stories 管理所有文章' : 'My Blog Posts 我的文章'}</h2>
                  <p className="text-muted-foreground mt-2 font-serif italic">
                    {isAdmin ? 'Review, update, or remove any story from the archive.' : 'Manage your published and draft stories.'}
                  </p>
                </div>
                <Link to="/blog/new" className={buttonVariants({ className: "bg-primary hover:bg-primary/90 text-white rounded-2xl px-8 py-6 font-serif italic" })}>
                  <Plus className="mr-2 h-5 w-5" /> New Post 新文章
                </Link>
              </div>
              
              {loading ? (
                <div className="py-20 text-center font-serif italic text-muted-foreground">Loading scrolls...</div>
              ) : (isAdmin ? allPosts : myPosts).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {(isAdmin ? allPosts : myPosts).map(post => (
                    <motion.div key={post.id} whileHover={{ y: -5 }}>
                      <Card className="rounded-3xl border border-border bg-background hover:border-primary/50 transition-all p-8 group">
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex flex-col gap-1">
                            <Badge variant="outline" className="rounded-full px-4 py-1 uppercase tracking-widest text-[10px] w-fit">{post.category}</Badge>
                            {isAdmin && (
                              <span className="text-[10px] text-muted-foreground font-serif italic ml-1">
                                By: {(post as any).profiles?.full_name || 'Admin'}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground font-serif italic">{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                        <h4 className="text-2xl font-serif font-bold mb-4 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h4>
                        <div className="flex items-center space-x-4 pt-4 border-t border-border">
                          <Link to={`/blog/edit/${post.id}`} className="text-sm font-serif italic hover:text-primary transition-colors">Edit 编辑</Link>
                          <button 
                            onClick={() => handleDeletePost(post.id)}
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

            {isAdmin && (
              <Card className="mt-12 rounded-[2rem] border-none shadow-sm bg-zinc-900 text-zinc-100 p-8 overflow-hidden">
                <div className="flex items-start justify-between">
                  <div className="space-y-4">
                    <h3 className="text-xl font-serif font-bold text-zinc-400 uppercase tracking-widest flex items-center">
                      <Clock className="mr-3 h-5 w-5" /> SQL Reference Database Patch
                    </h3>
                    <p className="text-zinc-500 font-serif italic max-w-2xl">
                      If you need to manually fix RLS (Row Level Security) or wipe specific sets of blogs via the Supabase SQL Editor, use these snippets.
                    </p>
                  </div>
                </div>
                <div className="mt-8 space-y-6">
                  <div className="bg-black/50 p-6 rounded-2xl border border-zinc-800">
                    <p className="text-xs text-zinc-600 mb-2 uppercase tracking-widest font-bold">Wipe all blog posts (DANGEROUS):</p>
                    <code className="text-primary font-mono text-sm break-all">DELETE FROM blog_posts;</code>
                  </div>
                  <div className="bg-black/50 p-6 rounded-2xl border border-zinc-800">
                    <p className="text-xs text-zinc-600 mb-2 uppercase tracking-widest font-bold">Change author of all posts to you:</p>
                    <code className="text-primary font-mono text-sm break-all">UPDATE blog_posts SET author_id = '{profile?.id}';</code>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent key="users" value="users" className="outline-none">
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

          <TabsContent key="analytics" value="analytics" className="outline-none">
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
                        <linearGradient id="colorPostsDetail" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorCommentsDetail" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
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
                      <Area type="monotone" dataKey="posts" name="Posts 文章" stroke="var(--primary)" fillOpacity={1} fill="url(#colorPostsDetail)" strokeWidth={3} />
                      <Area type="monotone" dataKey="comments" name="Comments 评论" stroke="#10b981" fillOpacity={1} fill="url(#colorCommentsDetail)" strokeWidth={3} />
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

          <TabsContent key="edit-profile" value="edit-profile" className="outline-none">
            <Card className="rounded-[2rem] sm:rounded-[3rem] border-none shadow-sm bg-card p-6 sm:p-12">
              <div className="mb-8 sm:mb-12">
                <h2 className="text-3xl sm:text-4xl font-serif font-bold">Edit Profile 编辑个人资料</h2>
                <p className="text-muted-foreground mt-2 font-serif italic">Update your public identity and account details.</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-16">
                <div className="flex flex-col items-center space-y-6 sm:space-y-8 p-6 sm:p-10 bg-muted/30 rounded-[2rem] sm:rounded-[3rem] border border-border">
                  <div className="relative group">
                    <Avatar className="h-32 w-32 sm:h-40 sm:w-40 border-8 border-background shadow-2xl">
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

                  <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                      <div className="space-y-3">
                        <Label htmlFor="full_name" className="font-serif italic text-base sm:text-lg">Full Name 姓名</Label>
                        <Input 
                          id="full_name" 
                          value={fullName} 
                          onChange={(e) => setFullName(e.target.value)}
                          className="rounded-2xl h-12 sm:h-14 bg-muted/50 border-none focus:bg-background transition-colors"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="email" className="font-serif italic text-base sm:text-lg">Email 邮箱</Label>
                        <Input id="email" defaultValue={profile?.email} disabled className="rounded-2xl h-12 sm:h-14 bg-muted/50 border-none opacity-50" />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="bio" className="font-serif italic text-base sm:text-lg">Bio 个人简介 (English)</Label>
                      <textarea 
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full rounded-2xl p-4 bg-muted/50 border-none focus:bg-background transition-colors font-serif min-h-[100px]"
                        placeholder="Tell the world about your journey..."
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="bio_zh" className="font-serif italic text-base sm:text-lg">Bio 个人简介 (Chinese)</Label>
                      <textarea 
                        id="bio_zh"
                        value={bioZh}
                        onChange={(e) => setBioZh(e.target.value)}
                        className="w-full rounded-2xl p-4 bg-muted/50 border-none focus:bg-background transition-colors font-serif min-h-[100px]"
                        placeholder="用中文分享你的故事..."
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="avatar" className="font-serif italic text-base sm:text-lg">Avatar URL 头像链接</Label>
                      <Input 
                        id="avatar" 
                        value={avatarUrl} 
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://..." 
                        className="rounded-2xl h-12 sm:h-14 bg-muted/50 border-none focus:bg-background transition-colors"
                      />
                    </div>
                  
                  <div className="pt-4 sm:pt-8">
                    <Button 
                      className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white rounded-2xl px-12 py-6 sm:py-8 text-lg sm:text-xl font-serif italic shadow-xl shadow-primary/20" 
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
