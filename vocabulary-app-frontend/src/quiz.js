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
        <div className="quiz-container">
            <h2 style={{
                color: '#2c3e50',
                fontSize: '28px',
                marginBottom: '30px'
            }}>単語クイズ</h2>

            <div className="progress-bar">
                <div
                    className="progress"
                    style={{ width: `${(currentIndex / words.length) * 100}%` }}
                />
            </div>

            <div className="word-card">
                <p style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: '#34495e'
                }}>{currentWord.word}</p>

                {showMeaning ? (
                    <div style={{
                        fontSize: '24px',
                        color: '#7f8c8d',
                        marginTop: '20px'
                    }}>
                        <p>{currentWord.meaning}</p>
                        <div style={{ marginTop: '20px' }}>
                            <button
                                className="button correct"
                                onClick={() => handleAnswer(true)}
                            >
                                覚えている
                            </button>
                            <button
                                className="button incorrect"
                                onClick={() => handleAnswer(false)}
                            >
                                忘れていた
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        className="button"
                        onClick={() => setShowMeaning(true)}
                    >
                        意味を確認する
                    </button>
                )}
            </div>

            <p style={{
                fontSize: '18px',
                color: '#95a5a6'
            }}>
                進捗: {currentIndex + 1} / {words.length}
            </p>
        </div>
    );
};

export default Quiz;
