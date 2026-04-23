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
import { Image as ImageIcon, FileText, X, Upload, Save, ArrowLeft, Sparkles, Wand2 } from 'lucide-react';
import { motion } from 'motion/react';
import { chatWithAI } from '@/src/lib/ai';

export default function BlogEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('architects');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAIGenerate = async () => {
    if (!title) {
      toast.error('Please enter a title first');
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = `Write an architectural blog post about "${title}" for a website called ArchiChina. 
      The category is ${category}. 
      Format the output in Markdown. 
      Include an introduction, several sections with headings, and a conclusion. 
      Make it engaging and informative for people interested in Chinese architecture, structural engineering, or history.
      Keep it between 500-800 words.`;

      const generatedContent = await chatWithAI([
        { role: 'system', content: 'You are an expert architectural historian and engineer specializing in Chinese construction methods and design.' },
        { role: 'user', content: prompt }
      ]);

      setContent(generatedContent);
      toast.success('Narrative inscribed by the Magic Scribe!');
    } catch (err: any) {
      console.error('AI Generation error:', err);
      toast.error('The Magic Scribe is currently unavailable: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

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

  if (fetching) return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="font-serif italic text-2xl animate-pulse">Preparing the parchment...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8"
      >
        <div className="flex flex-col items-start space-y-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="group font-serif italic text-lg text-muted-foreground hover:text-primary">
            <ArrowLeft className="mr-3 h-5 w-5 group-hover:-translate-x-2 transition-transform" /> Back to Dashboard
          </Button>
          <div className="flex items-center space-x-4 text-primary">
            <Sparkles className="h-6 w-6" />
            <span className="font-serif italic text-xl font-bold uppercase tracking-widest">Scribe's Chamber 书房</span>
          </div>
          <h1 className="text-6xl font-serif font-bold tracking-tight">{id ? 'Refine Story' : 'Inscribe New Story'}</h1>
        </div>
        
        <div className="flex items-center space-x-4 bg-card p-4 rounded-full border border-border shadow-xl">
          <Select value={status} onValueChange={(v: any) => setStatus(v)}>
            <SelectTrigger className="w-[140px] h-12 rounded-full border-none bg-muted/50 font-serif italic">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-border bg-popover shadow-xl">
              <SelectItem value="draft" className="font-serif italic">Draft 草稿</SelectItem>
              <SelectItem value="published" className="font-serif italic">Published 发布</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90 text-white rounded-full h-12 px-10 text-lg font-serif italic shadow-lg shadow-primary/20 group" disabled={loading}>
            {loading ? 'Inscribing...' : (
              <>
                <Save className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" /> {id ? 'Update' : 'Publish'}
              </>
            )}
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-8"
        >
          <Card className="rounded-[3rem] border-none shadow-2xl bg-card overflow-hidden">
            <CardContent className="p-12 space-y-10">
              <div className="space-y-4">
                <Label htmlFor="title" className="text-2xl font-serif font-bold italic ml-4">The Title 标题</Label>
                <Input 
                  id="title" 
                  placeholder="Enter a title that resonates..." 
                  className="text-4xl font-serif font-bold h-20 border-none bg-muted/30 rounded-3xl px-8 focus-visible:ring-primary focus-visible:bg-muted/50 transition-all"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center ml-4">
                  <Label htmlFor="content" className="text-2xl font-serif font-bold italic">The Narrative 叙述</Label>
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={handleAIGenerate}
                    disabled={isGenerating || !title}
                    className="rounded-full border-primary/30 text-primary hover:bg-primary/5 font-serif italic"
                  >
                    {isGenerating ? (
                      <span className="flex items-center"><Wand2 className="mr-2 h-4 w-4 animate-pulse" /> Channeling...</span>
                    ) : (
                      <span className="flex items-center"><Wand2 className="mr-2 h-4 w-4" /> Magic Scribe AI</span>
                    )}
                  </Button>
                </div>
                <Textarea 
                  id="content" 
                  placeholder="Unfold your story here... (Markdown is supported)" 
                  className="min-h-[600px] border-none bg-muted/30 rounded-[2.5rem] p-10 focus-visible:ring-primary focus-visible:bg-muted/50 transition-all text-xl font-serif italic leading-relaxed"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-8"
        >
          <Card className="rounded-[3rem] border-none shadow-2xl bg-card overflow-hidden">
            <CardHeader className="bg-muted/30 p-8 border-b border-border">
              <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground font-serif font-bold">Scroll Settings 设置</CardTitle>
            </CardHeader>
            <CardContent className="p-10 space-y-10">
              <div className="space-y-4">
                <Label className="text-lg font-serif font-bold italic ml-2">Category 类别</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-14 rounded-2xl border-border bg-muted/30 font-serif italic text-lg px-6">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-border bg-popover shadow-xl">
                    <SelectItem value="architects" className="font-serif italic py-3">Architects 建筑师</SelectItem>
                    <SelectItem value="materials" className="font-serif italic py-3">Materials 材料</SelectItem>
                    <SelectItem value="history" className="font-serif italic py-3">History 历史</SelectItem>
                    <SelectItem value="modern" className="font-serif italic py-3">Modern 现代</SelectItem>
                    <SelectItem value="structural" className="font-serif italic py-3">Structural 结构</SelectItem>
                    <SelectItem value="gardens" className="font-serif italic py-3">Gardens 园林</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-6">
                <Label className="text-lg font-serif font-bold italic ml-2">Visual Essence 视觉</Label>
                {thumbnailUrl ? (
                  <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3] group shadow-lg">
                    <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button 
                        variant="destructive" 
                        size="icon"
                        onClick={() => setThumbnailUrl('')}
                        className="rounded-full h-12 w-12"
                      >
                        <X size={24} />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border rounded-[2rem] aspect-[4/3] flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all cursor-pointer relative group">
                    <div className="bg-muted/50 p-6 rounded-full mb-4 group-hover:scale-110 transition-transform">
                      <ImageIcon size={40} />
                    </div>
                    <span className="text-lg font-serif italic">Upload Thumbnail</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={(e) => handleFileUpload(e, 'thumbnail')}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <Label className="text-lg font-serif font-bold italic ml-2">Supplementary Scrolls 附件</Label>
                <div className="space-y-3">
                  {attachments.map((url, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border group"
                    >
                      <div className="flex items-center space-x-3 truncate">
                        <FileText size={20} className="text-primary shrink-0" />
                        <span className="text-sm font-serif italic truncate">{url.split('/').pop()}</span>
                      </div>
                      <button 
                        onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))}
                        className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </motion.div>
                  ))}
                </div>
                <div className="relative">
                  <Button variant="outline" className="w-full rounded-2xl h-14 border-border font-serif italic text-lg hover:border-primary hover:text-primary transition-all">
                    <Upload className="mr-3 h-5 w-5" /> Add Attachment
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
        </motion.div>
      </div>
    </div>
  );
}
