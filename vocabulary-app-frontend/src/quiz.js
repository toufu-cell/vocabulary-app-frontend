// Quiz.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Quiz.css';

const Quiz = () => {
    const [words, setWords] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showMeaning, setShowMeaning] = useState(false);
    const [confidence, setConfidence] = useState(0.5); // デフォルト値を0.5に設定
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [studyComplete, setStudyComplete] = useState(false);
    const [nextReviewInfo, setNextReviewInfo] = useState('');

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
            setStudyComplete(false);
            setNextReviewInfo('');
            setError(null);
        } catch (error) {
            console.error("単語の取得に失敗しました", error);
            setError("単語の取得に失敗しました。サーバーの接続を確認してください。");
        } finally {
            setLoading(false);
        }
    };

    // 意味を表示する関数
    const revealMeaning = () => {
        setShowMeaning(true);
    };

    // 信頼度スライダーの変更を処理する関数
    const handleConfidenceChange = (e) => {
        // 明示的に数値に変換して状態を更新
        const newValue = parseFloat(e.target.value);
        console.log("スライダー値が変更されました:", newValue); // デバッグ用
        setConfidence(newValue);
    };

    // 次の単語に進む関数
    const handleNext = async () => {
        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
            const currentWord = words[currentIndex];

            // 学習結果をサーバーに送信
            await axios.post(`${apiUrl}/api/study/${currentWord.id}`, {
                confidence: confidence
            });

            // 次の単語に進む
            if (currentIndex < words.length - 1) {
                setCurrentIndex(currentIndex + 1);
                setShowMeaning(false);
                setConfidence(0.5); // 信頼度をリセット
            } else {
                setStudyComplete(true);
                // 次回の復習情報を取得
                const statsRes = await axios.get(`${apiUrl}/api/stats`);
                setNextReviewInfo(`次回の復習: ${statsRes.data.reviewsDue}単語`);
            }
        } catch (error) {
            console.error("学習結果の送信に失敗しました", error);
            setError("学習結果の送信に失敗しました。");
        }
    };

    // 単語の発音を読み上げる関数
    const speakWord = (word) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.lang = 'en-US'; // 英語の発音に設定
            speechSynthesis.speak(utterance);
        }
    };

    // ローディング中の表示
    if (loading) {
        return (
            <div className="quiz-container">
                <p className="loading-text">単語を読み込み中...</p>
            </div>
        );
    }

    // エラー表示
    if (error) {
        return (
            <div className="quiz-container">
                <p className="error-message">{error}</p>
                <button className="button" onClick={fetchWords}>再試行</button>
            </div>
        );
    }

    // 学習する単語がない場合
    if (words.length === 0) {
        return (
            <div className="quiz-container">
                <h2>おめでとうございます！</h2>
                <p>現在学習する単語はありません。</p>
                <p>新しい単語を追加するか、後でまた確認してください。</p>
                <button className="button" onClick={fetchWords}>更新</button>
            </div>
        );
    }

    // 学習完了時の表示
    if (studyComplete) {
        return (
            <div className="quiz-container">
                <h2>学習完了！</h2>
                <p>今日の学習は終了しました。</p>
                {nextReviewInfo && <p>{nextReviewInfo}</p>}
                <button className="button" onClick={fetchWords}>もう一度学習する</button>
            </div>
        );
    }

    const currentWord = words[currentIndex];

    return (
        <div className="quiz-container">
            <div className="progress-info">
                <span>{currentIndex + 1} / {words.length}</span>
            </div>

            <div className="word-card">
                <div className="word-header">
                    <p className="word-text">{currentWord.word}</p>
                    <button
                        className="speak-button"
                        onClick={() => speakWord(currentWord.word)}
                        aria-label="発音を聞く"
                    >
                        <span role="img" aria-label="スピーカー">🔊</span>
                    </button>
                </div>
                <p className="review-count">
                    学習回数: {currentWord.totalReviews || 0}回目
                </p>

                {showMeaning ? (
                    <>
                        <p className="meaning-text">{currentWord.meaning}</p>

                        <div className="confidence-container">
                            <p className="confidence-label">
                                この単語をどれくらい覚えていましたか？
                            </p>
                            <div className="confidence-slider-container">
                                <span className="confidence-min">全く自信なし</span>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={confidence}
                                    onChange={handleConfidenceChange}
                                    className="confidence-slider"
                                    onTouchEnd={handleConfidenceChange} // タッチ操作のサポート追加
                                    onTouchMove={handleConfidenceChange} // タッチ操作のサポート追加
                                />
                                <span className="confidence-max">完全に自信あり</span>
                            </div>
                            <div className="confidence-value">
                                {Math.round(confidence * 100)}%
                            </div>
                        </div>

                        <button
                            className="button next-button"
                            onClick={handleNext}
                        >
                            次へ
                        </button>
                    </>
                ) : (
                    <button
                        className="button show-meaning-button"
                        onClick={revealMeaning}
                    >
                        意味を表示
                    </button>
                )}
            </div>
        </div>
    );
};

export default Quiz;
