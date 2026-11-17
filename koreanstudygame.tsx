import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, Edit3, CheckCircle2, ChevronRight, RefreshCw, ArrowLeft, Eye } from 'lucide-react';

// --- HARDCODED CONVERSATION DATA ---
const conversations = [
  {
    id: 1,
    title: "Conversation 1: Busan Trip",
    subtitle: "부산 여행",
    dialogue: [
      { speaker: 'A', text: '이번 방학에 부산으로 여행을 하려고 하는데 부산에 가 봤어요?' },
      { speaker: 'B', text: '어... 네, 작년에 다녀왔어요. 바다가 정말 예쁘더라고요.' },
      { speaker: 'A', text: '그래요? 다음 주에 갈 건데 날씨가 좋을까요?' },
      { speaker: 'B', text: '부산은 날씨가 변덕스러워서 비가 올지도 몰라요...' },
      { speaker: 'A', text: '그럼 여행을 가려면 무엇을 준비하면 돼요?' },
      { speaker: 'B', text: '먼저 일기예보를 확인하면 돼요. 그리고 우산도 챙겼으면 좋겠어요.' },
      { speaker: 'A', text: '부산에서 꼭 먹어야 하는 음식이 있어요?' },
      { speaker: 'B', text: '돼지국밥을 추천해요. 내가 먹어 보니까 정말 맛있더라고요.' },
      { speaker: 'A', text: '해운대에도 가고 싶은데 주말에는 사람이 많을 것 같아요.' },
      { speaker: 'B', text: '네... 사람이 많거든요. 그래서 아침 일찍 가는 게 좋아요.' },
      { speaker: 'A', text: '알겠어요! 여행하는 동안 날씨가 좋았으면 좋겠어요.' },
      { speaker: 'B', text: '당연하지! 재미있게 놀아 와.' }
    ]
  },
  {
    id: 2,
    title: "Conversation 2: Absence due to injury",
    subtitle: "결석 (부상)",
    dialogue: [
      { speaker: 'A', text: '선생님, 안녕하세요. 저 어제 다쳐서 오늘 학교에 갈 수 없을 것 같아서 전화드렸어요.' },
      { speaker: 'B', text: '그래요? 어쩌다가 다쳤어요? 많이 아픈가요?' },
      { speaker: 'A', text: '어제 친구들과 농구를 하다가 발목을 삐어서 제대로 걷기가 어려워요.' },
      { speaker: 'B', text: '많이 아프겠어요. 병원에 가서 진료를 받아 봤어요?' },
      { speaker: 'A', text: '네, 병원에 갔더니 발목이 심하게 부어서 며칠 동안 치료를 받아야 한대요.' },
      { speaker: 'B', text: '그렇군요. 의사 선생님이 특별히 조심해야 할 점도 말씀하셨어요?' },
      { speaker: 'A', text: '네 의사 선생님이 당분간 운동하지 말라고 하셨어요.' },
      { speaker: 'B', text: '그렇군요. 그럼 집에서 푹 쉬는 게 좋겠어요.' },
      { speaker: 'A', text: '네 약을 먹었더니 통증이 조금 줄어들었어요.' },
      { speaker: 'B', text: '다행이네요 약을 잘 챙겨 먹고 있어요?' },
      { speaker: 'A', text: '네 빨리 나아서 다음 주에는 학교에 가고 싶어요.' },
      { speaker: 'B', text: '네 무리하지 말고 빨리 나으세요!' }
    ]
  },
  {
    id: 3,
    title: "Conversation 3: Flight Attendant Prep",
    subtitle: "승무원 준비",
    dialogue: [
      { speaker: 'A', text: '선배, 승무원으로 일하신다면서요? 어떻게 준비하셨어요?' },
      { speaker: 'B', text: '응! 어릴 때부터 승무원이 되고 싶어서 열심히 준비했어.' },
      { speaker: 'A', text: '저도 승무원이 되고 싶은데 어떻게 준비해야 해요?' },
      { speaker: 'B', text: '승무원이 되려면 외국어 실력이 좋아야 해.' },
      { speaker: 'A', text: '영어도 잘해야 할 텐데 걱정이에요.' },
      { speaker: 'B', text: '걱정하지마! 매일 영어를 공부하면 돼.' },
      { speaker: 'A', text: '면접을 잘 보려면 어떻게 해야 해요?' },
      { speaker: 'B', text: '자신 있게 말하고 웃는 연습을 많이 하면 돼.' },
      { speaker: 'A', text: '키나 외모도 중요해요?' },
      { speaker: 'B', text: '응! 하지만 친절한 태도와 서비스 정신도 중요해' },
      { speaker: 'A', text: '준비할 것이 많을 텐데 시간이 부족할까 봐 걱정이에요.' },
      { speaker: 'B', text: '지금부터 계획을 세워서 하나씩 준비하면 돼.' },
      { speaker: 'A', text: '선배 말씀을 들으니까 저도 열심히 준비하고 싶어요! 감사합니다.' },
      { speaker: 'B', text: '응, 포기하지 말고 열심히 준비해.' }
    ]
  }
];

// --- HELPER FUNCTIONS ---
// Cleans punctuation from words so the user only has to type the characters
const splitPunctuation = (word) => {
  const match = word.match(/^([^.?!,;]*)([.?!,;]*)$/);
  return {
    cleanWord: match ? match[1] : word,
    punctuation: match ? match[2] : ''
  };
};

// Generates the blank structure for a dialogue
const generateBlanks = (dialogue) => {
  return dialogue.map((line, lineIdx) => {
    const words = line.text.split(' ');
    const numBlanks = Math.min(Math.floor(Math.random() * 2) + 1, words.length); // 1 or 2 blanks
    
    // Valid indices are words that aren't empty after stripping punctuation
    const validIndices = words.map((w, i) => i).filter(i => splitPunctuation(words[i]).cleanWord.length > 0);
    const shuffled = validIndices.sort(() => 0.5 - Math.random());
    const selectedIndices = shuffled.slice(0, numBlanks);

    const tokens = words.map((word, wordIdx) => {
      const { cleanWord, punctuation } = splitPunctuation(word);
      if (selectedIndices.includes(wordIdx)) {
        return { 
          type: 'blank', 
          id: `${lineIdx}_${wordIdx}`, 
          answer: cleanWord, 
          suffix: punctuation 
        };
      }
      return { type: 'text', content: word };
    });

    return { speaker: line.speaker, tokens };
  });
};


// --- COMPONENTS ---

// 1. Dashboard View
const Dashboard = ({ onSelectConversation }) => (
  <div className="max-w-4xl mx-auto p-6 animate-in fade-in zoom-in duration-300">
    <div className="text-center mb-10">
      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight mb-3">한국어 연습</h1>
      <p className="text-lg text-slate-500">Korean Conversation Practice Mini-Game</p>
    </div>
    
    <div className="grid gap-6 md:grid-cols-3">
      {conversations.map((conv) => (
        <button
          key={conv.id}
          onClick={() => onSelectConversation(conv)}
          className="group relative bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-indigo-300 transition-all duration-300 text-left overflow-hidden flex flex-col items-start justify-between min-h-[220px]"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          
          <div className="relative z-10 w-full">
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mb-4">
              Conversation {conv.id}
            </span>
            <h2 className="text-xl font-bold text-slate-800 mb-2 leading-tight">{conv.title}</h2>
            <p className="text-slate-500 text-sm font-medium">{conv.subtitle}</p>
          </div>
          
          <div className="relative z-10 mt-6 flex items-center text-indigo-600 font-semibold group-hover:translate-x-2 transition-transform">
            Start Learning <ChevronRight className="ml-1 w-5 h-5" />
          </div>
        </button>
      ))}
    </div>
  </div>
);

// 2. Mode Selector View
const ModeSelector = ({ conversation, onSelectMode, onBack }) => (
  <div className="max-w-3xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
    <button onClick={onBack} className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition-colors">
      <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
    </button>
    
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 mb-8">
      <h2 className="text-3xl font-bold text-slate-800 mb-2">{conversation.title}</h2>
      <p className="text-slate-500">{conversation.subtitle} — Choose your study mode</p>
    </div>

    <div className="grid gap-6 md:grid-cols-2">
      {/* Memorize Mode Card */}
      <button 
        onClick={() => onSelectMode('memorize')}
        className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 rounded-3xl text-white text-left shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
      >
        <BookOpen className="w-10 h-10 mb-4 opacity-80" />
        <h3 className="text-2xl font-bold mb-2">Memorize</h3>
        <p className="text-blue-100">Read line-by-line and test your memory before revealing the next sentence.</p>
      </button>

      {/* Fill in Blanks Mode Card */}
      <button 
        onClick={() => onSelectMode('blanks')}
        className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 rounded-3xl text-white text-left shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
      >
        <Edit3 className="w-10 h-10 mb-4 opacity-80" />
        <h3 className="text-2xl font-bold mb-2">Fill in Blanks</h3>
        <p className="text-emerald-100">Practice your vocabulary and grammar by typing the missing words in the dialogue.</p>
      </button>
    </div>
  </div>
);

// 3. Memorize Mode Component
const MemorizeMode = ({ conversation, onBack }) => {
  const [revealedCount, setRevealedCount] = useState(1);
  const totalLines = conversation.dialogue.length;
  const isFinished = revealedCount >= totalLines;

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 animate-in fade-in duration-300 h-screen flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <button onClick={onBack} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>
        <div className="text-sm font-semibold text-slate-400">
          {revealedCount} / {totalLines}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pb-24 pr-2 scrollbar-thin scrollbar-thumb-slate-200">
        {conversation.dialogue.slice(0, revealedCount).map((line, idx) => (
          <div key={idx} className={`flex gap-4 animate-in slide-in-from-bottom-2 fade-in duration-300`}>
            <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${line.speaker === 'A' ? 'bg-indigo-500' : 'bg-emerald-500'}`}>
              {line.speaker}
            </div>
            <div className="bg-white px-5 py-4 rounded-2xl shadow-sm border border-slate-100 text-slate-700 text-lg leading-relaxed flex-1">
              {line.text}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-50 to-transparent flex justify-center pb-8 shrink-0 pointer-events-none">
        <div className="pointer-events-auto">
          {!isFinished ? (
            <button 
              onClick={() => setRevealedCount(prev => prev + 1)}
              className="bg-slate-800 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-slate-700 hover:shadow-xl active:scale-95 transition-all flex items-center gap-2"
            >
              Next Line <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button 
              onClick={() => setRevealedCount(1)}
              className="bg-indigo-100 text-indigo-700 px-8 py-3 rounded-full font-semibold shadow-sm hover:bg-indigo-200 active:scale-95 transition-all flex items-center gap-2"
            >
              Restart <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// 4. Fill in the Blanks Mode Component
const FillInBlanksMode = ({ conversation, onBack }) => {
  // Use useMemo to generate the blanks only once when component mounts or conversation changes
  const blankedDialogue = useMemo(() => generateBlanks(conversation.dialogue), [conversation]);
  
  const [userInputs, setUserInputs] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  const handleInputChange = (id, value) => {
    setUserInputs(prev => ({ ...prev, [id]: value }));
    setIsChecked(false); // Reset check state when they type again
  };

  const handleCheck = () => setIsChecked(true);
  const handleShowAnswers = () => setShowAnswers(true);
  const handleReset = () => {
    setUserInputs({});
    setIsChecked(false);
    setShowAnswers(false);
    // Note: We keep the same blanked words. If we wanted random new ones on reset, 
    // we'd need to lift blank generation out of useMemo or trigger a re-roll.
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>
        <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
          Quiz Mode
        </span>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 mb-24">
        <div className="space-y-6">
          {blankedDialogue.map((line, lineIdx) => (
            <div key={lineIdx} className="flex gap-4 items-start">
              <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-sm mt-1 ${line.speaker === 'A' ? 'bg-indigo-500' : 'bg-emerald-500'}`}>
                {line.speaker}
              </div>
              <div className="flex-1 leading-loose text-lg text-slate-700 flex flex-wrap items-center gap-y-2">
                {line.tokens.map((token, tokenIdx) => {
                  if (token.type === 'text') {
                    return <span key={tokenIdx} className="mr-1.5">{token.content}</span>;
                  }

                  // Handle Blank
                  const val = userInputs[token.id] || '';
                  const isCorrect = val.trim() === token.answer;
                  
                  let inputStyle = "border-slate-300 bg-slate-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200";
                  if (showAnswers) {
                    inputStyle = "border-emerald-500 bg-emerald-50 text-emerald-700 font-medium";
                  } else if (isChecked) {
                    inputStyle = isCorrect 
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-medium" 
                      : "border-red-400 bg-red-50 text-red-700";
                  }

                  return (
                    <span key={token.id} className="inline-flex items-end mr-1.5">
                      <div className="relative">
                        <input
                          type="text"
                          value={showAnswers ? token.answer : val}
                          onChange={(e) => handleInputChange(token.id, e.target.value)}
                          readOnly={showAnswers}
                          className={`w-28 sm:w-32 px-2 py-1 text-center rounded-lg border-2 outline-none transition-all ${inputStyle}`}
                          placeholder="???"
                        />
                        {/* Optional subtle indicator for correctness */}
                        {isChecked && !showAnswers && isCorrect && (
                          <CheckCircle2 className="absolute -top-2 -right-2 w-4 h-4 text-emerald-500 bg-white rounded-full" />
                        )}
                      </div>
                      {token.suffix && <span className="ml-0.5">{token.suffix}</span>}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 flex justify-center gap-4 z-50">
        <button 
          onClick={handleReset}
          className="p-3 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
          title="Reset"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
        
        <button 
          onClick={handleShowAnswers}
          disabled={showAnswers}
          className="px-6 py-2.5 rounded-full font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          <Eye className="w-4 h-4" /> Show Answers
        </button>

        <button 
          onClick={handleCheck}
          className="px-8 py-2.5 rounded-full font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center gap-2"
        >
          <CheckCircle2 className="w-5 h-5" /> Check My Answers
        </button>
      </div>
    </div>
  );
};


// --- MAIN APP COMPONENT ---
export default function App() {
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'mode_select', 'memorize', 'blanks'
  const [selectedConversation, setSelectedConversation] = useState(null);

  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    setCurrentView('mode_select');
  };

  const handleSelectMode = (mode) => {
    setCurrentView(mode);
  };

  const handleBackToDashboard = () => {
    setSelectedConversation(null);
    setCurrentView('dashboard');
  };

  const handleBackToModeSelect = () => {
    setCurrentView('mode_select');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100">
      {currentView === 'dashboard' && (
        <Dashboard onSelectConversation={handleSelectConversation} />
      )}
      
      {currentView === 'mode_select' && selectedConversation && (
        <ModeSelector 
          conversation={selectedConversation} 
          onSelectMode={handleSelectMode} 
          onBack={handleBackToDashboard}
        />
      )}

      {currentView === 'memorize' && selectedConversation && (
        <MemorizeMode 
          conversation={selectedConversation} 
          onBack={handleBackToModeSelect} 
        />
      )}

      {currentView === 'blanks' && selectedConversation && (
        <FillInBlanksMode 
          conversation={selectedConversation} 
          onBack={handleBackToModeSelect} 
        />
      )}
    </div>
  );
}