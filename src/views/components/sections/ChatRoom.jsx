import React, { useState, useEffect, useRef } from 'react';
import { Container, Button, Input, InputGroup, InputGroupText } from 'reactstrap';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const ChatRoom = ({ chatId, otherUserId, loginUserId, goBack }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const stompClient = useRef(null);

    useEffect(() => {
        fetchMessages(chatId);
        connectWebSocket();

        return () => {
            if (stompClient.current) {
                stompClient.current.deactivate();
            }
        };
    }, [chatId]);

    const fetchMessages = (headerId) => {
        fetch(`http://localhost:8080/api/messages/byHeaderId/${headerId}`)
            .then((response) => response.json())
            .then((data) => {
                setMessages(data);
            })
            .catch((error) => console.error('Error:', error));
    };

    const connectWebSocket = () => {
        const socket = new SockJS('http://localhost:8080/ws');
        stompClient.current = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log('Connected to WebSocket');
                stompClient.current.subscribe(`/topic/chat/${chatId}`, (message) => {
                    const receivedMessage = JSON.parse(message.body);
                    setMessages((prevMessages) => [...prevMessages, receivedMessage]);
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
        });

        stompClient.current.activate();
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
    };

    const handleSend = () => {
        if (message.trim() !== '') {
            const newMessage = {
                headerId: chatId,
                fromId: loginUserId,
                toId: otherUserId,
                content: message.trim(),
                time: formatDate(new Date()), // 현재 시간을 설정합니다.
            };
            setMessages([...messages, newMessage]);
            setMessage('');

            // Save message to the server
            fetch('http://localhost:8080/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newMessage),
            })
                .then((response) => response.json())
                .then((data) => {
                    // WebSocket을 통해 새 메시지를 브로드캐스트합니다.
                    stompClient.current.publish({
                        destination: `/app/chat/${chatId}`,
                        body: JSON.stringify(data),
                    });
                })
                .catch((error) => console.error('Error:', error));
        }
    };

    return (
        <Container style={{ position: 'relative', height: '100vh', padding: '0' }}>
            <Button style={{ fontSize: '10px', margin: '10px' }} color="secondary" onClick={goBack}>
                뒤로가기
            </Button>
            <p style={{ marginLeft: '10px' }}>
                채팅방 ID: {chatId}, 상대방 ID: {otherUserId}, 내 ID: {loginUserId}
            </p>
            <div
                style={{
                    position: 'absolute',
                    top: '120px',
                    left: '0',
                    right: '0',
                    bottom: '60px',
                    overflowY: 'auto',
                    padding: '10px',
                }}
            >
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        style={{
                            display: 'flex',
                            justifyContent: msg.fromId === loginUserId ? 'flex-end' : 'flex-start',
                            marginBottom: '10px',
                        }}
                    >
                        <div
                            style={{
                                maxWidth: '60%',
                                padding: '10px',
                                borderRadius: '10px',
                                background: msg.fromId === loginUserId ? '#007bff' : '#f1f0f0',
                                color: msg.fromId === loginUserId ? '#fff' : '#000',
                                wordWrap: 'break-word',
                            }}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}
            </div>
            <div
                style={{
                    position: 'absolute',
                    top: '60px',
                    left: '0',
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#fff',
                    borderBottom: '1px solid #ccc',
                }}
            >
                <InputGroup>
                    <Input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="메시지를 입력하세요"
                    />
                    <InputGroupText>
                        <Button color="primary" onClick={handleSend}>
                            전송
                        </Button>
                    </InputGroupText>
                </InputGroup>
            </div>
        </Container>
    );
};

export default ChatRoom;
