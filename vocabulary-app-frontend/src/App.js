// App.js
import React, { useState, useEffect } from 'react';
import Quiz from './quiz';
import AddWord from './AddWord';
import WordList from './WordList';
import Dashboard from './Dashboard'; // ダッシュボードをインポート
import DataManagement from './DataManagement'; // データ管理コンポーネントをインポート
import Navbar from './Navbar';
import './App.css';
import './DarkMode.css'; // ダークモードのCSSをインポート

function App() {
  const [activeTab, setActiveTab] = useState('quiz');
  const [darkMode, setDarkMode] = useState(false);

  // ローカルストレージからダークモード設定を読み込む
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
      setDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  // ダークモード切り替え関数
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);

    if (newMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    // 設定をローカルストレージに保存
    localStorage.setItem('darkMode', newMode);
  };

  const handleWordAdded = (newWord) => {
    console.log("新しい単語が追加されました:", newWord);
    // 単語追加後に学習タブに切り替える
    setActiveTab('quiz');
  };

  return (
    <div className="App">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
      <div className="content-container">
        {activeTab === 'quiz' ? (
          <Quiz />
        ) : activeTab === 'add' ? (
          <AddWord onWordAdded={handleWordAdded} />
        ) : activeTab === 'list' ? (
          <WordList />
        ) : activeTab === 'dashboard' ? (
          <Dashboard />
        ) : activeTab === 'data' ? (
          <DataManagement />
        ) : null}
      </div>
    </div>
  );
}

export default App;
