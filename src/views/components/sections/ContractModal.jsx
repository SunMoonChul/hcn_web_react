import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from 'reactstrap';

const ContractModal = ({ isOpen, toggle, email, refreshProposals, initialProposal }) => {
    const [formData, setFormData] = useState({
        productImage: '',
        productName: '',
        productDescription: '',
        requirements: '',
        uploadPeriod: '',
        paymentMethod: '',
        totalAmount: '',
    });
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        if (initialProposal) {
            setFormData({
                productImage: '',
                productName: initialProposal.goodName,
                productDescription: initialProposal.goodDetail,
                requirements: initialProposal.goodRequire,
                uploadPeriod: initialProposal.term,
                paymentMethod: initialProposal.payWay,
                totalAmount: initialProposal.pay,
            });
            setPreviewImage(`http://localhost:8080/api/proposals/images/${initialProposal.photoUrl}`);
        } else {
            setFormData({
                productImage: '',
                productName: '',
                productDescription: '',
                requirements: '',
                uploadPeriod: '',
                paymentMethod: '',
                totalAmount: '',
            });
            setPreviewImage(null);
        }
    }, [initialProposal]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({
            ...formData,
            productImage: file,
        });
        setPreviewImage(URL.createObjectURL(file));
    };

    const handleSubmit = async () => {
        const method = initialProposal ? 'PUT' : 'POST';
        const url = initialProposal
            ? `http://localhost:8080/api/proposals/${initialProposal.id}`
            : 'http://localhost:8080/api/proposals';

        const formDataToSend = new FormData();
        formDataToSend.append('userId', email);
        formDataToSend.append('goodName', formData.productName);
        formDataToSend.append('goodDetail', formData.productDescription);
        formDataToSend.append('goodRequire', formData.requirements);
        formDataToSend.append('term', formData.uploadPeriod);
        formDataToSend.append('payWay', formData.paymentMethod);
        formDataToSend.append('pay', formData.totalAmount);

        if (formData.productImage) {
            formDataToSend.append('photoUrl', formData.productImage);
        } else if (initialProposal) {
            formDataToSend.append('photoUrl', initialProposal.photoUrl);
        }

        try {
            const response = await fetch(url, {
                method,
                body: formDataToSend,
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Proposal saved:', data);
            refreshProposals();
            toggle();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle} size="lg">
            <ModalHeader toggle={toggle}>{initialProposal ? '제안서 수정' : '새 제안서 추가'}</ModalHeader>
            <ModalBody>
                <Form>
                    <FormGroup>
                        <Label for="productImage">제품 사진</Label>
                        <Input type="file" name="productImage" id="productImage" onChange={handleFileChange} />
                        {previewImage && <img src={previewImage} alt="Preview" className="img-preview" />}
                    </FormGroup>
                    <FormGroup>
                        <Label for="productName">제품 명</Label>
                        <Input
                            type="text"
                            name="productName"
                            id="productName"
                            placeholder="ex) 게이밍 마우스"
                            value={formData.productName}
                            onChange={handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="productDescription">제품 설명 (생략 가능)</Label>
                        <Input
                            type="textarea"
                            name="productDescription"
                            id="productDescription"
                            placeholder="ex) 그립감 좋고 무소음인 게이밍 마우스"
                            value={formData.productDescription}
                            onChange={handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="requirements">요구사항</Label>
                        <Input
                            type="textarea"
                            name="requirements"
                            id="requirements"
                            placeholder={
                                'ex) 게시물 사진은 요청 수락하면 총 3장 보내드리겠습니다 ! \n광고 문구는 조용하고 그립감 편하다는 느낌으로 말해주시면 돼요. \n'
                            }
                            value={formData.requirements}
                            onChange={handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="uploadPeriod">업로드 기간</Label>
                        <Input
                            type="text"
                            name="uploadPeriod"
                            id="uploadPeriod"
                            placeholder="ex) 총 3주(21일)"
                            value={formData.uploadPeriod}
                            onChange={handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="paymentMethod">지급 방법</Label>
                        <Input
                            type="select"
                            name="paymentMethod"
                            id="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleChange}
                        >
                            <option value="">선택하세요</option>
                            <option value="분할 지급">분할 지급</option>
                            <option value="선불">선불</option>
                            <option value="후불">후불</option>
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="totalAmount">총 금액</Label>
                        <Input
                            type="text"
                            name="totalAmount"
                            id="totalAmount"
                            placeholder="ex) 1000,000원"
                            value={formData.totalAmount}
                            onChange={handleChange}
                        />
                        <small className="form-text text-muted">예: 1000000</small>
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={handleSubmit}>
                    제출
                </Button>
                <Button color="secondary" onClick={toggle}>
                    취소
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default ContractModal;
