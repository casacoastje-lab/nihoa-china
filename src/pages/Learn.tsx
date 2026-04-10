import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { Badge } from '@/src/components/ui/badge';
import { Trophy, Gamepad2, Book, Star, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const pinyinGameData = [
  { char: '你好', pinyin: 'Nǐ hǎo', meaning: 'Hello' },
  { char: '谢谢', pinyin: 'Xièxiè', meaning: 'Thank you' },
  { char: '中国', pinyin: 'Zhōngguó', meaning: 'China' },
  { char: '北京', pinyin: 'Běijīng', meaning: 'Beijing' },
  { char: '长城', pinyin: 'Chángchéng', meaning: 'Great Wall' },
];

const quizData = [
  {
    question: "Which color is traditionally associated with good luck and joy in China?",
    options: ["Red", "Yellow", "Blue", "White"],
    answer: "Red"
  },
  {
    question: "What is the capital city of China?",
    options: ["Shanghai", "Beijing", "Guangzhou", "Xi'an"],
    answer: "Beijing"
  },
  {
    question: "Which animal is NOT part of the Chinese Zodiac?",
    options: ["Dragon", "Tiger", "Elephant", "Rabbit"],
    answer: "Elephant"
  }
];

export default function Learn() {
  const [pinyinIndex, setPinyinIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'finished'>('playing');
  
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizStatus, setQuizStatus] = useState<'playing' | 'finished'>('playing');

  const handlePinyinAnswer = (selected: string) => {
    if (selected === pinyinGameData[pinyinIndex].pinyin) {
      setScore(score + 1);
      toast.success('Correct!');
    } else {
      toast.error(`Incorrect. It's ${pinyinGameData[pinyinIndex].pinyin}`);
    }

    if (pinyinIndex < pinyinGameData.length - 1) {
      setPinyinIndex(pinyinIndex + 1);
    } else {
      setGameStatus('finished');
    }
  };

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold tracking-tighter mb-4">LEARN <span className="text-red-600">& PLAY</span></h1>
        <p className="text-stone-500 max-w-2xl mx-auto">Master Chinese language and culture through interactive challenges.</p>
      </div>

      <Tabs defaultValue="pinyin" className="space-y-12">
        <TabsList className="flex justify-center bg-transparent space-x-4 h-auto">
          <TabsTrigger value="pinyin" className="rounded-full px-8 py-3 data-[state=active]:bg-red-600 data-[state=active]:text-white border border-stone-200">
            Pinyin Matcher
          </TabsTrigger>
          <TabsTrigger value="quiz" className="rounded-full px-8 py-3 data-[state=active]:bg-red-600 data-[state=active]:text-white border border-stone-200">
            Culture Quiz
          </TabsTrigger>
          <TabsTrigger value="characters" className="rounded-full px-8 py-3 data-[state=active]:bg-red-600 data-[state=active]:text-white border border-stone-200">
            Character Lab
          </TabsTrigger>
        </TabsList>

        {/* Pinyin Game */}
        <TabsContent value="pinyin">
          <div className="max-w-2xl mx-auto">
            <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-white">
              <CardHeader className="bg-stone-900 text-white p-10 text-center">
                <div className="flex justify-between items-center mb-6">
                  <Badge className="bg-red-600">Level 1</Badge>
                  <div className="flex items-center space-x-2">
                    <Star className="text-yellow-400 fill-yellow-400 h-4 w-4" />
                    <span className="font-bold">{score}/{pinyinGameData.length}</span>
                  </div>
                </div>
                <CardTitle className="text-7xl font-bold tracking-tighter mb-2">
                  {gameStatus === 'playing' ? pinyinGameData[pinyinIndex].char : 'Game Over!'}
                </CardTitle>
                <p className="text-stone-400 uppercase tracking-widest text-xs font-bold">
                  {gameStatus === 'playing' ? 'What is the correct pinyin?' : 'Well done explorer!'}
                </p>
              </CardHeader>
              <CardContent className="p-10">
                <AnimatePresence mode="wait">
                  {gameStatus === 'playing' ? (
                    <motion.div 
                      key={pinyinIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                      {pinyinGameData.map((item) => (
                        <Button
                          key={item.pinyin}
                          variant="outline"
                          className="h-20 text-xl font-bold rounded-2xl border-2 border-stone-100 hover:border-red-600 hover:bg-red-50 transition-all"
                          onClick={() => handlePinyinAnswer(item.pinyin)}
                        >
                          {item.pinyin}
                        </Button>
                      ))}
                    </motion.div>
                  ) : (
                    <div className="text-center space-y-6">
                      <Trophy className="mx-auto h-24 w-24 text-yellow-500" />
                      <h3 className="text-3xl font-bold">Your Score: {score}</h3>
                      <Button 
                        onClick={() => {
                          setPinyinIndex(0);
                          setScore(0);
                          setGameStatus('playing');
                        }}
                        className="bg-red-600 hover:bg-red-700 rounded-full px-8 h-12"
                      >
                        <RotateCcw className="mr-2 h-4 w-4" /> Play Again
                      </Button>
                    </div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Culture Quiz */}
        <TabsContent value="quiz">
          <div className="max-w-2xl mx-auto">
            <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-white">
              <CardHeader className="bg-red-600 text-white p-10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-80">Question {quizIndex + 1} of {quizData.length}</span>
                  <Badge variant="secondary" className="bg-white/20 text-white border-none">Culture</Badge>
                </div>
                <CardTitle className="text-2xl font-bold leading-tight">
                  {quizStatus === 'playing' ? quizData[quizIndex].question : 'Quiz Completed!'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                {quizStatus === 'playing' ? (
                  <div className="space-y-4">
                    {quizData[quizIndex].options.map((option) => (
                      <Button
                        key={option}
                        variant="outline"
                        className="w-full h-16 justify-start px-6 text-lg font-medium rounded-2xl border-stone-100 hover:border-red-600 hover:bg-red-50"
                        onClick={() => handleQuizAnswer(option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center space-y-6">
                    <div className="text-6xl font-bold text-red-600">{quizScore}/{quizData.length}</div>
                    <p className="text-stone-500">You're becoming a true China expert!</p>
                    <Button 
                      onClick={() => {
                        setQuizIndex(0);
                        setQuizScore(0);
                        setQuizStatus('playing');
                      }}
                      className="bg-red-600 hover:bg-red-700 rounded-full px-8 h-12"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" /> Restart Quiz
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Character Lab */}
        <TabsContent value="characters">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="rounded-[2.5rem] border-stone-100 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Book className="mr-2 h-5 w-5 text-red-600" /> Character of the Day
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center p-10">
                <div className="text-9xl font-bold text-stone-900 mb-6">家</div>
                <h3 className="text-2xl font-bold mb-2">Jiā</h3>
                <p className="text-stone-500 italic mb-6">Meaning: Family / Home</p>
                <div className="flex justify-center space-x-2">
                  <Badge variant="outline">10 Strokes</Badge>
                  <Badge variant="outline">HSK 1</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2.5rem] border-stone-100 shadow-sm bg-stone-900 text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="mr-2 h-5 w-5 text-yellow-400" /> Learning Path
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold">Basics: Greetings</h4>
                    <p className="text-xs text-stone-400">Completed on Oct 10</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-2xl border border-white/20">
                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                    <RotateCcw size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold">Numbers & Time</h4>
                    <p className="text-xs text-stone-400">In Progress - 60%</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/10 opacity-50">
                  <div className="w-10 h-10 rounded-full bg-stone-700 flex items-center justify-center">
                    <Star size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold">Ordering Food</h4>
                    <p className="text-xs text-stone-400">Locked</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
