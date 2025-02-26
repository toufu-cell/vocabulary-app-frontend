// App.js
import React, { useState } from 'react';
import Quiz from './quiz';
import AddWord from './AddWord';
import WordList from './WordList';
import Navbar from './Navbar';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('quiz');

  const handleWordAdded = (newWord) => {
    console.log("新しい単語が追加されました:", newWord);
    // 単語追加後に学習タブに切り替える
    setActiveTab('quiz');
  };

  return (
    <div className="App">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="content-container">
        {activeTab === 'quiz' ? (
          <Quiz />
        ) : activeTab === 'add' ? (
          <AddWord onWordAdded={handleWordAdded} />
        ) : (
          <WordList />
        )}
      </div>
    </div>
  );
}

export default App;
