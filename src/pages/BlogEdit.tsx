import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/contexts/AuthContext';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Textarea } from '@/src/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { toast } from 'sonner';
import { Image as ImageIcon, FileText, X, Upload, Save, ArrowLeft } from 'lucide-react';

export default function BlogEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('culture');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [status, setStatus] = useState<'draft' | 'published'>('draft');

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;
          
          setTitle(data.title);
          setContent(data.content);
          setCategory(data.category);
          setThumbnailUrl(data.thumbnail_url || '');
          setAttachments(data.attachments || []);
          setStatus(data.status);
        } catch (err: any) {
          console.error('Fetch error:', err);
          toast.error(err.message || 'Post not found');
          navigate('/dashboard');
        } finally {
          setFetching(false);
        }
      };
      fetchPost();
    }
  }, [id, navigate]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'thumbnail' | 'attachment') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${user?.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('blog-assets')
      .upload(filePath, file);

    if (uploadError) {
      toast.error(uploadError.message);
    } else {
      const { data: { publicUrl } } = supabase.storage
        .from('blog-assets')
        .getPublicUrl(filePath);

      if (type === 'thumbnail') {
        setThumbnailUrl(publicUrl);
      } else {
        setAttachments([...attachments, publicUrl]);
      }
      toast.success('File uploaded successfully!');
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.is_approved_blogger && profile?.role !== 'admin') {
      toast.error('Your blogger account is pending approval.');
      return;
    }

    setLoading(true);
    const postData = {
      title,
      content,
      category,
      thumbnail_url: thumbnailUrl,
      attachments,
      status,
      author_id: user?.id,
    };

    let error;
    if (id) {
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update(postData)
        .eq('id', id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('blog_posts')
        .insert([postData]);
      error = insertError;
    }

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(id ? 'Post updated!' : 'Post created!');
      navigate('/dashboard?tab=my-posts');
    }
    setLoading(false);
  };

  if (fetching) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{id ? 'Edit Story' : 'New Story'}</h1>
        <div className="flex items-center space-x-2">
          <Select value={status} onValueChange={(v: any) => setStatus(v)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSubmit} className="bg-red-600 hover:bg-red-700" disabled={loading}>
            <Save className="mr-2 h-4 w-4" /> {id ? 'Update' : 'Publish'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-[2rem] border-stone-100 shadow-sm">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-lg font-bold">Story Title</Label>
                <Input 
                  id="title" 
                  placeholder="Enter a catchy title..." 
                  className="text-2xl font-bold h-14 border-none bg-stone-50 rounded-2xl focus-visible:ring-red-600"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content" className="text-lg font-bold">Content (Markdown Supported)</Label>
                <Textarea 
                  id="content" 
                  placeholder="Tell your story..." 
                  className="min-h-[500px] border-none bg-stone-50 rounded-2xl p-6 focus-visible:ring-red-600 text-lg leading-relaxed"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-[2rem] border-stone-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-stone-50 border-b border-stone-100">
              <CardTitle className="text-sm uppercase tracking-widest text-stone-500">Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="art">Art</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                    <SelectItem value="landmark">Landmark</SelectItem>
                    <SelectItem value="culture">Culture</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Thumbnail Image</Label>
                {thumbnailUrl ? (
                  <div className="relative rounded-2xl overflow-hidden aspect-video group">
                    <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setThumbnailUrl('')}
                      className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-stone-200 rounded-2xl aspect-video flex flex-col items-center justify-center text-stone-400 hover:border-red-600 hover:text-red-600 transition-colors cursor-pointer relative">
                    <ImageIcon size={32} className="mb-2" />
                    <span className="text-xs font-medium">Upload Thumbnail</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={(e) => handleFileUpload(e, 'thumbnail')}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <Label>Attachments (PDF, Docs)</Label>
                <div className="space-y-2">
                  {attachments.map((url, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-100">
                      <div className="flex items-center space-x-2 truncate">
                        <FileText size={16} className="text-stone-400 shrink-0" />
                        <span className="text-xs truncate">{url.split('/').pop()}</span>
                      </div>
                      <button onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))}>
                        <X size={14} className="text-stone-400 hover:text-red-600" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="relative">
                  <Button variant="outline" className="w-full rounded-xl border-stone-200">
                    <Upload className="mr-2 h-4 w-4" /> Add Attachment
                  </Button>
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={(e) => handleFileUpload(e, 'attachment')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
