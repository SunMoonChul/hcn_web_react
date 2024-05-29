// src/components/ContractModal.jsx
import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from 'reactstrap';

const ContractModal = ({ isOpen, toggle }) => {
    const [formData, setFormData] = useState({
        productImage: '',
        productName: '',
        productDescription: '',
        requirements: '',
        uploadPeriod: '',
        paymentMethod: '',
        totalAmount: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            productImage: e.target.files[0]
        });
    };

    const handleSubmit = () => {
        // 여기에 제출 로직을 추가합니다.
        console.log(formData);
        toggle(); // 모달을 닫습니다.
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle} size="lg">
            <ModalHeader toggle={toggle}>제안서</ModalHeader>
            <ModalBody>
                <Form>
                    <FormGroup>
                        <Label for="productImage">제품 사진</Label>
                        <Input type="file" name="productImage" id="productImage" onChange={handleFileChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="productName">제품 명</Label>
                        <Input type="text" name="productName" id="productName" placeholder="ex) 게이밍 마우스" value={formData.productName} onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="productDescription">제품 설명 (생략 가능)</Label>
                        <Input type="textarea" name="productDescription" id="productDescription" placeholder="ex) 그립감 좋고 무소음인 게이밍 마우스" value={formData.productDescription} onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="requirements">요구사항</Label>
                        <Input type="textarea" name="requirements" id="requirements" placeholder={"ex) 게시물 사진은 요청 수락하면 총 3장 보내드리겠습니다 ! \n광고 문구는 조용하고 그립감 편하다는 느낌으로 말해주시면 돼요. \n"} value={formData.requirements} onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="uploadPeriod">업로드 기간</Label>
                        <Input type="text" name="uploadPeriod" id="uploadPeriod" placeholder="ex) 총 3주(21일)" value={formData.uploadPeriod} onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="paymentMethod">지급 방법</Label>
                        <Input type="select" name="paymentMethod" id="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                            <option>분할 지급</option>
                            <option>선불</option>
                            <option>후불</option>
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="totalAmount">총 금액</Label>
                        <Input type="text" name="totalAmount" id="totalAmount" placeholder="ex) 1000,000원" value={formData.totalAmount} onChange={handleChange} />
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={handleSubmit}>제출</Button>
                <Button color="secondary" onClick={toggle}>취소</Button>
            </ModalFooter>
        </Modal>
    );
};

export default ContractModal;
