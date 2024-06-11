import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';
import { DataContext } from '../../../context/DataContext';
import './MyInfo.css'; // Custom CSS file for additional styling

const MyInfo = () => {
    const { data } = useContext(DataContext); // DataContext로부터 data 가져오기
    const { loginUser } = data; // data에서 loginUser 가져오기
    const [info, setInfo] = useState(null);
    const [modal, setModal] = useState(false);
    const [editField, setEditField] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (loginUser && loginUser.email) {
            axios.get(`http://localhost:8080/user/${loginUser.email}`) // user_id를 email로 사용
                .then(response => {
                    setInfo(response.data);
                    console.log(response.data);
                })
                .catch(error => {
                    console.error("There was an error fetching the user data!", error);
                });
        }
    }, [loginUser]);

    const toggleModal = (field) => {
        setEditField(field);
        setModal(!modal);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInfo({
            ...info,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        setError('');
        setSelectedFile(file);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', loginUser.email);

        axios.post('http://localhost:8080/upload', formData)
            .then(response => {
                console.log(response.data);
                setInfo({
                    ...info,
                    profileImageUrl: response.data // 응답으로 받은 파일 이름 설정
                });
            })
            .catch(error => {
                console.error('There was an error uploading the file!', error);
            });
    };

    const handleSave = () => {
        axios.post('http://localhost:8080/update', info)
            .then(response => {
                setInfo(response.data);
                setModal(false);
            })
            .catch(error => {
                console.error("There was an error updating the user data!", error);
            });
    };

    const handleFieldChange = (e) => {
        setInfo({
            ...info,
            category: e.target.value
        });
    };

    const handleAgeGroupChange = (e) => {
        const { value } = e.target;
        setInfo({
            ...info,
            ageGroup: value
        });
    };

    const handleGenderChange = (e) => {
        const { value } = e.target;
        setInfo({
            ...info,
            desiredGender: value
        });
    };

    if (!info) {
        return <div>Loading...</div>;
    }

    return (
        <Container className="my-info-container">
            <Row className="my-info-header">
                <Col md="12" className="text-center">
                    <h1>내 정보</h1>
                </Col>
            </Row>
            <Row>
                <Col md="4" className="text-center">
                    <div className="info-section">
                        <div className="info-box">
                            <img
                                src={`http://localhost:8080/uploads/${info.profileImageUrl}?${new Date().getTime()}`}
                                alt="Company"
                                className="company-image" />
                            <input
                                type="file"
                                id="fileUpload"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                            <label htmlFor="fileUpload" className="btn btn-primary">
                                프로필 업로드
                            </label>
                            {error && <p className="error-message">{error}</p>}
                        </div>
                    </div>
                    <div className="info-section">
                        <div className="info-box">
                            <h2>회사 사이트</h2>
                            <a href={info.websiteUrl || '#'} target="_blank" rel="noopener noreferrer">{info.websiteUrl || 'N/A'}</a>
                        </div>
                    </div>
                    <div className="info-section">
                        <div className="info-box">
                            <h2>회사 소개</h2>
                            <p>{info.companyDescription || 'N/A'} <Button size="sm" onClick={() => toggleModal('companyDescription')}>수정</Button></p>
                        </div>
                    </div>
                </Col>
                <Col md="8">
                    <div className="info-section">
                        <div className="info-box">
                            <h2>회사 명</h2>
                            <p>{info.companyName}</p>
                        </div>
                    </div>
                    <div className="info-section">
                        <div className="info-box">
                            <h2>회사 번호</h2>
                            <p>{info.companyPhone}</p>
                        </div>
                    </div>
                    <div className="info-section">
                        <div className="info-box">
                            <h2>회사 주소</h2>
                            <p>{info.companyAddress}</p>
                        </div>
                    </div>
                    <div className="info-section">
                        <div className="info-box">
                            <h2>보유 포인트</h2>
                            <p>{info.points.toLocaleString()} points</p>
                            <Button size="sm" className="mr-2">충전</Button>
                            <Button size="sm">환전</Button>
                        </div>
                    </div>
                    <div className="info-section">
                        <div className="info-box">
                            <h2>선호 분야</h2>
                            <p>{info.category} <Button size="sm" onClick={() => toggleModal('category')}>수정</Button></p>
                        </div>
                    </div>
                    <div className="info-section">
                        <div className="info-box">
                            <h2>광고 선호 연령대</h2>
                            <p>{info.ageGroup} <Button size="sm" onClick={() => toggleModal('ageGroup')}>수정</Button></p>
                        </div>
                    </div>
                    <div className="info-section">
                        <div className="info-box">
                            <h2>원하는 성별</h2>
                            <p>{info.desiredGender} <Button size="sm" onClick={() => toggleModal('desiredGender')}>수정</Button></p>
                        </div>
                    </div>
                </Col>
            </Row>

            <Modal isOpen={modal} toggle={() => setModal(!modal)} size="lg">
                <ModalHeader toggle={() => setModal(!modal)}>수정 {editField === 'companyDescription' ? '회사 소개' : editField === 'category' ? '선호 분야' : editField === 'ageGroup' ? '광고 선호 연령대' : '원하는 성별'}</ModalHeader>
                <ModalBody>
                    <Form>
                        {editField === 'companyDescription' && (
                            <FormGroup>
                                <Label for="companyDescription">수정 회사 소개</Label>
                                <Input type="text" name="companyDescription" id="companyDescription" value={info.companyDescription || ''} onChange={handleChange} />
                            </FormGroup>
                        )}
                        {editField === 'category' && (
                            <FormGroup>
                                <Label for="category">선호 분야 선택</Label>
                                <Input type="select" name="category" id="category" value={info.category} onChange={handleFieldChange}>
                                    <option>패션</option>
                                    <option>뷰티</option>
                                    <option>스포츠</option>
                                    <option>IT</option>
                                    <option>게임</option>
                                    <option>여행</option>
                                    <option>반려동물</option>
                                    <option>음식</option>
                                    <option>육아</option>
                                </Input>
                            </FormGroup>
                        )}
                        {editField === 'ageGroup' && (
                            <FormGroup>
                                <Label for="ageGroup">광고 선호 연령대 선택</Label>
                                <Input type="select" name="ageGroup" id="ageGroup" value={info.ageGroup} onChange={handleAgeGroupChange}>
                                    <option value="">선택하세요</option>
                                    <option value="13-17">13-17</option>
                                    <option value="18-24">18-24</option>
                                    <option value="25-34">25-34</option>
                                    <option value="35-44">35-44</option>
                                    <option value="45-54">45-54</option>
                                    <option value="55-64">55-64</option>
                                    <option value="65+">65+</option>
                                </Input>
                            </FormGroup>
                        )}
                        {editField === 'desiredGender' && (
                            <FormGroup>
                                <Label for="desiredGender">원하는 성별 선택</Label>
                                <Input type="select" name="desiredGender" id="desiredGender" value={info.desiredGender} onChange={handleGenderChange}>
                                    <option value="">선택하세요</option>
                                    <option value="남성">남성</option>
                                    <option value="여성">여성</option>
                                    <option value="상관 없음">상관 없음</option>
                                </Input>
                            </FormGroup>
                        )}
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleSave}>저장</Button>
                    <Button color="secondary" onClick={() => setModal(false)}>취소</Button>
                </ModalFooter>
            </Modal>
        </Container>
    );
};

export default MyInfo;
