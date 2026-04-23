import { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { Badge } from '@/src/components/ui/badge';
import { 
  Trophy, 
  Star, 
  RotateCcw, 
  History, 
  Palette, 
  Info,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';

// --- Game Data ---

const timelineData = [
  { id: 'dougong', name: 'Dougong Brackets', year: 'Ancient', info: 'Interlocking wooden brackets supporting eaves without nails.' },
  { id: 'pagodas', name: 'Timber Pagodas', year: '1056 AD', info: 'Sakyamuni Pagoda, fully timber structure surviving earthquakes.' },
  { id: 'mortar', name: 'Sticky Rice Mortar', year: 'Ming Dynasty', info: 'Organic compound used to build the Great Wall.' },
  { id: 'gardens', name: 'Classical Gardens', year: '11th Century', info: 'Integration of pavilions, water, and landscaping in Suzhou.' },
  { id: 'steel', name: 'Diagrid Exoskeleton', year: '2012', info: 'CCTV Headquarters looping structural steel.' },
  { id: 'sustainable', name: 'Vortex Towers', year: '2015', info: 'Shanghai Tower 120-degree twist reducing wind loads.' },
];

const quizData = [
  {
    question: "What ancient joining technique is famous for allowing entire palaces to be built without a single nail?",
    options: ["Sticky Rice Mortar", "Rammed Earth", "Dougong Brackets", "Steel Girders"],
    answer: "Dougong Brackets"
  },
  {
    question: "Which modern architect is known as the 'father of modern Chinese architecture' for preserving the Forbidden City?",
    options: ["I.M. Pei", "Wang Shu", "Liang Sicheng", "Lin Huiyin"],
    answer: "Liang Sicheng"
  },
  {
    question: "What innovative organic material was combined with lime to give the Great Wall exceptional durability?",
    options: ["Bamboo Fiber", "Sticky Rice Soup", "Silk Threads", "River Clay"],
    answer: "Sticky Rice Soup"
  }
];

// --- Sub-Components ---

function TimelineSorter() {
  const [items, setItems] = useState(() => [...timelineData].sort(() => Math.random() - 0.5));
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const checkOrder = () => {
    const correctIds = timelineData.map(d => d.id);
    const currentIds = items.map(d => d.id);
    const win = JSON.stringify(correctIds) === JSON.stringify(currentIds);
    setIsCorrect(win);
    if (win) toast.success('Master Builder! You got the timeline right.');
    else toast.error('Structure collapsed. Try moving them around!');
  };

  return (
    <div className="space-y-8">
      <div className="bg-red-50 p-6 rounded-3xl border border-red-100 flex items-start space-x-4">
        <Info className="text-red-600 shrink-0 mt-1" />
        <p className="text-sm text-red-900">Drag and drop the structural achievements into their chronological order of invention or construction.</p>
      </div>

      <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-3">
        {items.map((item) => (
          <Reorder.Item
            key={item.id}
            value={item}
            className="p-5 bg-white border border-stone-200 rounded-2xl cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center font-bold text-stone-400 group-hover:text-red-600 transition-colors">
                ::
              </div>
              <div>
                <h4 className="font-bold text-lg">{item.name}</h4>
                <p className="text-xs text-stone-500">{item.info}</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-stone-100">{item.year}</Badge>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <div className="flex justify-center pt-4">
        <Button 
          onClick={checkOrder}
          className="bg-red-600 hover:bg-red-700 rounded-full h-12 px-12 text-lg font-bold text-white"
        >
          Verify Timeline
        </Button>
      </div>
    </div>
  );
}

// --- Main Page ---

export default function Learn() {
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizStatus, setQuizStatus] = useState<'playing' | 'finished'>('playing');

  const handleQuizAnswer = (selected: string) => {
    if (selected === quizData[quizIndex].answer) {
      setQuizScore(quizScore + 1);
      toast.success('Correct!');
    } else {
      toast.error('Wrong answer!');
    }

    if (quizIndex < quizData.length - 1) {
      setQuizIndex(quizIndex + 1);
    } else {
      setQuizStatus('finished');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 sm:mb-20 gap-8 sm:gap-12"
      >
        <div className="text-left max-w-2xl space-y-4 sm:space-y-6">
          <div className="inline-flex items-center space-x-4 text-primary">
            <div className="h-px w-8 sm:w-12 bg-primary" />
            <span className="font-serif italic text-lg sm:text-xl font-bold uppercase tracking-widest">Interactive Models 互动模型</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-serif font-bold tracking-tight leading-[0.85]">
            STRUCTURE <span className="text-primary italic">LAB</span> <br /> 
          </h1>
          <p className="text-xl sm:text-2xl font-serif text-muted-foreground leading-relaxed italic">
            Test your knowledge of architectural history and engineering marvels.
          </p>
        </div>
        <div className="flex gap-4 sm:gap-6 w-full md:w-auto">
          <Card className="p-6 sm:p-8 bg-card rounded-[2rem] sm:rounded-[2.5rem] border-none shadow-xl flex flex-col items-center justify-center flex-1 md:min-w-[160px]">
            <Trophy className="text-primary mb-3 sm:mb-4 h-8 w-8 sm:h-10 sm:w-10" />
            <div className="text-3xl sm:text-4xl font-serif font-bold italic">1,240</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest font-bold mt-1">Total XP</div>
          </Card>
          <Card className="p-6 sm:p-8 bg-primary text-white rounded-[2rem] sm:rounded-[2.5rem] border-none shadow-xl shadow-primary/20 flex flex-col items-center justify-center flex-1 md:min-w-[160px]">
            <Star className="text-white mb-3 sm:mb-4 h-8 w-8 sm:h-10 sm:w-10" />
            <div className="text-3xl sm:text-4xl font-serif font-bold italic">Level 4</div>
            <div className="text-[10px] sm:text-xs text-white/60 uppercase tracking-widest font-bold mt-1">Master Builder</div>
          </Card>
        </div>
      </motion.div>

      <Tabs defaultValue="history" className="space-y-8 sm:space-y-16 mt-6 sm:mt-10">
        <TabsList className="flex justify-start bg-transparent space-x-2 sm:space-x-4 h-auto overflow-x-auto pb-4 no-scrollbar border-b border-border">
          {[
            { value: 'history', label: 'Timeline 时间线', icon: History },
            { value: 'culture', label: 'Engineering Quiz 测试', icon: Palette },
          ].map((tab) => (
            <TabsTrigger 
              key={tab.value}
              value={tab.value} 
              className="rounded-full px-6 sm:px-10 py-3 sm:py-4 data-[state=active]:bg-primary data-[state=active]:text-white border border-border transition-all font-serif italic text-lg sm:text-xl whitespace-nowrap"
            >
              <tab.icon className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" /> {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <AnimatePresence mode="wait">
          {/* History Games */}
          <TabsContent key="history" value="history" className="outline-none">
            <div className="max-w-4xl mx-auto">
              <Card className="rounded-[2rem] sm:rounded-[3rem] border-none shadow-2xl overflow-hidden bg-card">
                <div className="bg-foreground text-background p-8 sm:p-12">
                  <div className="flex justify-between items-center mb-6 sm:mb-8">
                    <Badge className="bg-primary text-white rounded-full px-4 py-1 font-serif italic">Chronology</Badge>
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Engineering Challenge</span>
                  </div>
                  <h3 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight">Structural Timeline 建筑时间线</h3>
                  <p className="text-muted-foreground text-lg sm:text-xl font-serif italic mt-4">Order the architectural achievements from earliest to latest invention or construction.</p>
                </div>
                <CardContent className="p-8 sm:p-12">
                  <TimelineSorter />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Culture Games */}
          <TabsContent key="culture" value="culture" className="outline-none">
            <div className="max-w-2xl mx-auto">
              <Card className="rounded-[2rem] sm:rounded-[3rem] border-none shadow-2xl overflow-hidden bg-card">
                <div className="bg-primary text-white p-8 sm:p-12">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] opacity-80">Question {quizIndex + 1} of {quizData.length}</span>
                    <Badge variant="secondary" className="bg-white/20 text-white border-none font-serif italic">Architect Quiz</Badge>
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-serif font-bold leading-tight tracking-tight">
                    {quizStatus === 'playing' ? quizData[quizIndex].question : 'Quiz Completed!'}
                  </h3>
                </div>
                <CardContent className="p-8 sm:p-12">
                  {quizStatus === 'playing' ? (
                    <div className="space-y-4 sm:space-y-6">
                      {quizData[quizIndex].options.map((option) => (
                        <Button
                          key={option}
                          variant="outline"
                          className="w-full h-20 sm:h-24 justify-between px-6 sm:px-10 text-lg sm:text-xl font-serif italic rounded-[1.5rem] sm:rounded-3xl border-2 border-border hover:border-primary hover:bg-primary/5 group transition-all text-left flex items-center justify-start overflow-hidden whitespace-normal md:whitespace-nowrap"
                          onClick={() => handleQuizAnswer(option)}
                        >
                          <span className="truncate">{option}</span>
                          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-2 shrink-0 ml-auto" />
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center space-y-8 sm:space-y-10 py-8 sm:py-12">
                      <div className="relative inline-block">
                        <Trophy className="h-32 w-32 sm:h-40 sm:w-40 text-primary mx-auto" />
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-foreground text-background w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-serif font-bold text-xl sm:text-2xl border-4 border-card shadow-xl"
                        >
                          {quizScore}
                        </motion.div>
                      </div>
                      <div className="space-y-3 sm:space-y-4">
                        <h3 className="text-3xl sm:text-4xl font-serif font-bold italic">Excellent Work! 太棒了!</h3>
                        <p className="text-lg sm:text-xl font-serif italic text-muted-foreground">You've mastered the basics of Chinese architecture.</p>
                      </div>
                      <Button 
                        onClick={() => {
                          setQuizIndex(0);
                          setQuizScore(0);
                          setQuizStatus('playing');
                        }}
                        className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white rounded-full px-10 sm:px-16 py-6 sm:py-8 text-lg sm:text-xl font-serif italic shadow-xl shadow-primary/20"
                      >
                        <RotateCcw className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" /> Restart Quiz 重新开始
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
