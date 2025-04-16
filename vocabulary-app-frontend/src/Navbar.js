import React, { useState } from 'react';
import './Navbar.css';

const Navbar = ({ activeTab, setActiveTab, darkMode, toggleDarkMode }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setMenuOpen(false); // メニューを閉じる
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="logo">単語学習</div>

                <div className="navbar-controls">
                    {/* メニューボタン */}
                    <div
                        className={`menu-toggle ${menuOpen ? 'active' : ''}`}
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                    {/* テーマ切り替えボタン */}
                    <button
                        className="theme-toggle"
                        onClick={toggleDarkMode}
                        aria-label={darkMode ? "ライトモードに切り替え" : "ダークモードに切り替え"}
                    >
                        {darkMode ? '☀️' : '🌙'}
                    </button>
                </div>

                {/* ナビゲーションリンク */}
                <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
                    <li
                        className={activeTab === 'quiz' ? 'active' : ''}
                        onClick={() => handleTabClick('quiz')}
                    >
                        学習
                    </li>
                    <li
                        className={activeTab === 'add' ? 'active' : ''}
                        onClick={() => handleTabClick('add')}
                    >
                        単語追加
                    </li>
                    <li
                        className={activeTab === 'list' ? 'active' : ''}
                        onClick={() => handleTabClick('list')}
                    >
                        単語一覧
                    </li>
                    <li
                        className={activeTab === 'dashboard' ? 'active' : ''}
                        onClick={() => handleTabClick('dashboard')}
                    >
                        統計
                    </li>
                    <li
                        className={activeTab === 'data' ? 'active' : ''}
                        onClick={() => handleTabClick('data')}
                    >
                        データ管理
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar; 