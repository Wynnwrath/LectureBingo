import { useState, useEffect } from 'react';

const WIN_LINES = [
  [0,1,2,3,4], [5,6,7,8,9], [10,11,12,13,14], [15,16,17,18,19], [20,21,22,23,24],
  [0,5,10,15,20], [1,6,11,16,21], [2,7,12,17,22], [3,8,13,18,23], [4,9,14,19,24],
  [0,6,12,18,24], [4,8,12,16,20]
];

const FREE_SPACE_IDX = 12;
const STORAGE_KEY = 'bingo_state_v1'; 

export const useBingo = (initialPhrases) => {
  
  const [grid, setGrid] = useState(() => {
    // A. Check LocalStorage first
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse save", e);
      }
    }

    let texts = [...initialPhrases];
    while(texts.length < 24) texts.push("");
    texts = texts.slice(0, 24); 

    const fullGrid = [
      ...texts.slice(0, 12),
      "❄️",
      ...texts.slice(12, 24)
    ];

    return fullGrid.map((text, idx) => ({
      id: idx,
      text: text,
      checked: idx === FREE_SPACE_IDX 
    }));
  });

  const [isWon, setIsWon] = useState(false);
  const [gameLog, setGameLog] = useState(["> SYSTEM READY"]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(grid));
  }, [grid]);

  const addToLog = (msg) => {
    setGameLog(prev => [`> ${msg}`, ...prev].slice(0, 3)); 
  };

  const updateCellText = (index, newText) => {
    if (index === FREE_SPACE_IDX) return; 
    const newGrid = [...grid];
    newGrid[index].text = newText;
    setGrid(newGrid);
  };

  const toggleCell = (index) => {
    if (index === FREE_SPACE_IDX) return; 
    
    const newGrid = [...grid];
    newGrid[index].checked = !newGrid[index].checked;
    setGrid(newGrid);
    
    // Check Win
    const hasWin = WIN_LINES.some(line => line.every(i => newGrid[i].checked));
    
    if (hasWin && !isWon) addToLog("BINGO DETECTED!");
    else addToLog(newGrid[index].checked ? "Box Checked" : "Box Unchecked");
    
    setIsWon(hasWin);
  };

  const shuffleGrid = () => {
    addToLog("Shuffling Board...");
    
    // Extract user texts 
    const currentTexts = grid
      .filter((_, i) => i !== FREE_SPACE_IDX)
      .map(c => c.text);
    
    // Shuffle
    for (let i = currentTexts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [currentTexts[i], currentTexts[j]] = [currentTexts[j], currentTexts[i]];
    }

    // Rebuild Grid 
    const newGrid = grid.map((cell, i) => {
      if (i < 12) return { ...cell, text: currentTexts[i], checked: false };
      if (i === 12) return { ...cell, text: "❄️", checked: true };
      if (i > 12) return { ...cell, text: currentTexts[i - 1], checked: false };
      return cell;
    });

    setGrid(newGrid);
    setIsWon(false);
  };

  const resetGame = () => {
    addToLog("Board Cleared");
    setGrid(grid.map((c, i) => ({ 
      ...c, 
      checked: i === FREE_SPACE_IDX 
    })));
    setIsWon(false);
  };

  return { grid, isWon, gameLog, updateCellText, toggleCell, shuffleGrid, resetGame };
};