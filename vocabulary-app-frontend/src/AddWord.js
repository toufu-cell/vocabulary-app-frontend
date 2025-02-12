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
            // 親コンポーネントへの通知（必要に応じて）
            if (onWordAdded) {
                onWordAdded(res.data);
            }
        } catch (error) {
            console.error("単語の追加に失敗しました", error);
            setMessage("単語の追加に失敗しました");
        }
    };

    return (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
            <h2>単語の追加</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        単語:
                        <input
                            type="text"
                            value={word}
                            onChange={(e) => setWord(e.target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        意味:
                        <input
                            type="text"
                            value={meaning}
                            onChange={(e) => setMeaning(e.target.value)}
                        />
                    </label>
                </div>
                <button type="submit">追加</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AddWord;
