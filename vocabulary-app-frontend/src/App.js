// App.js
import React from 'react';
import Quiz from './quiz';
import AddWord from './AddWord';

function App() {
  // onWordAdded を利用してクイズコンポーネントの再読み込みなどの処理を行うことも可能です
  const handleWordAdded = (newWord) => {
    // ここで新しい単語をクイズリストに反映させるために何らかの処理を行うことができます
    console.log("新しい単語が追加されました:", newWord);
  };

  return (
    <div className="App">
      <Quiz />
      <AddWord onWordAdded={handleWordAdded} />
    </div>
  );
}

export default App;
