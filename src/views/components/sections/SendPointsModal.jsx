import React, { useState, useEffect, useRef } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, FormGroup, Label } from 'reactstrap';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const SendPointsModal = ({
    isOpen = false,
    toggle,
    headerId,
    loginUserId,
    otherUserId,
    allPoints = 0,
    sendedPoints = 0,
}) => {
    const [amount, setAmount] = useState('');
    const [currentPoints, setCurrentPoints] = useState(0);
    const stompClient = useRef(null);

    useEffect(() => {
        if (isOpen && loginUserId) {
            fetch(`http://localhost:8080/user/${loginUserId}`)
                .then((response) => response.json())
                .then((data) => {
                    setCurrentPoints(data.points);
                })
                .catch((error) => console.error('Error:', error));
        }

        if (!stompClient.current) {
            const socket = new SockJS('http://localhost:8080/ws');
            stompClient.current = new Client({
                webSocketFactory: () => socket,
                onConnect: () => {
                    console.log('Connected to WebSocket');
                },
                onStompError: (frame) => {
                    console.error('Broker reported error: ' + frame.headers['message']);
                    console.error('Additional details: ' + frame.body);
                },
            });

            stompClient.current.activate();
        }
    }, [isOpen, loginUserId]);

    const handleSendPoints = () => {
        console.log('Send Points Data:', {
            headerId: headerId,
            fromId: loginUserId,
            toId: otherUserId,
            amount: parseFloat(amount),
        });

        const formData = new URLSearchParams();
        formData.append('headerId', headerId);
        formData.append('fromId', loginUserId);
        formData.append('toId', otherUserId);
        formData.append('amount', parseFloat(amount));

        fetch('http://localhost:8080/api/chats/sendPoints', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.text().then((text) => {
                        throw new Error(`Network response was not ok: ${response.status} - ${text}`);
                    });
                }
                return response.text().then((text) => (text ? JSON.parse(text) : {}));
            })
            .then((data) => {
                console.log('Points sent:', data);
                handleSendMessage(parseFloat(amount)); // 송금 후 메시지 보내기
                setAmount(''); // 송금 후 금액 초기화
                toggle(); // 송금 후 모달 닫기
            })
            .catch((error) => {
                console.error('Error sending points:', error);
                console.log('Header ID:', headerId);
                console.log('From ID:', loginUserId);
                console.log('To ID:', otherUserId);
                console.log('Amount:', parseFloat(amount));
            });
    };

    const handleSendMessage = (amount) => {
        console.log('Sending message about points transfer...');
        const message = {
            headerId: headerId,
            fromId: loginUserId,
            toId: otherUserId,
            messageType: false,
            content: `${amount} 포인트를 송금했습니다.`,
            time: new Date().toISOString(), // 시간은 ISO 형식으로 전달
        };

        console.log('Message data:', message);

        fetch('http://localhost:8080/api/messages/json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.text().then((text) => {
                        throw new Error(`Network response was not ok: ${response.status} - ${text}`);
                    });
                }
                return response.json();
            })
            .then((data) => {
                console.log('Message sent:', data);
                if (stompClient.current) {
                    stompClient.current.publish({
                        destination: `/app/chat/${headerId}`,
                        body: JSON.stringify(data),
                    });
                }
            })
            .catch((error) => console.error('Error sending message:', error));
    };

    const handleClose = () => {
        setAmount('');
        setCurrentPoints(0);
        toggle();
    };

    return (
        <Modal isOpen={isOpen} toggle={handleClose}>
            <ModalHeader toggle={handleClose}>포인트 송금</ModalHeader>
            <ModalBody>
                <FormGroup>
                    <Label for="amount">송금할 금액</Label>
                    <Input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="금액을 입력하세요"
                    />
                </FormGroup>
                <p>내 보유 포인트: {currentPoints}</p>
                <p>총 금액: {allPoints}</p>
                <p>보낸 총 금액: {sendedPoints}</p>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={handleSendPoints}>
                    송금
                </Button>
                <Button color="secondary" onClick={handleClose}>
                    취소
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default SendPointsModal;
