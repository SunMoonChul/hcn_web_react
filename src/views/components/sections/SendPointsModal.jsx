import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, FormGroup, Label } from 'reactstrap';

const SendPointsModal = ({
    isOpen = false,
    toggle = () => {},
    headerId = '',
    loginUserId = '',
    otherUserId = '',
    onSendPoints = () => {},
    allPoints = 0,
    sendedPoints = 0,
}) => {
    const [amount, setAmount] = useState('');
    const [currentPoints, setCurrentPoints] = useState(0);

    useEffect(() => {
        if (isOpen && loginUserId) {
            fetch(`http://localhost:8080/user/${loginUserId}`)
                .then((response) => response.json())
                .then((data) => {
                    setCurrentPoints(data.points);
                })
                .catch((error) => console.error('Error:', error));
        }
    }, [isOpen, loginUserId]);

    const handleSend = () => {
        onSendPoints(amount);
        setAmount('');
        toggle();
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>포인트 송금</ModalHeader>
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
                <Button color="primary" onClick={handleSend}>
                    송금
                </Button>
                <Button color="secondary" onClick={toggle}>
                    취소
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default SendPointsModal;
