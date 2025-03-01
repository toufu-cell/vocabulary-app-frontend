import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Quiz.css';

const Quiz = () => {
    const [words, setWords] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showMeaning, setShowMeaning] = useState(false);
    const [confidence, setConfidence] = useState(0.5);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [studyComplete, setStudyComplete] = useState(false);
    const [nextReviewInfo, setNextReviewInfo] = useState('');
    const [retentionRate, setRetentionRate] = useState(0);

    useEffect(() => {
        fetchWords();
    }, []);

    const fetchWords = async () => {
        try {
            setLoading(true);
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
            const res = await axios.get(`${apiUrl}/api/study`);
            setWords(res.data.words);
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

    const revealMeaning = () => {
        setShowMeaning(true);
    };

    const handleConfidenceChange = (e) => {
        const newValue = parseFloat(e.target.value);
        setConfidence(newValue);
    };

    const evaluateLearning = (confidence) => {
        const grade = Math.min(5, Math.max(1, Math.ceil(confidence * 5)));
        return {
            correct: grade >= 3,
            confidence: grade / 5
        };
    };

    const handleNext = async () => {
        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
            const currentWord = words[currentIndex];

            const { correct, confidence: normalizedConfidence } = evaluateLearning(confidence);

            const updateResponse = await axios.post(
                `${apiUrl}/api/words/${currentWord.id}/update`,
                {
                    correct,
                    confidence: normalizedConfidence
                }
            );

            let nextReviewTimestamp = Number(updateResponse.data.word.nextReviewDate);

            if (isNaN(nextReviewTimestamp) || nextReviewTimestamp <= 0) {
                throw new Error('無効な次回復習日時です');
            }

            const now = Date.now();
            let formattedDate;
            const nextReviewDateObj = new Date(nextReviewTimestamp);

            if (updateResponse.data.word.totalReviews === 1 ||
                updateResponse.data.word.totalReviews === 2) {
                formattedDate = '5分後';
                nextReviewDateObj.setTime(now + 5 * 60 * 1000);
                nextReviewTimestamp = now + 5 * 60 * 1000;
            }
            else if (nextReviewTimestamp - now <= 5 * 60 * 1000) {
                formattedDate = '5分後';
            }
            else if (nextReviewTimestamp - now <= 60 * 60 * 1000) {
                const minutes = Math.round((nextReviewTimestamp - now) / (60 * 1000));
                formattedDate = `${minutes}分後`;
            }
            else if (nextReviewTimestamp - now <= 24 * 60 * 60 * 1000) {
                const hours = Math.round((nextReviewTimestamp - now) / (60 * 60 * 1000));
                formattedDate = `${hours}時間後`;
            }
            else {
                formattedDate = nextReviewDateObj.toLocaleString('ja-JP', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                });
            }

            const retention = Number(updateResponse.data.word.retentionRate);
            const retentionPercentage = isNaN(retention) ? 0 : (retention * 100);
            const rate = Math.max(0, Math.min(100, retentionPercentage));
            setRetentionRate(rate);

            if (currentIndex < words.length - 1) {
                setCurrentIndex(currentIndex + 1);
                setShowMeaning(false);
                setConfidence(0.5);
                setNextReviewInfo(`次回の復習: ${formattedDate}`);
            } else {
                setStudyComplete(true);
                const statsRes = await axios.get(`${apiUrl}/api/stats`);
                setNextReviewInfo(
                    `次回の復習: ${statsRes.data.reviewsDue}単語 (次回提示: ${formattedDate})`
                );
            }
        } catch (error) {
            console.error("学習結果の送信に失敗しました", error);
            if (error.response) {
                setError(`学習結果の送信に失敗しました: ${error.response.data.error}`);
            } else {
                setError("学習結果の送信に失敗しました。ネットワーク接続を確認してください。");
            }
        }
    };

    const speakWord = (word) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.lang = 'en-US';
            speechSynthesis.speak(utterance);
        }
    };

    if (loading) {
        return (
            <div className="quiz-container">
                <p className="loading-text">単語を読み込み中...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="quiz-container">
                <p className="error-message">{error}</p>
                <button className="button" onClick={fetchWords}>再試行</button>
            </div>
        );
    }

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

    if (studyComplete) {
        return (
            <div className="quiz-container">
                <h2>学習完了！</h2>
                <p>今日の学習は終了しました。</p>
                {nextReviewInfo && <p>{nextReviewInfo}</p>}
                <p>記憶保持率: {typeof retentionRate === 'number' ? retentionRate.toFixed(1) : '0.0'}%</p>
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
                <div className="word-stats">
                    <p className="review-count">
                        学習回数: {currentWord.totalReviews || 0}回目
                    </p>
                    <p className="word-level">
                        レベル: {currentWord.level || 1}
                    </p>
                </div>

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
