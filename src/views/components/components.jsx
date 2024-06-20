import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';

import Header from '../../components/header/header.jsx';
import HeaderBanner from '../../components/banner/banner.jsx';
import Footer from '../../components/footer/footer.jsx';

import Buttons from './sections/buttons.jsx';
import ChatList from './sections/Chatlist.jsx';

import { DataContext } from '../../context/DataContext'; // DataContext
import chatImg from '../../assets/images/icons/chat3.png'; // 이미지 경로 수정

// 채팅방
const ChatPage = ({ toggleChat }) => {
    return (
        <div
            className="chat-page"
            style={{
                position: 'fixed', // 채팅 페이지 고정
                bottom: 100,
                right: 30,
                width: '450px', // 채팅창 크기 조절
                height: '700px',
                backgroundColor: '#fff', // 배경색
                border: '1px solid #ccc', // 테두리
                padding: '10px',
                zIndex: 1000, // 다른 요소 위에 표시
                borderRadius: '15px', // 모서리 둥글게
            }}
        >
            <ChatList toggleChat={toggleChat} />
        </div>
    );
};

const Components = () => {
    const [showChatPage, setShowChatPage] = useState(false);
    const [currentChat, setCurrentChat] = useState(null);

    const { data } = useContext(DataContext); // DataContext에서 데이터를 가져옵니다
    const { loginUser } = data || {}; // loginUser를 가져옵니다

    const toggleChatPage = () => {
        console.log('Chat page visibility:', !showChatPage); // 토글 상태 로그
        setShowChatPage(!showChatPage);
    };

    const toggleChat = (chatId, otherUserId) => {
        setCurrentChat({ chatId, otherUserId });
        setShowChatPage(true);
    };

    return (
        <div id="main-wrapper">
            <Header />
            <div className="page-wrapper">
                <div className="container-fluid">
                    <HeaderBanner />
                    <Buttons userId={loginUser?.email} /> {/* userId를 Buttons 컴포넌트로 전달 */}
                    <button
                        className="fixed-chat-button"
                        onClick={toggleChatPage}
                        style={{
                            borderRadius: '50%',
                            width: '60px',
                            height: '60px',
                            position: 'fixed',
                            bottom: '30px',
                            right: '30px',
                            zIndex: '1000',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        <img src={chatImg} alt="chat" style={{ width: '200%', height: '110%' }} />
                    </button>
                    {showChatPage && <ChatPage toggleChat={toggleChat} />} {/* 조건부 렌더링 */}
                </div>
            </div>
            <Footer />
        </div>
    );
};

Components.propTypes = {
    classes: PropTypes.object,
};

export default Components;
