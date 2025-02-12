// AddWord.js
import React, { useState } from 'react';
import axios from 'axios';

const AddWord = ({ onWordAdded }) => {
    const [word, setWord] = useState('');
    const [meaning, setMeaning] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!word || !meaning) {
            setMessage("単語と意味の両方を入力してください");
            return;
        }
        try {
            const res = await axios.post('http://localhost:3001/api/words', { word, meaning });
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
        }
    };

    return (
        <div className="quiz-container">
            <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>単語の追加</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <input
                        type="text"
                        value={word}
                        onChange={(e) => setWord(e.target.value)}
                        placeholder="新しい単語を入力"
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '5px',
                            border: '1px solid #ddd',
                            marginBottom: '10px'
                        }}
                    />
                    <input
                        type="text"
                        value={meaning}
                        onChange={(e) => setMeaning(e.target.value)}
                        placeholder="意味を入力"
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '5px',
                            border: '1px solid #ddd'
                        }}
                    />
                </div>
                <button
                    type="submit"
                    className="button"
                >
                    追加する
                </button>
            </form>
            {message && (
                <p style={{
                    marginTop: '15px',
                    color: message.includes('失敗') ? '#e74c3c' : '#27ae60'
                }}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default AddWord;
