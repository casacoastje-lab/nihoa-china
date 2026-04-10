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
import { LayoutDashboard, BookOpen, Users, Settings, Plus, CheckCircle, XCircle, BarChart3 } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

export default function Dashboard() {
  const { profile, isAdmin, isBlogger } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [myPosts, setMyPosts] = useState<BlogPost[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (isBlogger) {
          const { data, error: postsError } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('author_id', profile?.id)
            .order('created_at', { ascending: false });
          if (postsError) throw postsError;
          setMyPosts(data || []);
        }

        if (isAdmin) {
          const { data, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });
          if (profilesError) throw profilesError;
          setAllUsers(data || []);
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
    // Logic for restricting user (e.g., setting a 'restricted' flag)
    toast.info('User restriction logic would go here.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 border-2 border-red-600 p-0.5">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback className="text-xl">{profile?.full_name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{profile?.full_name}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="secondary" className="capitalize">{profile?.role}</Badge>
              {profile?.role === 'blogger' && (
                <Badge variant={profile.is_approved_blogger ? "default" : "outline"} className="bg-green-100 text-green-700 hover:bg-green-100">
                  {profile.is_approved_blogger ? 'Approved' : 'Pending Approval'}
                </Badge>
              )}
            </div>
          </div>
        </div>
        {isBlogger && profile?.is_approved_blogger && (
          <Link to="/blog/new" className={buttonVariants({ className: "bg-red-600 hover:bg-red-700 rounded-full" })}>
            <Plus className="mr-2 h-4 w-4" /> New Blog Post
          </Link>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-white border border-stone-200 p-1 h-auto flex-wrap justify-start">
          <TabsTrigger value="overview" className="data-[state=active]:bg-stone-100">
            <LayoutDashboard className="mr-2 h-4 w-4" /> Overview
          </TabsTrigger>
          {isBlogger && (
            <TabsTrigger value="my-posts" className="data-[state=active]:bg-stone-100">
              <BookOpen className="mr-2 h-4 w-4" /> My Posts
            </TabsTrigger>
          )}
          {isAdmin && (
            <>
              <TabsTrigger value="users" className="data-[state=active]:bg-stone-100">
                <Users className="mr-2 h-4 w-4" /> Users
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-stone-100">
                <BarChart3 className="mr-2 h-4 w-4" /> Analytics
              </TabsTrigger>
            </>
          )}
          <TabsTrigger value="settings" className="data-[state=active]:bg-stone-100">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-stone-500">Total Contributions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{isBlogger ? myPosts.length : 0}</div>
                <p className="text-xs text-stone-400 mt-1">Blog posts and comments</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-stone-500">Community Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">Active</div>
                <p className="text-xs text-stone-400 mt-1">Member since {new Date(profile?.created_at || '').toLocaleDateString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-stone-500">Reputation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">Explorer</div>
                <p className="text-xs text-stone-400 mt-1">Keep sharing to level up</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-stone-500 text-center py-8">No recent activity to show.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {isBlogger && (
          <TabsContent value="my-posts">
            <Card>
              <CardHeader>
                <CardTitle>My Blog Posts</CardTitle>
                <CardDescription>Manage your published and draft stories.</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading posts...</p>
                ) : myPosts.length > 0 ? (
                  <div className="space-y-4">
                    {myPosts.map(post => (
                      <div key={post.id} className="flex items-center justify-between p-4 border border-stone-100 rounded-2xl hover:bg-stone-50 transition-colors">
                        <div>
                          <h4 className="font-bold">{post.title}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-[10px] uppercase">{post.category}</Badge>
                            <span className="text-xs text-stone-400">{new Date(post.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Link to={`/blog/edit/${post.id}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
                            Edit
                          </Link>
                          <Button variant="ghost" size="sm" className="text-red-600">Delete</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="mx-auto h-12 w-12 text-stone-300 mb-4" />
                    <h3 className="text-lg font-medium">No posts yet</h3>
                    <p className="text-stone-500 mb-6">Start sharing your China experiences with the world.</p>
                    <Link to="/blog/new" className={buttonVariants({ className: "bg-red-600 hover:bg-red-700" })}>
                      Create First Post
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {isAdmin && (
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Approve bloggers and manage community members.</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {allUsers.map(u => (
                      <div key={u.id} className="flex items-center justify-between p-4 border border-stone-100 rounded-2xl">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={u.avatar_url} />
                            <AvatarFallback>{u.full_name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold">{u.full_name}</p>
                            <p className="text-xs text-stone-500">{u.email} • {u.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {u.role === 'blogger' && !u.is_approved_blogger && (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApproveBlogger(u.id)}>
                              <CheckCircle className="mr-2 h-4 w-4" /> Approve
                            </Button>
                          )}
                          <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleRestrictUser(u.id)}>
                            <XCircle className="mr-2 h-4 w-4" /> Restrict
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Update your profile information and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input id="full_name" defaultValue={profile?.full_name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue={profile?.email} disabled />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avatar">Avatar URL</Label>
                  <Input id="avatar" defaultValue={profile?.avatar_url} placeholder="https://..." />
                </div>
              </div>
              <Button className="bg-red-600 hover:bg-red-700">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
