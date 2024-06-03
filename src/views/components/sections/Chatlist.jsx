import React, { useEffect, useState, useContext } from 'react';
import { Container, ListGroup, ListGroupItem, Spinner } from 'reactstrap';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { DataContext } from '../../../context/DataContext';
import ChatRoom from './ChatRoom';

const BASE_URL = 'http://localhost:8080'; // 실제 API URL을 넣으세요

const ChatList = () => {
    const [stompClient, setStompClient] = useState(null);
    const [chatsData, setChatsData] = useState([]);
    const { data } = useContext(DataContext);
    const { loginUser } = data || {}; // Ensure data is always an object
    const [loading, setLoading] = useState(true);
    const [currentChat, setCurrentChat] = useState(null);

    useEffect(() => {
        const id = loginUser?.email;
        if (id) {
            fetchChats(id);
        }

        const socket = new SockJS(`${BASE_URL}/ws`);
        const client = new Client({
            webSocketFactory: () => socket,
            debug: function (str) {
                console.log(`WebSocket debug: ${str}`);
            },
            reconnectDelay: 5000,
        });

        client.onConnect = () => {
            console.log('WebSocket connected');
            setStompClient(client);
            client.subscribe('/topic/chats', (msg) => {
                if (msg.body) {
                    console.log(`Received message: ${msg.body}`);
                    setChatsData(JSON.parse(msg.body));
                }
            });
        };

        client.activate();

        return () => {
            console.log('WebSocket disconnected');
            if (client) {
                client.deactivate();
            }
        };
    }, [loginUser]);

    const fetchChats = (id) => {
        console.log(`fetchChats - id: ${id}`);
        fetch(`http://localhost:8080/api/chats?userId=${id}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(`fetchChats - data: ${JSON.stringify(data)}`);
                setChatsData(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching chat data:', error);
                setLoading(false);
            });
    };

    const handleItemPress = (chatId, otherUserId) => {
        setCurrentChat({ chatId, otherUserId });
    };

    const renderChatListItem = (item) => {
        console.log(`renderChatListItem - item: ${JSON.stringify(item)}`);
        const otherUserId = item.fromId === loginUser?.email ? item.toId : item.fromId;

        console.log(
            `renderChatListItem - chatid: ${item.id}, otherUserId: ${otherUserId}, last_message: ${item.lastMessage}, chattime: ${item.time}`
        );

        return (
            <ListGroupItem
                key={item.id}
                className="d-flex justify-content-between align-items-center"
                onClick={() => handleItemPress(item.id, otherUserId)}
                style={{ marginBottom: '5px' }}
            >
                <div>
                    <strong>상대방 ID: {otherUserId}</strong>
                    <p>최근 메시지: {item.lastMessage}</p>
                    <small>{new Date(item.time).toLocaleString()}</small>
                </div>
            </ListGroupItem>
        );
    };

    return (
        <Container>
            {currentChat ? (
                <ChatRoom
                    chatId={currentChat.chatId}
                    otherUserId={currentChat.otherUserId}
                    loginUserId={loginUser?.email}
                    goBack={() => setCurrentChat(null)}
                />
            ) : loading ? (
                <Spinner color="primary" />
            ) : chatsData.length > 0 ? (
                <ListGroup>{chatsData.map((item) => renderChatListItem(item))}</ListGroup>
            ) : (
                <div className="text-center">
                    <p>채팅 내역이 없습니다</p>
                    <p>id: {loginUser?.email}</p>
                </div>
            )}
        </Container>
    );
};

export default ChatList;
