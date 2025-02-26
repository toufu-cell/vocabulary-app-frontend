import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalWords: 0,
        learnedWords: 0,
        reviewsDue: 0,
        averageAccuracy: 0,
        dailyProgress: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

    // 統計データを取得する関数
    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${apiUrl}/api/stats`);
            setStats(res.data);
            setError(null);
        } catch (error) {
            console.error("統計データの取得に失敗しました", error);
            setError("統計データの取得に失敗しました。サーバーの接続を確認してください。");
        } finally {
            setLoading(false);
        }
    };

    // コンポーネントマウント時に統計データを取得
    useEffect(() => {
        fetchStats();

        // 1分ごとに統計を更新
        const intervalId = setInterval(fetchStats, 60000);

        // クリーンアップ関数
        return () => clearInterval(intervalId);
    }, []);

    if (loading) return <div className="dashboard-container loading">読み込み中...</div>;
    if (error) return <div className="dashboard-container error">{error}</div>;

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">学習ダッシュボード</h2>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>登録単語数</h3>
                    <p className="stat-value">{stats.totalWords}</p>
                </div>

                <div className="stat-card">
                    <h3>習得済み単語</h3>
                    <p className="stat-value">
                        {stats.learnedWords}
                        <span className="stat-percentage">
                            ({stats.totalWords > 0 ? Math.round((stats.learnedWords / stats.totalWords) * 100) : 0}%)
                        </span>
                    </p>
                </div>

                <div className="stat-card">
                    <h3>今日の復習</h3>
                    <p className="stat-value">{stats.reviewsDue}</p>
                </div>

                <div className="stat-card">
                    <h3>正答率</h3>
                    <p className="stat-value">{stats.averageAccuracy}%</p>
                </div>
            </div>

            <div className="chart-container">
                <h3>過去7日間の学習活動</h3>
                <div className="chart">
                    {stats.dailyProgress.map((day, index) => (
                        <div key={index} className="chart-bar-container">
                            <div
                                className="chart-bar"
                                style={{
                                    height: `${(day.reviewCount / Math.max(...stats.dailyProgress.map(d => d.reviewCount || 1))) * 100}%`
                                }}
                            ></div>
                            <p className="chart-label">{day.date}</p>
                            <p className="chart-value">{day.reviewCount}</p>
                        </div>
                    ))}
                </div>
            </div>

            <button className="refresh-button" onClick={fetchStats}>
                更新
            </button>
        </div>
    );
};

export default Dashboard; 