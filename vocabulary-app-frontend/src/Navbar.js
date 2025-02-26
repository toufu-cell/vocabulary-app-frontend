import React from 'react';
import './Navbar.css';

const Navbar = ({ activeTab, setActiveTab }) => {
    return (
        <nav className="navbar">
            <div className="logo">単語学習アプリ</div>
            <ul className="nav-links">
                <li
                    className={activeTab === 'quiz' ? 'active' : ''}
                    onClick={() => setActiveTab('quiz')}
                >
                    学習
                </li>
                <li
                    className={activeTab === 'add' ? 'active' : ''}
                    onClick={() => setActiveTab('add')}
                >
                    単語追加
                </li>
                <li
                    className={activeTab === 'list' ? 'active' : ''}
                    onClick={() => setActiveTab('list')}
                >
                    単語一覧
                </li>
            </ul>
        </nav>
    );
};

export default Navbar; 