import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';

import Header from '../../components/header/header.jsx';
import HeaderBanner from '../../components/banner/banner.jsx';
import Footer from '../../components/footer/footer.jsx';

import Buttons from './sections/buttons.jsx';
import ChatList from './sections/Chatlist.jsx';

import { DataContext } from '../../context/DataContext'; // DataContext를 가져옵니다

// 채팅방
const ChatPage = ({ toggleChat }) => {
    return (
        <div
            className="chat-page"
            style={{
                position: 'fixed', // 채팅 페이지 고정
                bottom: 90,
                right: 30,
                width: '450px', // 채팅창 크기 조절
                height: '60%',
                backgroundColor: '#fff', // 배경색
                border: '1px solid #ccc', // 테두리
                padding: '10px',
                zIndex: 1000, // 다른 요소 위에 표시
                borderRadius: '15px', // 모서리 둥글게
            }}
        >
            <ChatList toggleChat={toggleChat} />
            <div
                style={{
                    position: 'absolute', // 절대 위치
                    bottom: '0', // 하단에 고정
                    left: '0', // 왼쪽 정렬
                    width: '100%', // 컨테이너 전체 폭
                    backgroundColor: '#007bff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center', // 가운데 정렬
                    borderTop: '1px solid #ccc', // 상단에 경계선 추가
                    borderBottomLeftRadius: '15px', // 하단 모서리 둥글게
                    borderBottomRightRadius: '15px',
                }}
            >
                {/* 추가 버튼을 여기에 배치할 수 있습니다 */}
            </div>
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
                    <button className="fixed-chat-button" onClick={toggleChatPage}>
                        채팅창 이동
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
