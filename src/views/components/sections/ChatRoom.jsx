import React, { useState, useEffect, useRef } from 'react';
import { Container, Button, Input, InputGroup, InputGroupText } from 'reactstrap';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import SendPointsModal from './SendPointsModal';
import EditProposalModal from './EditProposalModal';

//아이콘s
import moneyImg from '../../../assets/images/icons/money2.png';
import sendImg from '../../../assets/images/icons/send2.png';
import editImg from '../../../assets/images/icons/edit2.png';
import photoImg from '../../../assets/images/icons/photo2.png';
import listImg from '../../../assets/images/icons/list.png';

const ChatRoom = ({ chatId, otherUserId, loginUserId, goBack, allPoints, sendedPoints }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [photo, setPhoto] = useState(null);
    const [proposals, setProposals] = useState([]);
    const [isSendPointsModalOpen, setIsSendPointsModalOpen] = useState(false);
    const [isEditProposalModalOpen, setIsEditProposalModalOpen] = useState(false);
    const [currentProposal, setCurrentProposal] = useState(null);
    const stompClient = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchMessages(chatId);
        fetchProposals(chatId);
        connectWebSocket();

        return () => {
            if (stompClient.current) {
                stompClient.current.deactivate();
            }
        };
    }, [chatId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, proposals]);

    const fetchMessages = (headerId) => {
        fetch(`http://localhost:8080/api/messages/byHeaderId/${headerId}`)
            .then((response) => response.json())
            .then((data) => {
                console.log('Fetched messages:', data);
                if (Array.isArray(data)) {
                    setMessages(data);
                } else {
                    setMessages([]);
                }
            })
            .catch((error) => console.error('Error:', error));
    };

    const fetchProposals = (headerId) => {
        fetch(`http://localhost:8080/api/sendProposal/byHeaderId/${headerId}`)
            .then((response) => response.json())
            .then((data) => {
                console.log('Fetched proposals:', data);
                if (Array.isArray(data)) {
                    setProposals(data);
                } else {
                    setProposals([]);
                }
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
                    console.log('Received message:', receivedMessage);
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

    const handleSend = (file = null) => {
        const formData = new FormData();
        formData.append('headerId', chatId);
        formData.append('fromId', loginUserId);
        formData.append('toId', otherUserId);
        formData.append('messageType', file ? true : false);
        formData.append('time', formatDate(new Date()));

        if (file) {
            formData.append('photo', file);
        } else {
            formData.append('content', message.trim());
        }

        setMessage('');
        setPhoto(null);

        fetch('http://localhost:8080/api/messages', {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Message sent:', data);
                stompClient.current.publish({
                    destination: `/app/chat/${chatId}`,
                    body: JSON.stringify(data),
                });
            })
            .catch((error) => console.error('Error:', error));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            handleSend(file);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleUpdateProposal = (updatedProposal) => {
        fetch(`http://localhost:8080/api/sendProposal/${updatedProposal.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProposal),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                console.log('Proposal updated:', data);
                fetchProposals(chatId); // Update proposals after editing
            })
            .catch((error) => console.error('Error updating proposal:', error));
    };

    const renderMessage = (msg, isProposal) => {
        const messageStyle = {
            maxWidth: '70%', // 말풍선의 너비 70%
            padding: '10px',
            borderRadius: '10px',
            background: msg.fromId === loginUserId ? '#007bff' : '#f1f0f0',
            color: msg.fromId === loginUserId ? '#fff' : '#000',
            wordWrap: 'break-word',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start', // 왼쪽 정렬
        };

        const proposalStyle = {
            ...messageStyle,
            background: msg.fromId === loginUserId ? '#87ceeb' : '#e0f7fa', // 하늘색 배경
        };

        const style = isProposal ? proposalStyle : messageStyle;

        return (
            <div
                key={msg.id}
                style={{
                    display: 'flex',
                    justifyContent: msg.fromId === loginUserId ? 'flex-end' : 'flex-start',
                    marginBottom: '10px',
                }}
            >
                <div style={style}>
                    {isProposal ? (
                        <>
                            <p>이름: {msg.goodName}</p>
                            <p>세부사항: {msg.goodDetail}</p>
                            <p>요구사항: {msg.goodRequire}</p>
                            <p>기간: {msg.term}</p>
                            <p>지불 방식: {msg.payWay}</p>
                            <p>지불 금액: {msg.pay}</p>
                            {msg.photoUrl && (
                                <img
                                    src={`http://localhost:8080/uploads/${msg.photoUrl}`}
                                    alt={msg.goodName}
                                    style={{ maxWidth: '70%' }}
                                />
                            )}
                        </>
                    ) : msg.photoUrl ? (
                        <img
                            src={`http://localhost:8080/uploads/${msg.photoUrl}`}
                            alt="Sent photo"
                            style={{ maxWidth: '70%' }}
                        />
                    ) : (
                        <p>{msg.content}</p>
                    )}
                </div>
            </div>
        );
    };

    return (
        <Container style={{ position: 'relative', height: '100vh', padding: '0' }}>
            <div>
                <img
                    src={listImg}
                    alt="list"
                    style={{
                        width: '40px',
                        height: '40px',
                        cursor: 'pointer',
                        // marginLeft: '5px',
                        marginRight: '15px',
                    }}
                    onClick={goBack}
                />
                {otherUserId}
                <div style={{ display: 'flex', alignItems: 'center', float: 'right' }}>
                    <img
                        src={editImg}
                        alt="edit"
                        style={{
                            width: '50px',
                            height: '50px',
                            cursor: 'pointer',
                            marginLeft: '5px',
                        }}
                        onClick={() => {
                            setCurrentProposal({ chatId, otherUserId, loginUserId });
                            setIsEditProposalModalOpen(true);
                        }}
                    />
                    <img
                        src={moneyImg}
                        alt="money"
                        style={{
                            width: '40px',
                            height: '40px',
                            cursor: 'pointer',
                            marginLeft: '5px',
                            marginRight: '10px',
                        }}
                        onClick={() => setIsSendPointsModalOpen(true)}
                    />
                </div>
            </div>
            <div
                style={{
                    position: 'absolute',
                    top: '50px',
                    left: '0',
                    right: '0',
                    bottom: '43%',
                    overflowY: 'scroll',
                    padding: '5px',
                    paddingBottom: '10px',
                }}
            >
                {proposals.map((proposal) => renderMessage(proposal, true))}
                {messages.map((msg) => renderMessage(msg, false))}
                <div ref={messagesEndRef} />
            </div>
            <div
                style={{
                    position: 'absolute',
                    top: '600px',
                    left: '0',
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#fff',
                    borderTop: '1px solid #ccc',
                }}
            >
                <InputGroup>
                    <input type="file" id="photo-upload" style={{ display: 'none' }} onChange={handlePhotoChange} />
                    <label htmlFor="photo-upload">
                        <img
                            src={photoImg}
                            alt="Upload"
                            style={{
                                width: '50px',
                                height: '50px',
                                cursor: 'pointer',
                                marginRight: '10px',
                            }}
                        />
                    </label>
                    <Input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="메시지를 입력하세요"
                    />

                    <InputGroupText>
                        <img
                            src={sendImg}
                            alt="send"
                            style={{
                                width: '30px',
                                height: '30px',
                                cursor: 'pointer',
                            }}
                            onClick={() => handleSend()}
                        />
                    </InputGroupText>
                </InputGroup>
            </div>
            <SendPointsModal
                isOpen={isSendPointsModalOpen}
                toggle={() => setIsSendPointsModalOpen(false)}
                headerId={chatId}
                loginUserId={loginUserId}
                otherUserId={otherUserId}
                allPoints={allPoints}
                sendedPoints={sendedPoints}
            />
            {currentProposal && (
                <EditProposalModal
                    isOpen={isEditProposalModalOpen}
                    toggle={() => setIsEditProposalModalOpen(false)}
                    proposal={currentProposal}
                    onUpdate={handleUpdateProposal}
                />
            )}
        </Container>
    );
};

export default ChatRoom;
