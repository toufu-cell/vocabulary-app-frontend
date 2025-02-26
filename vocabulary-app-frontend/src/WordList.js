import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WordList.css';

const WordList = () => {
    const [words, setWords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

    // 単語一覧を取得する関数
    const fetchWords = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${apiUrl}/api/words`);
            setWords(res.data);
            setError(null);
        } catch (error) {
            console.error("単語の取得に失敗しました", error);
            setError("単語の取得に失敗しました。サーバーの接続を確認してください。");
        } finally {
            setLoading(false);
        }
    };

    // コンポーネントマウント時に単語一覧を取得
    useEffect(() => {
        fetchWords();
    }, []);

    // 単語を削除する関数
    const handleDelete = async (id, word) => {
        if (!window.confirm(`単語「${word}」を削除してもよろしいですか？`)) {
            return;
        }

        try {
            setLoading(true);
            await axios.delete(`${apiUrl}/api/words/${id}`);
            setMessage(`単語「${word}」を削除しました`);
            fetchWords(); // 単語一覧を再取得
        } catch (error) {
            console.error("単語の削除に失敗しました", error);
            setMessage(`エラー: 単語の削除に失敗しました`);
        } finally {
            setLoading(false);
        }
    };

    if (loading && words.length === 0) return <div className="word-list-container loading">読み込み中...</div>;
    if (error) return <div className="word-list-container error">{error}</div>;
    if (words.length === 0) return <div className="word-list-container empty">登録されている単語はありません</div>;

    return (
        <div className="quiz-container">
            <h2 className="form-title">単語一覧</h2>
            {loading ? (
                <p>読み込み中...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : (
                <div className="table-responsive">
                    <table className="word-list-table">
                        <thead>
                            <tr className="word-list-header">
                                <th>単語</th>
                                <th>意味</th>
                                <th>レベル</th>
                                <th>学習回数</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {words.map((word) => (
                                <tr key={word.id} className="word-list-row">
                                    <td className="word-column">{word.word}</td>
                                    <td className="meaning-column">{word.meaning}</td>
                                    <td className="level-column">{word.level || 0}</td>
                                    <td className="reviews-column">{word.totalReviews || 0}</td>
                                    <td className="actions-column">
                                        <button
                                            onClick={() => handleDelete(word.id, word.word)}
                                            className="action-button delete"
                                        >
                                            削除
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default WordList; 