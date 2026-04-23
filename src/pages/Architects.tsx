import { motion } from 'motion/react';
import { User, Building2, TrendingUp, Compass, ArrowRight } from 'lucide-react';

const architects = [
  {
    key: 'wang-shu',
    name: 'Wang Shu',
    zh: '王澍',
    studio: 'Amateur Architecture Studio',
    achievement: '2012 Pritzker Architecture Prize',
    description: 'The first Chinese citizen to win the Pritzker Prize, known for reusing materials from demolished villages and incorporating traditional craftsmanship.',
    projects: ['Ningbo Museum', 'Xiangshan Campus, CAA', 'Fuyang Cultural Complex'],
    image: 'https://sefqcqhksupblrprcuzi.supabase.co/storage/v1/object/public/3dfile/Wang%20Shu%20pictuer.jpg'
  },
  {
    key: 'liu-jiakun',
    name: 'Liu Jiakun',
    zh: '刘家琨',
    studio: 'Jiakun Architects',
    achievement: '2025 Pritzker Architecture Prize',
    description: 'Celebrated for his focus on social equity, blending traditional elements with modern design while highlighting the tectonic reality of construction.',
    projects: ['Luyeyuan Stone Art Museum', 'Hu Huishan Memorial', 'West Village Basis Yard'],
    image: 'https://sefqcqhksupblrprcuzi.supabase.co/storage/v1/object/public/3dfile/liu%20jiakun%20pictuer.jpg'
  },
  {
    key: 'yung-ho-chang',
    name: 'Yung Ho Chang',
    zh: '张永和',
    studio: 'Atelier Feichang Jianzhu',
    achievement: 'First Independent Architect',
    description: 'Often considered the first independent architect in modern China, recognized for introducing contemporary conceptual design and educational reform.',
    projects: ['Split House', 'Jishou Art Museum', 'Vertical Glass House'],
    image: 'https://sefqcqhksupblrprcuzi.supabase.co/storage/v1/object/public/3dfile/Yung%20Ho%20Chang.webp'
  },
  {
    key: 'lin-huiyin',
    name: 'Lin Huiyin',
    zh: '林徽因',
    studio: 'Historic Preservation Pioneer',
    achievement: 'China\'s First Female Modern Architect',
    description: 'Known as China\'s first female modern architect, who contributed significantly to the preservation and study of Chinese architecture alongside her husband, Liang Sicheng.',
    projects: ['Monument to the People\'s Heroes (Design)', 'National Emblem of China (Co-design)'],
    image: 'https://sefqcqhksupblrprcuzi.supabase.co/storage/v1/object/public/3dfile/Lin_Huiyin_portrait.jpg'
  },
  {
    key: 'lu-wenyu',
    name: 'Lu Wenyu',
    zh: '陆文宇',
    studio: 'Amateur Architecture Studio',
    achievement: 'Co-founder & Visionary',
    description: 'Playing a crucial role in developing the firm’s unique approach against "soulless architecture" and focusing on context, nature, and human-scale craftsmanship.',
    projects: ['Ningbo History Museum (Co-design)', 'Wa Shan Guesthouse (Co-design)'],
    image: 'https://sefqcqhksupblrprcuzi.supabase.co/storage/v1/object/public/3dfile/lu%20wenyu.jpg'
  },
  {
    key: 'ma-yansong',
    name: 'Ma Yansong',
    zh: '马岩松',
    studio: 'MAD Architects',
    achievement: 'Pioneer of "Shanshui City"',
    description: 'Creating organic, futuristic designs that merge the natural environment with dense urban landscapes, bringing the concept of "Shanshui" into the 21st century.',
    projects: ['Absolute Towers (Marilyn Monroe Towers)', 'Harbin Opera House', 'Lucas Museum of Narrative Art'],
    image: 'https://sefqcqhksupblrprcuzi.supabase.co/storage/v1/object/public/3dfile/Ma%20yansong.webp'
  },
  {
    key: 'zhang-ke',
    name: 'Zhang Ke',
    zh: '张轲',
    studio: 'standardarchitecture',
    achievement: 'Aga Khan Award Winner',
    description: 'Known for contemporary, small-scale interventions in urban and rural contexts, respecting history while inserting highly modern, functional spaces.',
    projects: ['Hutong Children’s Library', 'Micro-Hutong', 'Novartis Campus Building'],
    image: 'https://sefqcqhksupblrprcuzi.supabase.co/storage/v1/object/public/3dfile/zhang%20ke.jpg'
  },
  {
    key: 'li-xinggang',
    name: 'Li Xinggang',
    zh: '李兴钢',
    studio: 'Atelier Li Xinggang',
    achievement: 'Master Planner',
    description: 'Known for work on the "Chineseness" of architecture, seamlessly integrating modern engineering with profound structural poetry and cultural resonance.',
    projects: ['Olympic Green Master Plan', 'Jixi Museum', 'Third Space'],
    image: 'https://sefqcqhksupblrprcuzi.supabase.co/storage/v1/object/public/3dfile/Li%20Xinggang.jpg'
  },
  {
    key: 'neri-hu',
    name: 'Lyndon Neri & Rossana Hu',
    zh: '郭锡恩 & 胡如珊',
    studio: 'Neri&Hu',
    achievement: 'Interdisciplinary Masters',
    description: 'Interdisciplinary designers blending international design with traditional Chinese research to create layered, culturally informed contemporary spaces.',
    projects: ['The Waterhouse at South Bund', 'Suzhou Chapel', 'Aranya Art Center'],
    image: 'https://sefqcqhksupblrprcuzi.supabase.co/storage/v1/object/public/3dfile/Lyndon%20Neri%20&%20Rossana%20Hu.jpg'
  },
  {
    key: 'genarchitects',
    name: 'Fan Beilei, Kong Rui & Xue Zhe',
    zh: '范蓓蕾, 孔锐 & 薛哲',
    studio: 'genarchitects',
    achievement: 'Site-Specific Innovators',
    description: 'Focused on genuine, site-specific, and constructive approaches to architectural reality, valuing the authenticity of space over pure form.',
    projects: ['Dingli Art Museum', 'Qinglongwu Capsule Hotel and Bookstore'],
    image: 'https://sefqcqhksupblrprcuzi.supabase.co/storage/v1/object/public/3dfile/Fan%20Beilei,%20Kong%20Rui%20&%20Xue%20Zhe.jpg'
  }
];

export default function Architects() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-20 gap-8 sm:gap-12"
      >
        <div className="space-y-4 sm:space-y-6 max-w-2xl">
          <div className="inline-flex items-center space-x-4 text-primary">
            <div className="h-px w-8 sm:w-12 bg-primary" />
            <span className="font-serif italic text-lg sm:text-xl font-bold uppercase tracking-widest">Visionaries of the Built Environment</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-serif font-bold tracking-tight leading-[0.85]">
            PIONEERING <br /> <span className="text-primary italic">CHINESE ARCHITECTS</span>
          </h1>
          <p className="text-xl sm:text-2xl font-serif text-muted-foreground leading-relaxed italic">
            From restoring the ancient logic of timber to redefining the skylines of global megacities. Discover the minds shaping modern Chinese architecture.
          </p>
        </div>
      </motion.div>

      {/* Grid Section */}
      <section className="py-10 bg-background relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 sm:gap-16">
            {architects.map((architect, idx) => (
              <motion.div
                key={architect.key}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx % 2 === 0 ? 0 : 0.2 }}
                className="group flex flex-col xl:flex-row bg-card rounded-[2rem] overflow-hidden border border-border shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Abstract/Style Representation */}
                <div className="xl:w-2/5 aspect-[4/3] xl:aspect-auto relative overflow-hidden bg-muted">
                  <div className="absolute inset-0 bg-gradient-to-t xl:bg-gradient-to-r from-card/80 to-transparent z-10" />
                  <img 
                    src={architect.image} 
                    alt={`Style representation for ${architect.name}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute top-4 left-4 z-20 xl:hidden">
                    <span className="px-3 py-1 bg-black/40 backdrop-blur-md text-white rounded-full text-xs font-bold uppercase tracking-widest border border-white/20">
                      {architect.studio}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-8 sm:p-10 flex flex-col">
                  <div className="mb-6">
                    <div className="hidden xl:inline-block mb-4 px-3 py-1 bg-muted text-muted-foreground rounded-full text-[10px] font-bold uppercase tracking-widest border border-border">
                      {architect.studio}
                    </div>
                    <div className="flex items-baseline justify-between mb-2">
                      <h2 className="text-3xl font-serif font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
                        {architect.name}
                      </h2>
                      <span className="text-lg font-serif italic text-muted-foreground">
                        {architect.zh}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-4 flex items-center">
                      <TrendingUp className="mr-2 h-4 w-4" /> {architect.achievement}
                    </p>
                    <p className="text-muted-foreground leading-relaxed font-serif text-base">
                      {architect.description}
                    </p>
                  </div>

                  {/* Projects Section */}
                  <div className="mt-auto pt-6 border-t border-border">
                    <h3 className="text-xs uppercase tracking-widest font-bold text-foreground flex items-center mb-4">
                      <Building2 className="mr-2 h-4 w-4 text-primary" /> Key Works
                    </h3>
                    <ul className="space-y-3">
                      {architect.projects.map((project, i) => (
                        <li key={i} className="flex items-start">
                          <span className="mr-2 mt-1 w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0" />
                          <span className="text-sm font-medium text-muted-foreground">{project}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
