import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

// core components
import Header from '../../components/header/header.jsx';
import HeaderBanner from '../../components/banner/banner.jsx';
import Footer from '../../components/footer/footer.jsx';

// sections for this page
import Buttons from './sections/buttons.jsx';

//채팅방

const ChatPage = () => {
    const [showChat, setShowChat] = useState(false);

    const toggleChat = () => {
        console.log('Chat toggle:', !showChat); // 상태 변경 확인
        setShowChat(!showChat);
    };

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
                // display: showChat ? 'block' : 'none', // 채팅창 보이기/숨기기
            }}
        >
            {/* <div
                style={{
                    height: '50px',
                    backgroundColor: '#007bff', // 네비게이션 바 색상
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 10px',
                    borderTopLeftRadius: '15px', // 상단 모서리 둥글게
                    borderTopRightRadius: '15px',
                }}
            >
                <Button style={{ backgroundColor: 'transparent', border: 'none' }}> 목록</Button>
                <h4>채팅</h4>
                <Button onClick={toggleChat} style={{ backgroundColor: 'transparent', border: 'none' }}>
                    닫기
                </Button>
            </div> */}
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

                    borderBottomLeftRadius: '15px', // 상단 모서리 둥글게
                    borderBottomRightRadius: '15px',
                }}
            >
                <Button style={{ backgroundColor: 'transparent', border: 'none', marginRight: '10px' }}>
                    목록(여기에 리스트 구현)
                </Button>
                <Button onClick={toggleChat} style={{ backgroundColor: 'transparent', border: 'none' }}>
                    무슨 버튼 넣지
                </Button>
            </div>
        </div>
    );
};

const Components = () => {
    const [showChatPage, setShowChatPage] = useState(false);

    const toggleChatPage = () => {
        console.log('Chat page visibility:', !showChatPage); // 토글 상태 로그
        setShowChatPage(!showChatPage);
    };

    return (
        <div id="main-wrapper">
            <Header />
            <div className="page-wrapper">
                <div className="container-fluid">
                    <HeaderBanner />
                    <Buttons />
                    <button className="fixed-chat-button" onClick={toggleChatPage}>
                        채팅창 이동
                    </button>
                    {showChatPage && <ChatPage />} {/* 조건부 렌더링 */}
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
