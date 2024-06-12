import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input } from 'reactstrap';

const EditProposalModal = ({ isOpen, toggle, proposal, onUpdate }) => {
    const [formData, setFormData] = useState({
        term: proposal.term,
        payWay: proposal.payWay,
        pay: proposal.pay,
    });

    useEffect(() => {
        if (proposal) {
            setFormData({
                term: proposal.term,
                payWay: proposal.payWay,
                pay: proposal.pay,
            });
        }
    }, [proposal]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = () => {
        const updatedProposal = { ...proposal, ...formData };
        onUpdate(updatedProposal);
        toggle();
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>제안서 수정</ModalHeader>
            <ModalBody>
                <FormGroup>
                    <Label for="term">업로드 기간</Label>
                    <Input type="text" name="term" id="term" value={formData.term} onChange={handleChange} />
                </FormGroup>
                <FormGroup>
                    <Label for="payWay">지급 방법</Label>
                    <Input type="select" name="payWay" id="payWay" value={formData.payWay} onChange={handleChange}>
                        <option value="">선택하세요</option>
                        <option value="분할 지급">분할 지급</option>
                        <option value="선불">선불</option>
                        <option value="후불">후불</option>
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label for="pay">총 금액</Label>
                    <Input type="number" name="pay" id="pay" value={formData.pay} onChange={handleChange} />
                </FormGroup>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={handleSave}>
                    저장
                </Button>
                <Button color="secondary" onClick={toggle}>
                    취소
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default EditProposalModal;
