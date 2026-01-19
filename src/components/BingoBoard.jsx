import React, { useState } from 'react';
import { useBingo } from '../hooks/useBingo';

// default phrases for the bingo board
const DEFAULT_PHRASES = [
  "Professor is late", "Mic Issues", "Forgot Recording", 
  "Screen Freeze", "Unmuted Accident", "Slide Typo",
  "Overtime", "Dead Silence", "Student Sleeping",
  "Pop Quiz", "Wifi Lag", "The Algorithm",
  "Awkward Joke", "Coughs", "Drinks Water",
  "Skip Slide", "Tech Issue", "Camera Off",
  "Camera On", "Infinite Loop", "Eating Sounds",
  "Dog Barking", "Sirens", "Class Cancelled"
];

const BingoBoard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { grid, isWon, gameLog, updateCellText, toggleCell, shuffleGrid, resetGame } = useBingo(DEFAULT_PHRASES);

  return (
    <div className="min-h-screen bg-gray-50 text-slate-800 font-sans flex flex-col items-center py-12 px-4 transition-colors duration-500">
      
      {/* Header Section */}
      <div className="text-center mb-10 space-y-2">
        <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold tracking-wide uppercase mb-2">
          v2.0 • Live Session
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 drop-shadow-sm">
          Lecture<span className="text-indigo-600">Bingo</span>
        </h1>
        <p className="text-slate-500 text-lg">Make the boring classes a little more bearable.</p>
      </div>

      {/* Main Card Container */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-slate-200/50 w-full max-w-2xl border border-slate-100 relative overflow-hidden">
        
        {isWon && (
          <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
            <div className="text-8xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-4xl font-black text-rose-500 mb-2">BINGO!</h2>
            <p className="text-slate-600 font-medium">You survived the lecture.</p>
            <button 
              onClick={resetGame}
              className="mt-8 px-8 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform"
            >
              Play Again
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex gap-2">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 border-2 ${
                isEditing 
                ? 'bg-amber-50 border-amber-400 text-amber-700 shadow-sm' 
                : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {isEditing ? '💾 Save Board' : '✏️ Edit Board'}
            </button>
          </div>

          <div className="flex gap-2">
             <button 
                onClick={resetGame}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-rose-100 hover:text-rose-600 transition-colors"
                title="Clear Board"
              >
                ↺
              </button>
              <button 
                onClick={shuffleGrid}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-md shadow-indigo-200 hover:bg-indigo-700 hover:shadow-lg transition-all active:scale-95"
              >
                Shuffle 🎲
              </button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 md:gap-3">
          {grid.map((cell, index) => {
            const isCenter = index === 12;
            
            return (
              <div 
                key={cell.id}
                onClick={() => !isEditing && toggleCell(index)}
                className={`
                  aspect-square relative flex items-center justify-center p-1 md:p-2 text-center rounded-xl transition-all duration-200 select-none
                  text-[10px] md:text-xs font-semibold leading-tight break-words
                  ${isCenter 
                    ? 'bg-amber-100 text-amber-700 border-2 border-amber-200 shadow-inner' 
                    : ''}
                  ${cell.checked && !isCenter 
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-200 transform scale-95' 
                    : 'bg-slate-50 border-2 border-transparent text-slate-600'}
                  ${!cell.checked && !isCenter && !isEditing 
                    ? 'hover:bg-white hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-100/50 hover:-translate-y-1 cursor-pointer' 
                    : ''}
                  ${isEditing && !isCenter ? 'bg-white border-2 border-slate-200' : ''}
                `}
              >
                {isEditing && !isCenter ? (
                  <textarea
                    className="w-full h-full bg-transparent text-center focus:outline-none resize-none text-slate-800 placeholder-slate-300 text-xs"
                    value={cell.text}
                    onChange={(e) => updateCellText(index, e.target.value)}
                    placeholder="Type here..."
                  />
                ) : (
                    <span className="text-[10px] md:text-sm font-bold leading-tight overflow-hidden px-1 break-words">
                    {cell.text}
                    </span>
                )}

                {cell.checked && !isCenter && (
                  <div className="absolute -top-1 -right-1 bg-white text-rose-500 rounded-full w-4 h-4 flex items-center justify-center text-[10px] shadow-sm">
                    ✓
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 w-full max-w-2xl">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Recent Activity</h3>
        <div className="bg-white rounded-xl border border-slate-100 p-4 space-y-2">
          {gameLog.length > 0 ? (
            gameLog.map((log, i) => (
              <div key={i} className="text-xs text-slate-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                {log.replace('> ', '')}
              </div>
            ))
          ) : (
             <div className="text-xs text-slate-300 italic">Game initialized... waiting for input.</div>
          )}
        </div>
      </div>

    </div>
  );
};

export default BingoBoard;