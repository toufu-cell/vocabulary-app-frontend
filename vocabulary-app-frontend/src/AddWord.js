// AddWord.js
import React, { useState } from 'react';
import axios from 'axios';

const AddWord = ({ onWordAdded }) => {
    const [word, setWord] = useState('');
    const [meaning, setMeaning] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!word || !meaning) {
            setMessage("単語と意味の両方を入力してください");
            return;
        }
        
        setLoading(true);
        try {
            const res = await axios.post(`${apiUrl}/api/words`, { word, meaning });
            setMessage(`単語 "${res.data.word}" を追加しました`);
            setWord('');
            setMeaning('');
            if (onWordAdded) {
                onWordAdded(res.data);
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setMessage(`エラー: ${error.response.data.message}`);
            } else {
                console.error("単語の追加に失敗しました", error);
                setMessage("単語の追加に失敗しました");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="quiz-container">
            <h2 className="form-title">単語の追加</h2>
            <form onSubmit={handleSubmit} className="add-word-form">
                <div className="form-group">
                    <label htmlFor="word-input">新しい単語</label>
                    <input
                        id="word-input"
                        type="text"
                        value={word}
                        onChange={(e) => setWord(e.target.value)}
                        placeholder="新しい単語を入力"
                        disabled={loading}
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="meaning-input">意味</label>
                    <input
                        id="meaning-input"
                        type="text"
                        value={meaning}
                        onChange={(e) => setMeaning(e.target.value)}
                        placeholder="意味を入力"
                        disabled={loading}
                    />
                </div>
                
                <button
                    type="submit"
                    className="button add-button"
                    disabled={loading}
                >
                    {loading ? '追加中...' : '追加する'}
                </button>
            </form>
            
            {message && (
                <div className={`message ${message.includes('エラー') ? 'error' : 'success'}`}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default AddWord;
