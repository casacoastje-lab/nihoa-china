import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { Badge } from '@/src/components/ui/badge';
import { 
  Trophy, 
  Gamepad2, 
  Book, 
  Star, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  History, 
  Languages, 
  Palette, 
  Timer,
  Info,
  ChevronRight,
  ArrowRight,
  Volume2,
  RefreshCw,
  LayoutGrid,
  CreditCard,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

// --- Game Data ---

const hsk1Data = [
  { chinese: '爱', pinyin: 'ài', meaning: 'love' },
  { chinese: '八', pinyin: 'bā', meaning: 'eight' },
  { chinese: '爸爸', pinyin: 'bàba', meaning: 'father' },
  { chinese: '杯子', pinyin: 'bēizi', meaning: 'cup' },
  { chinese: '北京', pinyin: 'Běijīng', meaning: 'Beijing' },
  { chinese: '本', pinyin: 'běn', meaning: 'measure word (books)' },
  { chinese: '不', pinyin: 'bù', meaning: 'no / not' },
  { chinese: '不客气', pinyin: 'bú kèqi', meaning: "you're welcome" },
  { chinese: '菜', pinyin: 'cài', meaning: 'dish / food' },
  { chinese: '茶', pinyin: 'chá', meaning: 'tea' },
  { chinese: '吃', pinyin: 'chī', meaning: 'eat' },
  { chinese: '出租车', pinyin: 'chūzūchē', meaning: 'taxi' },
  { chinese: '打电话', pinyin: 'dǎ diànhuà', meaning: 'make a phone call' },
  { chinese: '大', pinyin: 'dà', meaning: 'big' },
  { chinese: '的', pinyin: 'de', meaning: 'possessive particle' },
  { chinese: '点', pinyin: 'diǎn', meaning: 'o’clock / point' },
  { chinese: '电脑', pinyin: 'diànnǎo', meaning: 'computer' },
  { chinese: '电视', pinyin: 'diànshì', meaning: 'TV' },
  { chinese: '电影', pinyin: 'diànyǐng', meaning: 'movie' },
  { chinese: '东西', pinyin: 'dōngxi', meaning: 'things' },
  { chinese: '都', pinyin: 'dōu', meaning: 'all' },
  { chinese: '读', pinyin: 'dú', meaning: 'read' },
  { chinese: '对不起', pinyin: 'duìbuqǐ', meaning: 'sorry' },
  { chinese: '多', pinyin: 'duō', meaning: 'many' },
  { chinese: '多少', pinyin: 'duōshao', meaning: 'how many' },
  { chinese: '儿子', pinyin: 'érzi', meaning: 'son' },
  { chinese: '二', pinyin: 'èr', meaning: 'two' },
  { chinese: '饭店', pinyin: 'fàndiàn', meaning: 'restaurant' },
  { chinese: '飞机', pinyin: 'fēijī', meaning: 'airplane' },
  { chinese: '分钟', pinyin: 'fēnzhōng', meaning: 'minute' },
  { chinese: '高兴', pinyin: 'gāoxìng', meaning: 'happy' },
  { chinese: '个', pinyin: 'gè', meaning: 'general measure word' },
  { chinese: '工作', pinyin: 'gōngzuò', meaning: 'work' },
  { chinese: '狗', pinyin: 'gǒu', meaning: 'dog' },
  { chinese: '汉语', pinyin: 'Hànyǔ', meaning: 'Chinese language' },
  { chinese: '好', pinyin: 'hǎo', meaning: 'good' },
  { chinese: '号', pinyin: 'hào', meaning: 'number / date' },
  { chinese: '喝', pinyin: 'hē', meaning: 'drink' },
  { chinese: '和', pinyin: 'hé', meaning: 'and' },
  { chinese: '很', pinyin: 'hěn', meaning: 'very' },
  { chinese: '后面', pinyin: 'hòumiàn', meaning: 'behind' },
  { chinese: '回', pinyin: 'huí', meaning: 'return' },
  { chinese: '会', pinyin: 'huì', meaning: 'can / know how' },
  { chinese: '几', pinyin: 'jǐ', meaning: 'how many' },
  { chinese: '家', pinyin: 'jiā', meaning: 'home' },
  { chinese: '叫', pinyin: 'jiào', meaning: 'call / name' },
  { chinese: '今天', pinyin: 'jīntiān', meaning: 'today' },
  { chinese: '九', pinyin: 'jiǔ', meaning: 'nine' },
  { chinese: '开', pinyin: 'kāi', meaning: 'open' },
  { chinese: '看', pinyin: 'kàn', meaning: 'look / watch' },
  { chinese: '看见', pinyin: 'kànjiàn', meaning: 'see' },
  { chinese: '块', pinyin: 'kuài', meaning: 'yuan (money unit)' },
  { chinese: '来', pinyin: 'lái', meaning: 'come' },
  { chinese: '老师', pinyin: 'lǎoshī', meaning: 'teacher' },
  { chinese: '了', pinyin: 'le', meaning: 'particle (past/change)' },
  { chinese: '冷', pinyin: 'lěng', meaning: 'cold' },
  { chinese: '里', pinyin: 'lǐ', meaning: 'inside' },
  { chinese: '六', pinyin: 'liù', meaning: 'six' },
  { chinese: '妈妈', pinyin: 'māma', meaning: 'mother' },
  { chinese: '吗', pinyin: 'ma', meaning: 'question particle' },
  { chinese: '买', pinyin: 'mǎi', meaning: 'buy' },
  { chinese: '猫', pinyin: 'māo', meaning: 'cat' },
  { chinese: '没', pinyin: 'méi', meaning: 'not have' },
  { chinese: '没关系', pinyin: 'méi guānxi', meaning: 'no problem' },
  { chinese: '米饭', pinyin: 'mǐfàn', meaning: 'rice' },
  { chinese: '名字', pinyin: 'míngzi', meaning: 'name' },
  { chinese: '明天', pinyin: 'míngtiān', meaning: 'tomorrow' },
  { chinese: '哪', pinyin: 'nǎ', meaning: 'which' },
  { chinese: '哪儿', pinyin: 'nǎr', meaning: 'where' },
  { chinese: '那', pinyin: 'nà', meaning: 'that' },
  { chinese: '呢', pinyin: 'ne', meaning: 'particle' },
  { chinese: '能', pinyin: 'néng', meaning: 'can' },
  { chinese: '你', pinyin: 'nǐ', meaning: 'you' },
  { chinese: '年', pinyin: 'nián', meaning: 'year' },
  { chinese: '女儿', pinyin: 'nǚ’ér', meaning: 'daughter' },
  { chinese: '朋友', pinyin: 'péngyou', meaning: 'friend' },
  { chinese: '漂亮', pinyin: 'piàoliang', meaning: 'beautiful' },
  { chinese: '苹果', pinyin: 'píngguǒ', meaning: 'apple' },
  { chinese: '七', pinyin: 'qī', meaning: 'seven' },
  { chinese: '钱', pinyin: 'qián', meaning: 'money' },
  { chinese: '前面', pinyin: 'qiánmiàn', meaning: 'front' },
  { chinese: '请', pinyin: 'qǐng', meaning: 'please' },
  { chinese: '去', pinyin: 'qù', meaning: 'go' },
  { chinese: '热', pinyin: 'rè', meaning: 'hot' },
  { chinese: '人', pinyin: 'rén', meaning: 'person' },
  { chinese: '认识', pinyin: 'rènshi', meaning: 'know (someone)' },
  { chinese: '三', pinyin: 'sān', meaning: 'three' },
  { chinese: '商店', pinyin: 'shāngdiàn', meaning: 'shop' },
  { chinese: '上', pinyin: 'shàng', meaning: 'up' },
  { chinese: '上午', pinyin: 'shàngwǔ', meaning: 'morning' },
  { chinese: '少', pinyin: 'shǎo', meaning: 'few' },
  { chinese: '谁', pinyin: 'shéi', meaning: 'who' },
  { chinese: '什么', pinyin: 'shénme', meaning: 'what' },
  { chinese: '十', pinyin: 'shí', meaning: 'ten' },
  { chinese: '时候', pinyin: 'shíhou', meaning: 'time' },
  { chinese: '是', pinyin: 'shì', meaning: 'to be' },
  { chinese: '书', pinyin: 'shū', meaning: 'book' },
  { chinese: '水', pinyin: 'shuǐ', meaning: 'water' },
  { chinese: '睡觉', pinyin: 'shuìjiào', meaning: 'sleep' },
  { chinese: '说', pinyin: 'shuō', meaning: 'speak' },
  { chinese: '四', pinyin: 'sì', meaning: 'four' },
  { chinese: '岁', pinyin: 'suì', meaning: 'years old' },
  { chinese: '他', pinyin: 'tā', meaning: 'he' },
  { chinese: '她', pinyin: 'tā', meaning: 'she' },
  { chinese: '太', pinyin: 'tài', meaning: 'too' },
  { chinese: '天气', pinyin: 'tiānqì', meaning: 'weather' },
  { chinese: '听', pinyin: 'tīng', meaning: 'listen' },
  { chinese: '同学', pinyin: 'tóngxué', meaning: 'classmate' },
  { chinese: '喂', pinyin: 'wèi', meaning: 'hello (phone)' },
  { chinese: '我', pinyin: 'wǒ', meaning: 'I' },
  { chinese: '我们', pinyin: 'wǒmen', meaning: 'we' },
  { chinese: '五', pinyin: 'wǔ', meaning: 'five' },
  { chinese: '喜欢', pinyin: 'xǐhuan', meaning: 'like' },
  { chinese: '下', pinyin: 'xià', meaning: 'down' },
  { chinese: '下午', pinyin: 'xiàwǔ', meaning: 'afternoon' },
  { chinese: '下雨', pinyin: 'xiàyǔ', meaning: 'rain' },
  { chinese: '先生', pinyin: 'xiānsheng', meaning: 'Mr.' },
  { chinese: '现在', pinyin: 'xiànzài', meaning: 'now' },
  { chinese: '想', pinyin: 'xiǎng', meaning: 'want' },
  { chinese: '小', pinyin: 'xiǎo', meaning: 'small' },
  { chinese: '小姐', pinyin: 'xiǎojiě', meaning: 'Miss' },
  { chinese: '些', pinyin: 'xiē', meaning: 'some' },
  { chinese: '写', pinyin: 'xiě', meaning: 'write' },
  { chinese: '谢谢', pinyin: 'xièxie', meaning: 'thank you' },
  { chinese: '星期', pinyin: 'xīngqī', meaning: 'week' },
  { chinese: '学习', pinyin: 'xuéxí', meaning: 'study' },
  { chinese: '学生', pinyin: 'xuéshēng', meaning: 'student' },
  { chinese: '一', pinyin: 'yī', meaning: 'one' },
  { chinese: '衣服', pinyin: 'yīfu', meaning: 'clothes' },
  { chinese: '医生', pinyin: 'yīshēng', meaning: 'doctor' },
  { chinese: '医院', pinyin: 'yīyuàn', meaning: 'hospital' },
  { chinese: '椅子', pinyin: 'yǐzi', meaning: 'chair' },
  { chinese: '有', pinyin: 'yǒu', meaning: 'have' },
  { chinese: '月', pinyin: 'yuè', meaning: 'month' },
  { chinese: '在', pinyin: 'zài', meaning: 'at' },
  { chinese: '再见', pinyin: 'zàijiàn', meaning: 'goodbye' },
  { chinese: '怎么', pinyin: 'zěnme', meaning: 'how' },
  { chinese: '怎么样', pinyin: 'zěnmeyàng', meaning: 'how about' },
  { chinese: '这', pinyin: 'zhè', meaning: 'this' },
  { chinese: '中国', pinyin: 'Zhōngguó', meaning: 'China' },
  { chinese: '中午', pinyin: 'zhōngwǔ', meaning: 'noon' },
  { chinese: '住', pinyin: 'zhù', meaning: 'live' },
  { chinese: '桌子', pinyin: 'zhuōzi', meaning: 'table' },
  { chinese: '字', pinyin: 'zì', meaning: 'character' },
];

const toneGameData = [
  { word: 'Mā', tone: 1, meaning: 'Mother', pinyin: 'ma', examples: ['妈 (mā)'] },
  { word: 'Má', tone: 2, meaning: 'Hemp', pinyin: 'ma', examples: ['麻 (má)'] },
  { word: 'Mǎ', tone: 3, meaning: 'Horse', pinyin: 'ma', examples: ['马 (mǎ)'] },
  { word: 'Mà', tone: 4, meaning: 'Scold', pinyin: 'ma', examples: ['骂 (mà)'] },
  { word: 'Hé', tone: 2, meaning: 'River', pinyin: 'he', examples: ['河 (hé)'] },
  { word: 'Wǔ', tone: 3, meaning: 'Five', pinyin: 'wu', examples: ['五 (wǔ)'] },
];

const dynastyData = [
  { id: 'qin', name: 'Qin Dynasty', year: '221–206 BC', info: 'First unified empire, Great Wall started.' },
  { id: 'han', name: 'Han Dynasty', year: '206 BC – 220 AD', info: 'Golden age, Silk Road established.' },
  { id: 'tang', name: 'Tang Dynasty', year: '618–907 AD', info: 'Peak of poetry and cosmopolitan culture.' },
  { id: 'song', name: 'Song Dynasty', year: '960–1279 AD', info: 'Invention of gunpowder and compass.' },
  { id: 'ming', name: 'Ming Dynasty', year: '1368–1644 AD', info: 'Forbidden City built, Zheng He voyages.' },
  { id: 'qing', name: 'Qing Dynasty', year: '1644–1912 AD', info: 'Final imperial dynasty.' },
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

// --- Sub-Components ---

function speak(text: string) {
  if (!('speechSynthesis' in window)) {
    toast.error('Speech synthesis not supported in this browser.');
    return;
  }

  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  
  // Filter for Chinese voices
  const zhVoices = voices.filter(v => 
    v.lang.toLowerCase().includes('zh') || 
    v.lang.toLowerCase().includes('cn')
  );

  // Sort voices to prioritize "Google" and "Premium" versions which are higher quality
  zhVoices.sort((a, b) => {
    const aScore = (a.name.includes('Google') ? 10 : 0) + (a.name.includes('Premium') ? 5 : 0);
    const bScore = (b.name.includes('Google') ? 10 : 0) + (b.name.includes('Premium') ? 5 : 0);
    return bScore - aScore;
  });

  if (zhVoices.length > 0) {
    utterance.voice = zhVoices[0];
  }
  
  utterance.lang = 'zh-CN';
  utterance.rate = 1.0; // Standard speed for better clarity
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  
  window.speechSynthesis.speak(utterance);
}

function ToneMaster() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (tone: number) => {
    if (tone === toneGameData[index].tone) {
      setScore(s => s + 1);
      toast.success('Perfect pitch!');
      speak(toneGameData[index].word);
    } else {
      toast.error(`Wrong tone! It was Tone ${toneGameData[index].tone}`);
    }

    if (index < toneGameData.length - 1) {
      setIndex(index + 1);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <div className="text-center space-y-6 py-12">
        <Trophy className="mx-auto h-20 w-20 text-yellow-500" />
        <h3 className="text-4xl font-bold">Tone Master: {score}/{toneGameData.length}</h3>
        <Button onClick={() => { setIndex(0); setScore(0); setFinished(false); }} className="bg-red-600 rounded-full h-12 px-8">
          Try Again
        </Button>
      </div>
    );
  }

  const progress = ((index) / toneGameData.length) * 100;

  return (
    <div className="space-y-8">
      <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
        <motion.div 
          className="bg-red-600 h-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>

      <div className="text-center p-12 bg-stone-50 rounded-[3rem] border border-stone-100 relative group">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 right-4 text-stone-400 hover:text-red-600"
          onClick={() => speak(toneGameData[index].word)}
        >
          <Volume2 className="h-6 w-6" />
        </Button>
        <motion.div
          key={index}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="space-y-4"
        >
          <h2 className="text-8xl font-bold text-stone-900">{toneGameData[index].word}</h2>
          <p className="text-stone-500 text-xl italic">{toneGameData[index].meaning}</p>
          <div className="flex justify-center gap-2 mt-4">
            {toneGameData[index].examples.map(ex => (
              <Badge key={ex} variant="secondary" className="bg-white border-stone-200">{ex}</Badge>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(t => (
          <Button
            key={t}
            variant="outline"
            className="h-24 text-2xl font-bold rounded-3xl border-2 border-stone-100 hover:border-red-600 hover:bg-red-50 transition-all"
            onClick={() => handleAnswer(t)}
          >
            Tone {t}
          </Button>
        ))}
      </div>
    </div>
  );
}

function DynastySorter() {
  const [items, setItems] = useState(() => [...dynastyData].sort(() => Math.random() - 0.5));
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const checkOrder = () => {
    const correctIds = dynastyData.map(d => d.id);
    const currentIds = items.map(d => d.id);
    const win = JSON.stringify(correctIds) === JSON.stringify(currentIds);
    setIsCorrect(win);
    if (win) toast.success('History Master! You got the order right.');
    else toast.error('Not quite right. Try moving them around!');
  };

  return (
    <div className="space-y-8">
      <div className="bg-red-50 p-6 rounded-3xl border border-red-100 flex items-start space-x-4">
        <Info className="text-red-600 shrink-0 mt-1" />
        <p className="text-sm text-red-900">Drag and drop the dynasties into their correct chronological order (earliest at the top).</p>
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
          className="bg-red-600 hover:bg-red-700 rounded-full h-12 px-12 text-lg font-bold"
        >
          Verify Timeline
        </Button>
      </div>
    </div>
  );
}

function FlashcardLab() {
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const nextCard = () => {
    setIsFlipped(false);
    setIndex((prev) => (prev + 1) % hsk1Data.length);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setIndex((prev) => (prev - 1 + hsk1Data.length) % hsk1Data.length);
  };

  const randomCard = () => {
    setIsFlipped(false);
    setIndex(Math.floor(Math.random() * hsk1Data.length));
  };

  const handleFlip = () => {
    const newFlippedState = !isFlipped;
    setIsFlipped(newFlippedState);
    if (newFlippedState) {
      speak(hsk1Data[index].chinese);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center px-4">
        <Badge variant="outline" className="rounded-full px-4 py-1">HSK 1 Vocabulary</Badge>
        <span className="text-stone-400 text-sm font-medium">{index + 1} / {hsk1Data.length}</span>
      </div>

      <div 
        className="perspective-1000 h-[450px] w-full cursor-pointer group"
        onClick={handleFlip}
      >
        <motion.div
          className="relative w-full h-full transition-all duration-700 preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-white border-2 border-stone-100 rounded-[3rem] shadow-xl flex flex-col items-center justify-center p-12">
            <div className="text-stone-100 absolute top-12 left-12 text-8xl font-bold select-none opacity-50">?</div>
            <div className="text-9xl font-bold text-stone-900 mb-8">{hsk1Data[index].chinese}</div>
            <div className="mt-auto flex flex-col items-center">
              <p className="text-stone-400 uppercase tracking-widest text-xs font-bold mb-2">Click to reveal</p>
              <RefreshCw className="h-4 w-4 text-stone-300 animate-spin-slow" />
            </div>
          </div>

          {/* Back */}
          <div className="absolute inset-0 backface-hidden bg-stone-900 text-white border-2 border-stone-800 rounded-[3rem] shadow-xl flex flex-col items-center justify-center p-12 rotate-y-180">
            <div className="absolute top-12 right-12">
              <Badge className="bg-red-600/20 text-red-500 border-red-500/30">HSK 1</Badge>
            </div>
            
            <div className="text-center space-y-6">
              <div>
                <p className="text-red-500 text-sm font-bold uppercase tracking-widest mb-2">Pinyin</p>
                <h3 className="text-6xl font-bold">{hsk1Data[index].pinyin}</h3>
              </div>
              
              <div className="w-12 h-1 bg-stone-700 mx-auto rounded-full" />
              
              <div>
                <p className="text-red-500 text-sm font-bold uppercase tracking-widest mb-2">Meaning</p>
                <p className="text-3xl text-stone-300 font-medium">{hsk1Data[index].meaning}</p>
              </div>
            </div>

            <div className="mt-12 flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-full bg-white/5 border-white/10 hover:bg-white/10 text-white px-8"
                onClick={(e) => { e.stopPropagation(); speak(hsk1Data[index].chinese); }}
              >
                <Volume2 className="mr-2 h-5 w-5" /> Pronounce
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex justify-center items-center space-x-4">
        <Button variant="outline" onClick={prevCard} className="rounded-full h-14 w-14 p-0 border-stone-200 hover:border-red-600 hover:bg-red-50">
          <ArrowRight className="rotate-180 h-6 w-6" />
        </Button>
        <Button variant="outline" onClick={randomCard} className="rounded-full h-14 px-8 border-stone-200 hover:border-red-600 hover:bg-red-50 font-bold">
          <RefreshCw className="mr-2 h-4 w-4" /> Shuffle
        </Button>
        <Button variant="outline" onClick={nextCard} className="rounded-full h-14 w-14 p-0 border-stone-200 hover:border-red-600 hover:bg-red-50">
          <ArrowRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}

function PinyinMatcher() {
  const [currentWord, setCurrentWord] = useState(() => hsk1Data[Math.floor(Math.random() * hsk1Data.length)]);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  const generateOptions = useCallback((correct: string) => {
    const allPinyins = Array.from(new Set(hsk1Data.map(w => w.pinyin)));
    const others = allPinyins
      .filter(p => p !== correct)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    setOptions([correct, ...others].sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    generateOptions(currentWord.pinyin);
  }, [currentWord, generateOptions]);

  const handleAnswer = (selected: string) => {
    if (selected === currentWord.pinyin) {
      setScore(s => s + 1);
      toast.success('Correct!');
      speak(currentWord.chinese);
      const next = hsk1Data[Math.floor(Math.random() * hsk1Data.length)];
      setCurrentWord(next);
    } else {
      toast.error(`Wrong! It's ${currentWord.pinyin}`);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center p-12 bg-stone-900 text-white rounded-[3rem] border border-stone-800">
        <h2 className="text-9xl font-bold">{currentWord.chinese}</h2>
        <p className="text-stone-400 mt-4 italic">What is the pinyin for this character?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map(opt => (
          <Button
            key={opt}
            variant="outline"
            className="h-20 text-xl font-bold rounded-2xl border-2 border-stone-100 hover:border-red-600 hover:bg-red-50 transition-all"
            onClick={() => handleAnswer(opt)}
          >
            {opt}
          </Button>
        ))}
      </div>
      <div className="text-center">
        <Badge variant="secondary" className="bg-red-50 text-red-600 border-red-100 px-6 py-2 rounded-full text-lg">
          Score: {score}
        </Badge>
      </div>
    </div>
  );
}

// --- Main Page ---

export default function Learn() {
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizStatus, setQuizStatus] = useState<'playing' | 'finished'>('playing');

  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

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
        className="flex flex-col md:flex-row items-end justify-between mb-20 gap-12"
      >
        <div className="text-left max-w-2xl space-y-6">
          <div className="inline-flex items-center space-x-4 text-primary">
            <div className="h-px w-12 bg-primary" />
            <span className="font-serif italic text-xl font-bold uppercase tracking-widest">Interactive Scrolls 互动卷轴</span>
          </div>
          <h1 className="text-7xl font-serif font-bold tracking-tight leading-[0.85]">
            THE <span className="text-primary italic">KNOWLEDGE</span> <br /> ARCHIVE
          </h1>
          <p className="text-2xl font-serif text-muted-foreground leading-relaxed italic">
            Master the art of Hanzi, the rhythm of history, and the essence of culture through immersive digital challenges.
          </p>
        </div>
        <div className="flex gap-6 w-full md:w-auto">
          <Card className="p-8 bg-card rounded-[2.5rem] border-none shadow-xl flex flex-col items-center justify-center min-w-[160px]">
            <Trophy className="text-primary mb-4 h-10 w-10" />
            <div className="text-4xl font-serif font-bold italic">1,240</div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-1">Total XP</div>
          </Card>
          <Card className="p-8 bg-primary text-white rounded-[2.5rem] border-none shadow-xl shadow-primary/20 flex flex-col items-center justify-center min-w-[160px]">
            <Star className="text-white mb-4 h-10 w-10" />
            <div className="text-4xl font-serif font-bold italic">Level 4</div>
            <div className="text-xs text-white/60 uppercase tracking-widest font-bold mt-1">Explorer</div>
          </Card>
        </div>
      </motion.div>

      <Tabs defaultValue="language" className="space-y-16 mt-10">
        <TabsList className="flex justify-start bg-transparent space-x-4 h-auto overflow-x-auto pb-4 no-scrollbar border-b border-border">
          {[
            { value: 'language', label: 'Language 语言', icon: Languages },
            { value: 'hsk1', label: 'HSK 1 Lab 实验室', icon: Book },
            { value: 'history', label: 'History 历史', icon: History },
            { value: 'culture', label: 'Culture 文化', icon: Palette },
          ].map((tab) => (
            <TabsTrigger 
              key={tab.value}
              value={tab.value} 
              className="rounded-full px-10 py-4 data-[state=active]:bg-primary data-[state=active]:text-white border border-border transition-all font-serif italic text-xl"
            >
              <tab.icon className="mr-3 h-5 w-5" /> {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <AnimatePresence mode="wait">
          {/* Language Games */}
          <TabsContent value="language" className="outline-none">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-card">
                  <div className="bg-foreground text-background p-12">
                    <div className="flex justify-between items-center mb-8">
                      <Badge className="bg-primary text-white rounded-full px-4 py-1 font-serif italic">Tone Master</Badge>
                      <div className="flex items-center space-x-3 text-muted-foreground">
                        <Timer className="h-5 w-5" />
                        <span className="text-xs font-bold uppercase tracking-[0.2em]">Quick Challenge</span>
                      </div>
                    </div>
                    <h3 className="text-4xl font-serif font-bold tracking-tight">Identify the Tone 辨别声调</h3>
                    <p className="text-muted-foreground text-xl font-serif italic mt-4">Listen to the word and pick the correct tone mark (1-4).</p>
                  </div>
                  <CardContent className="p-12">
                    <ToneMaster />
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-8">
                <Card className="rounded-[2.5rem] border-border shadow-sm overflow-hidden bg-card">
                  <div className="bg-muted p-6 border-b border-border">
                    <CardTitle className="text-lg font-serif font-bold flex items-center">
                      <LayoutGrid className="mr-3 h-5 w-5 text-primary" /> Matching Game 匹配
                    </CardTitle>
                  </div>
                  <CardContent className="p-8">
                    <PinyinMatcher />
                  </CardContent>
                </Card>

                <Card className="rounded-[2.5rem] border-none shadow-xl bg-foreground text-background p-10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                    <Sparkles className="h-32 w-32" />
                  </div>
                  <h4 className="font-serif font-bold text-xl mb-8 flex items-center">
                    <Star className="mr-3 h-5 w-5 text-primary" /> Daily Streak 连续天数
                  </h4>
                  <div className="flex justify-between mb-8">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                      <div key={i} className="flex flex-col items-center space-y-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i < 4 ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' : 'bg-muted text-muted-foreground'}`}>
                          {i < 4 ? <CheckCircle2 size={18} /> : d}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-lg font-serif italic text-muted-foreground leading-relaxed">
                    You're on a 4-day streak! Keep it up to earn the <span className="text-primary font-bold">"Linguist"</span> badge.
                  </p>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* HSK 1 Lab */}
          <TabsContent value="hsk1" className="outline-none">
            <div className="max-w-4xl mx-auto">
              <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-card">
                <div className="bg-foreground text-background p-12">
                  <div className="flex justify-between items-center mb-8">
                    <Badge className="bg-primary text-white rounded-full px-4 py-1 font-serif italic">Flashcards</Badge>
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Vocabulary Lab</span>
                  </div>
                  <h3 className="text-5xl font-serif font-bold tracking-tight">HSK 1 Master List 词汇表</h3>
                  <p className="text-muted-foreground text-xl font-serif italic mt-4">Flip through 150+ essential HSK 1 characters and master their meanings.</p>
                </div>
                <CardContent className="p-12">
                  <FlashcardLab />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* History Games */}
          <TabsContent value="history" className="outline-none">
            <div className="max-w-4xl mx-auto">
              <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-card">
                <div className="bg-foreground text-background p-12">
                  <div className="flex justify-between items-center mb-8">
                    <Badge className="bg-primary text-white rounded-full px-4 py-1 font-serif italic">Chronology</Badge>
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">History Challenge</span>
                  </div>
                  <h3 className="text-5xl font-serif font-bold tracking-tight">Dynasty Timeline 朝代时间轴</h3>
                  <p className="text-muted-foreground text-xl font-serif italic mt-4">Order the major dynasties of Imperial China from earliest to latest.</p>
                </div>
                <CardContent className="p-12">
                  <DynastySorter />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Culture Games */}
          <TabsContent value="culture" className="outline-none">
            <div className="max-w-2xl mx-auto">
              <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-card">
                <div className="bg-primary text-white p-12">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">Question {quizIndex + 1} of {quizData.length}</span>
                    <Badge variant="secondary" className="bg-white/20 text-white border-none font-serif italic">Culture Quiz</Badge>
                  </div>
                  <h3 className="text-4xl font-serif font-bold leading-tight tracking-tight">
                    {quizStatus === 'playing' ? quizData[quizIndex].question : 'Quiz Completed!'}
                  </h3>
                </div>
                <CardContent className="p-12">
                  {quizStatus === 'playing' ? (
                    <div className="space-y-6">
                      {quizData[quizIndex].options.map((option) => (
                        <Button
                          key={option}
                          variant="outline"
                          className="w-full h-24 justify-between px-10 text-xl font-serif italic rounded-3xl border-2 border-border hover:border-primary hover:bg-primary/5 group transition-all"
                          onClick={() => handleQuizAnswer(option)}
                        >
                          {option}
                          <ChevronRight className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-2" />
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center space-y-10 py-12">
                      <div className="relative inline-block">
                        <Trophy className="h-40 w-40 text-primary mx-auto" />
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-4 -right-4 bg-foreground text-background w-16 h-16 rounded-full flex items-center justify-center font-serif font-bold text-2xl border-4 border-card shadow-xl"
                        >
                          {quizScore}
                        </motion.div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-4xl font-serif font-bold italic">Excellent Work! 太棒了!</h3>
                        <p className="text-xl font-serif italic text-muted-foreground">You've mastered the basics of Chinese culture.</p>
                      </div>
                      <Button 
                        onClick={() => {
                          setQuizIndex(0);
                          setQuizScore(0);
                          setQuizStatus('playing');
                        }}
                        className="bg-primary hover:bg-primary/90 text-white rounded-full px-16 py-8 text-xl font-serif italic shadow-xl shadow-primary/20"
                      >
                        <RotateCcw className="mr-3 h-6 w-6" /> Restart Quiz 重新开始
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
