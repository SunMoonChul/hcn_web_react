import React, { useState } from 'react';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PageForm = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [passwordch, setPasswordch] = useState('');
    const [category, setCategory] = useState('');
    const [ageGroup, setAgeGroup] = useState('');
    const [desiredGender, setDesiredGender] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companyPhone, setCompanyPhone] = useState('');
    const [companyAddress, setCompanyAddress] = useState('');
    const [isDuplicate, setIsDuplicate] = useState(null);
    const [duplicateMessage, setDuplicateMessage] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');

    const handleJoin = () => {
        if (isDuplicate === false) {
            const userData = {
                name,
                userId,
                password,
                category,
                ageGroup,
                desiredGender,
                companyName,
                companyPhone,
                companyAddress,
                websiteUrl
            };

            axios.post('http://localhost:8080/SignUp', userData)
                .then(response => {
                    console.log(response.data);
                    navigate('/');
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        } else {
            alert("Please check the user ID for duplication.");
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    const checkDuplicateUserId = () => {
        if (userId.trim() === '') {
            setDuplicateMessage("Please enter a user ID.");
            setIsDuplicate(true);
            return;
        }

        axios.get(`http://localhost:8080/duplicationId/${userId}`)
            .then(response => {
                if (response.data === 0) {
                    setDuplicateMessage("User ID is already taken.");
                    setIsDuplicate(true);
                } else if (response.data === 1) {
                    setDuplicateMessage("User ID is available.");
                    setIsDuplicate(false);
                } else {
                    setDuplicateMessage("Unexpected response from server.");
                    setIsDuplicate(true);
                }
            })
            .catch(error => {
                alert('There was an error: ' + error.message);
                setDuplicateMessage("Error checking user ID.");
                setIsDuplicate(true);
            });
    };

    const testServerSignal = () => {
        axios.get('http://localhost:8080/testSignal')
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    };

    return (
        <div className="app">
            <div className="spacer" id="forms-component">
                <Container className="container">
                    <Row className="justify-content-center">
                        <Col md="12" className="text-center">
                            <h1 className="title">회원 가입</h1>
                            <h6 className="subtitle">필요한 정보를 입력해주세요</h6>
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        <Col md="12">
                            <Form>
                                <FormGroup>
                                    <Label for="name">이름</Label>
                                    <Input
                                        type="text"
                                        name="name"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="userId">ID</Label>
                                    <Input
                                        type="text"
                                        name="userId"
                                        id="userId"
                                        value={userId}
                                        onChange={(e) => setUserId(e.target.value)}
                                        placeholder="ex) hcn@naver.com"
                                    />
                                    <Button color="info" onClick={checkDuplicateUserId} style={{ marginTop: '10px' }}>중복 확인</Button>
                                    {duplicateMessage && <Alert color={isDuplicate ? 'danger' : 'success'} style={{ marginTop: '10px' }}>{duplicateMessage}</Alert>}
                                </FormGroup>
                                <FormGroup>
                                    <Label for="password">비밀번호</Label>
                                    <Input
                                        type="password"
                                        name="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="passwordch">비밀번호 확인</Label>
                                    <Input
                                        type="password"
                                        name="passwordch"
                                        id="passwordch"
                                        value={passwordch}
                                        onChange={(e) => setPasswordch(e.target.value)}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="category">분야 선택</Label>
                                    <Input
                                        type="select"
                                        name="category"
                                        id="category"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <option value="">선택하세요</option>
                                        <option value="패션">패션</option>
                                        <option value="뷰티">뷰티</option>
                                        <option value="스포츠">스포츠</option>
                                        <option value="IT">IT</option>
                                        <option value="게임">게임</option>
                                        <option value="여행">여행</option>
                                        <option value="반려동물">반려동물</option>
                                        <option value="음식">음식</option>
                                        <option value="육아">육아</option>
                                    </Input>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="ageGroup">선호 연령대 선택</Label>
                                    <Input
                                        type="select"
                                        name="ageGroup"
                                        id="ageGroup"
                                        value={ageGroup}
                                        onChange={(e) => setAgeGroup(e.target.value)}
                                    >
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
                                <FormGroup>
                                    <Label for="gender">원하는 성별</Label>
                                    <Input
                                        type="select"
                                        name="desiredGender"
                                        id="desiredGender"
                                        value={desiredGender}
                                        onChange={(e) => setDesiredGender(e.target.value)}
                                    >
                                        <option value="">선택하세요</option>
                                        <option value="남성">남성</option>
                                        <option value="여성">여성</option>
                                        <option value="상관 없음">상관 없음</option>
                                    </Input>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="companyName">회사 이름</Label>
                                    <Input
                                        type="text"
                                        name="companyName"
                                        id="companyName"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="companyPhone">회사 전화번호</Label>
                                    <Input
                                        type="text"
                                        name="companyPhone"
                                        id="companyPhone"
                                        value={companyPhone}
                                        onChange={(e) => setCompanyPhone(e.target.value)}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="companyAddress">회사 주소</Label>
                                    <Input
                                        type="text"
                                        name="companyAddress"
                                        id="companyAddress"
                                        value={companyAddress}
                                        onChange={(e) => setCompanyAddress(e.target.value)}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="companyAddress">회사 웹사이트</Label>
                                    <Input
                                        type="text"
                                        name="websiteUrl"
                                        id="websiteUrl"
                                        value={websiteUrl}
                                        onChange={(e) => setWebsiteUrl(e.target.value)}
                                    />
                                </FormGroup>
                                <div className="button-group">
                                    <Button color="primary" onClick={handleJoin}>가입하기</Button>
                                    <Button color="secondary" onClick={handleCancel}>취소</Button>
                                </div>
                            </Form>
                            <Button color="info" onClick={testServerSignal}>서버 신호 테스트</Button>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default PageForm;
