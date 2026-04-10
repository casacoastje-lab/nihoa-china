import { motion } from 'motion/react';
import { Button, buttonVariants } from '@/src/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Utensils, Palette, History, MapPin, Users } from 'lucide-react';

const categories = [
  { name: 'Food', icon: Utensils, color: 'bg-orange-100 text-orange-600', description: 'Explore the diverse flavors of Chinese cuisine.' },
  { name: 'Art', icon: Palette, color: 'bg-purple-100 text-purple-600', description: 'Discover traditional and modern Chinese arts.' },
  { name: 'History', icon: History, color: 'bg-amber-100 text-amber-600', description: 'Journey through thousands of years of heritage.' },
  { name: 'Landmarks', icon: MapPin, color: 'bg-red-100 text-red-600', description: 'Visit iconic sites from the Great Wall to modern skylines.' },
];

export default function Home() {
  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&q=80&w=2000" 
            alt="China Landscape" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-none mb-6">
              DISCOVER <br />
              <span className="text-red-500">CHINA</span> TOGETHER
            </h1>
            <p className="text-xl md:text-2xl text-stone-200 mb-8 font-light">
              Your gateway to authentic experiences, community insights, and cultural immersion in the Middle Kingdom.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 h-14 text-lg rounded-full">
                Start Exploring
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 px-8 h-14 text-lg rounded-full">
                Join Community
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight mb-4">Explore by Category</h2>
          <p className="text-stone-500 max-w-2xl mx-auto">Dive deep into the aspects of China that interest you most.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group p-8 bg-white rounded-3xl border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <cat.icon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">{cat.name}</h3>
              <p className="text-stone-500 mb-4">{cat.description}</p>
              <Link to={`/blog?category=${cat.name.toLowerCase()}`} className="text-red-600 font-semibold flex items-center group-hover:gap-2 transition-all">
                Learn more <ArrowRight size={16} className="ml-1" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="bg-stone-100 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold tracking-tight mb-2">Latest from the Community</h2>
              <p className="text-stone-500">Stories and tips from travelers and locals.</p>
            </div>
            <Link to="/blog" className={buttonVariants({ variant: "ghost", className: "text-red-600 hover:text-red-700 font-bold" })}>
              View All Posts
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <img 
                  src={`https://picsum.photos/seed/china-blog-${i}/800/500`} 
                  alt="Blog Thumbnail" 
                  className="w-full h-48 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-red-600">Landmarks</span>
                    <span className="text-stone-300">•</span>
                    <span className="text-xs text-stone-500">Oct 12, 2023</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 line-clamp-2">Hidden Gems in the Hutongs of Beijing</h3>
                  <p className="text-stone-500 text-sm mb-6 line-clamp-3">
                    Discovering the narrow alleys and traditional courtyard houses that hold the true spirit of old Beijing...
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-stone-200" />
                      <span className="text-sm font-medium">Alex Chen</span>
                    </div>
                    <Link to="/blog/1" className="text-stone-900 font-bold text-sm hover:underline">Read More</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-red-600 rounded-[3rem] p-12 md:p-24 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
            <Users size={400} />
          </div>
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Make an Impact: Volunteer Programs</h2>
            <p className="text-xl text-red-100 mb-10 leading-relaxed">
              Join our community-led initiatives to support local schools, preserve cultural heritage, and build bridges between cultures.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                <h4 className="font-bold mb-2">Teaching Assistant</h4>
                <p className="text-sm text-red-500">Help students practice English in rural provinces.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                <h4 className="font-bold mb-2">Heritage Guardian</h4>
                <p className="text-sm text-red-500">Assist in documenting traditional crafts and stories.</p>
              </div>
            </div>
            <Button size="lg" className="bg-white text-red-600 hover:bg-stone-100 px-8 h-14 text-lg rounded-full font-bold">
              Explore Programs
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
