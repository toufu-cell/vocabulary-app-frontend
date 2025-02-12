// Quiz.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Quiz = () => {
    const [words, setWords] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showMeaning, setShowMeaning] = useState(false);

    // コンポーネントマウント時にサーバーから単語を取得
    useEffect(() => {
        fetchWords();
    }, []);

    // サーバーから学習対象の単語を取得する関数
    const fetchWords = async () => {
        try {
            const res = await axios.get('http://localhost:3001/api/study');
            setWords(res.data);
            setCurrentIndex(0);
            setShowMeaning(false);
        } catch (error) {
            console.error("単語の取得に失敗しました", error);
        }
    };

    // ユーザーの回答（正解／不正解）をサーバーに送信し、次の単語へ進む処理
    const handleAnswer = async (correct) => {
        if (words.length === 0) return;
        const currentWord = words[currentIndex];
        try {
            await axios.post(`http://localhost:3001/api/words/${currentWord.id}/update`, { correct });
            // 次の単語へ進む
            const nextIndex = currentIndex + 1;
            if (nextIndex < words.length) {
                setCurrentIndex(nextIndex);
                setShowMeaning(false);
            } else {
                alert("クイズ終了！新しい単語を取得します。");
                fetchWords();
            }
        } catch (error) {
            console.error("学習結果の更新に失敗しました", error);
        }
    };

    if (words.length === 0) return <div>学習すべき単語はありません</div>;

    const currentWord = words[currentIndex];

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>単語クイズ</h2>
            <div style={{ margin: "20px" }}>
                <p style={{ fontSize: "24px" }}>単語: {currentWord.word}</p>
                {showMeaning ? (
                    <div>
                        <p style={{ fontSize: "20px" }}>意味: {currentWord.meaning}</p>
                    </div>
                ) : (
                    <button onClick={() => setShowMeaning(true)}>意味を見る</button>
                )}
            </div>
            {showMeaning && (
                <div>
                    <button onClick={() => handleAnswer(true)}>正解</button>
                    <button onClick={() => handleAnswer(false)}>不正解</button>
                </div>
            )}
            <p>{currentIndex + 1} / {words.length}</p>
        </div>
    );
};

export default Quiz;
