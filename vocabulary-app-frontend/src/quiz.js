// Quiz.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Quiz = () => {
    const [words, setWords] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showMeaning, setShowMeaning] = useState(false);
    const [confidence, setConfidence] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // コンポーネントマウント時にサーバーから単語を取得
    useEffect(() => {
        fetchWords();
    }, []);

    // サーバーから学習対象の単語を取得する関数
    const fetchWords = async () => {
        try {
            setLoading(true);
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
            const res = await axios.get(`${apiUrl}/api/study`);
            setWords(res.data);
            setCurrentIndex(0);
            setShowMeaning(false);
            setError(null);
        } catch (error) {
            console.error("単語の取得に失敗しました", error);
            setError("単語の取得に失敗しました。サーバーの接続を確認してください。");
        } finally {
            setLoading(false);
        }
    };

    // ユーザーの回答（正解／不正解）をサーバーに送信し、次の単語へ進む処理
    const handleAnswer = async (correct, confidence) => {
        if (words.length === 0) return;
        const currentWord = words[currentIndex];
        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
            await axios.post(`${apiUrl}/api/words/${currentWord.id}/update`, {
                correct,
                confidence
            });
            const nextIndex = currentIndex + 1;
            if (nextIndex < words.length) {
                setCurrentIndex(nextIndex);
                setShowMeaning(false);
                setConfidence(0);
            } else {
                alert("学習セッション終了！新しい単語を取得します。");
                fetchWords();
            }
        } catch (error) {
            console.error("学習結果の更新に失敗しました", error);
            setError("学習結果の更新に失敗しました。再試行してください。");
        }
    };

    if (loading) return <div className="quiz-container loading">読み込み中...</div>;
    if (error) return <div className="quiz-container error">{error}</div>;
    if (words.length === 0) return <div className="quiz-container empty">学習すべき単語はありません</div>;

    const currentWord = words[currentIndex];

    return (
        <div className="quiz-container">
            <h2 className="quiz-title">単語クイズ</h2>

            <div className="progress-bar">
                <div
                    className="progress"
                    style={{ width: `${(currentIndex / words.length) * 100}%` }}
                />
            </div>

            <div className="word-card">
                <p className="word-text">{currentWord.word}</p>
                <p className="review-count">
                    学習回数: {currentWord.totalReviews || 0}回目
                </p>

                {showMeaning ? (
                    <div className="meaning-container">
                        <p className="meaning-text">{currentWord.meaning}</p>
                        <div className="confidence-slider">
                            <p>自信度: {confidence}</p>
                            <input
                                type="range"
                                min="0"
                                max="5"
                                value={confidence}
                                onChange={(e) => setConfidence(parseInt(e.target.value))}
                            />
                        </div>
                        <div className="answer-buttons">
                            <button
                                className="button correct"
                                onClick={() => handleAnswer(true, confidence)}
                            >
                                覚えている
                            </button>
                            <button
                                className="button incorrect"
                                onClick={() => handleAnswer(false, confidence)}
                            >
                                忘れていた
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        className="button show-meaning"
                        onClick={() => setShowMeaning(true)}
                    >
                        意味を確認する
                    </button>
                )}
            </div>

            <p className="progress-text">
                進捗: {currentIndex + 1} / {words.length}
            </p>
        </div>
    );
};

export default Quiz;
