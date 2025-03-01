import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DataManagement.css';

const DataManagement = () => {
    const [importFile, setImportFile] = useState(null);
    const [updateExisting, setUpdateExisting] = useState(false);
    const [keepProgress, setKeepProgress] = useState(true);
    const [importStatus, setImportStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalWords: 0,
        reviewsDue: 0,
        retentionRate: 0,
        nextReviewDate: null
    });

    // コンポーネントマウント時に統計情報を取得
    useEffect(() => {
        fetchStats();
    }, []);

    // 統計情報を取得する関数
    const fetchStats = async () => {
        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
            const res = await axios.get(`${apiUrl}/api/stats`);
            setStats({
                totalWords: res.data.totalWords,
                reviewsDue: res.data.reviewsDue,
                retentionRate: res.data.retentionRate,
                nextReviewDate: new Date(res.data.nextReviewDate).toLocaleDateString('ja-JP')
            });
        } catch (error) {
            console.error("統計情報の取得に失敗しました", error);
            setError("統計情報の取得に失敗しました。");
        }
    };

    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

    // ファイル選択ハンドラー
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImportFile(file);
            setError(null);
        }
    };

    // エクスポート処理
    const handleExport = async () => {
        try {
            setLoading(true);
            setError(null);

            // データをエクスポートするAPIを呼び出し
            window.location.href = `${apiUrl}/api/export`;

            // 少し待ってからローディング状態を解除
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        } catch (error) {
            console.error('エクスポートに失敗しました', error);
            setError('エクスポートに失敗しました。再試行してください。');
            setLoading(false);
        }
    };

    // インポート処理
    const handleImport = async () => {
        if (!importFile) {
            setError('インポートするファイルを選択してください');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setImportStatus(null);

            // ファイルを読み込む
            const reader = new FileReader();

            reader.onload = async (e) => {
                try {
                    const fileContent = e.target.result;
                    const importData = JSON.parse(fileContent);

                    // データをインポートするAPIを呼び出し
                    const response = await axios.post(
                        `${apiUrl}/api/import?updateExisting=${updateExisting}&keepProgress=${keepProgress}`,
                        importData
                    );

                    setImportStatus(response.data);
                    setImportFile(null);
                    // ファイル入力をリセット
                    document.getElementById('import-file').value = '';
                } catch (error) {
                    console.error('インポートに失敗しました', error);
                    setError('インポートに失敗しました。ファイル形式を確認してください。');
                } finally {
                    setLoading(false);
                }
            };

            reader.onerror = () => {
                setError('ファイルの読み込みに失敗しました');
                setLoading(false);
            };

            reader.readAsText(importFile);
        } catch (error) {
            console.error('インポートに失敗しました', error);
            setError('インポートに失敗しました。再試行してください。');
            setLoading(false);
        }
    };

    return (
        <div className="data-management-container">
            <h2 className="form-title">データ管理</h2>

            <div className="stats-section">
                <h3>学習統計</h3>
                <div className="stats-grid">
                    <div className="stat-box">
                        <div className="stat-value">{stats.totalWords}</div>
                        <div className="stat-label">総単語数</div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-value">{stats.reviewsDue}</div>
                        <div className="stat-label">復習予定</div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-value">{stats.retentionRate}%</div>
                        <div className="stat-label">定着率</div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-value">{stats.nextReviewDate}</div>
                        <div className="stat-label">次回復習日</div>
                    </div>
                </div>
            </div>

            <div className="data-section">
                <h3>データのエクスポート</h3>
                <p>現在の単語データをJSONファイルとしてダウンロードします。</p>
                <button
                    className="button export-button"
                    onClick={handleExport}
                    disabled={loading}
                >
                    {loading ? 'エクスポート中...' : 'データをエクスポート'}
                </button>
            </div>

            <div className="data-section">
                <h3>データのインポート</h3>
                <p>JSONファイルから単語データをインポートします。</p>

                <div className="file-input-container">
                    <input
                        type="file"
                        id="import-file"
                        accept=".json"
                        onChange={handleFileChange}
                        disabled={loading}
                    />
                    <label htmlFor="import-file" className="file-input-label">
                        {importFile ? importFile.name : 'ファイルを選択'}
                    </label>
                </div>

                <div className="import-options">
                    <div className="checkbox-container">
                        <input
                            type="checkbox"
                            id="update-existing"
                            checked={updateExisting}
                            onChange={() => setUpdateExisting(!updateExisting)}
                            disabled={loading}
                        />
                        <label htmlFor="update-existing">既存の単語を更新する</label>
                    </div>

                    <div className="checkbox-container">
                        <input
                            type="checkbox"
                            id="keep-progress"
                            checked={keepProgress}
                            onChange={() => setKeepProgress(!keepProgress)}
                            disabled={loading || !updateExisting}
                        />
                        <label htmlFor="keep-progress" className={!updateExisting ? 'disabled' : ''}>
                            既存の学習進捗を保持する
                        </label>
                    </div>
                </div>

                <button
                    className="button import-button"
                    onClick={handleImport}
                    disabled={loading || !importFile}
                >
                    {loading ? 'インポート中...' : 'データをインポート'}
                </button>

                {error && <p className="error-message">{error}</p>}

                {importStatus && (
                    <div className="import-status">
                        <h4>インポート結果</h4>
                        <p>{importStatus.message}</p>
                        <ul>
                            <li>追加: {importStatus.added}件</li>
                            <li>更新: {importStatus.updated}件</li>
                            <li>スキップ: {importStatus.skipped}件</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DataManagement;
