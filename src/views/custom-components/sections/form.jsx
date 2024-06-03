import React, { useState } from 'react';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

//회원가입
const PageForm = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [passwordch, setPasswordch] = useState('');
    const [category, setCategory] = useState('');
    const [ageGroups, setAgeGroups] = useState([]);
    const [companyName, setCompanyName] = useState('');
    const [companyPhone, setCompanyPhone] = useState('');
    const [companyAddress, setCompanyAddress] = useState('');
    const [isDuplicate, setIsDuplicate] = useState(null);
    const [duplicateMessage, setDuplicateMessage] = useState('');

    const handleJoin = () => {
        if (isDuplicate === false) {
            const userData = {
                name,
                userId,
                password,
                category,
                ageGroups,
                companyName,
                companyPhone,
                companyAddress,
            };

            axios
                .post('http://localhost:8080/SignUp', userData)
                .then((response) => {
                    console.log(response.data);
                    navigate('/');
                })
                .catch((error) => {
                    console.error('There was an error!', error);
                });
        } else {
            alert('Please check the user ID for duplication.');
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    const handleAgeGroupChange = (e) => {
        const value = e.target.value;
        setAgeGroups((prevState) =>
            prevState.includes(value) ? prevState.filter((ageGroup) => ageGroup !== value) : [...prevState, value]
        );
    };

    const checkDuplicateUserId = () => {
        if (userId.trim() === '') {
            setDuplicateMessage('Please enter a user ID.');
            setIsDuplicate(true);
            return;
        }

        axios
            .get(`http://localhost:8080/duplicationId/${userId}`)
            .then((response) => {
                if (response.data === 0) {
                    setDuplicateMessage('User ID is already taken.');
                    setIsDuplicate(true);
                } else if (response.data === 1) {
                    setDuplicateMessage('User ID is available.');
                    setIsDuplicate(false);
                } else {
                    setDuplicateMessage('Unexpected response from server.');
                    setIsDuplicate(true);
                }
            })
            .catch((error) => {
                alert('There was an error: ' + error.message); // 오류 확인 알림
                setDuplicateMessage('Error checking user ID.');
                setIsDuplicate(true);
            });
    };

    const testServerSignal = () => {
        axios
            .get('http://localhost:8080/testSignal')
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
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
                                    <Button color="info" onClick={checkDuplicateUserId} style={{ marginTop: '10px' }}>
                                        중복 확인
                                    </Button>
                                    {duplicateMessage && (
                                        <Alert color={isDuplicate ? 'danger' : 'success'} style={{ marginTop: '10px' }}>
                                            {duplicateMessage}
                                        </Alert>
                                    )}
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
                                    <Label>선호 연령대 선택</Label>
                                    <div className="form-check">
                                        <Label check>
                                            <Input
                                                type="checkbox"
                                                value="10대"
                                                checked={ageGroups.includes('10대')}
                                                onChange={handleAgeGroupChange}
                                            />
                                            10대
                                        </Label>
                                    </div>
                                    <div className="form-check">
                                        <Label check>
                                            <Input
                                                type="checkbox"
                                                value="20대"
                                                checked={ageGroups.includes('20대')}
                                                onChange={handleAgeGroupChange}
                                            />
                                            20대
                                        </Label>
                                    </div>
                                    <div className="form-check">
                                        <Label check>
                                            <Input
                                                type="checkbox"
                                                value="30대"
                                                checked={ageGroups.includes('30대')}
                                                onChange={handleAgeGroupChange}
                                            />
                                            30대
                                        </Label>
                                    </div>
                                    <div className="form-check">
                                        <Label check>
                                            <Input
                                                type="checkbox"
                                                value="40대"
                                                checked={ageGroups.includes('40대')}
                                                onChange={handleAgeGroupChange}
                                            />
                                            40대
                                        </Label>
                                    </div>
                                    <div className="form-check">
                                        <Label check>
                                            <Input
                                                type="checkbox"
                                                value="50대 이상"
                                                checked={ageGroups.includes('50대 이상')}
                                                onChange={handleAgeGroupChange}
                                            />
                                            50대 이상
                                        </Label>
                                    </div>
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
                                <div className="button-group">
                                    <Button color="primary" onClick={handleJoin}>
                                        가입하기
                                    </Button>
                                    <Button color="secondary" onClick={handleCancel}>
                                        취소
                                    </Button>
                                </div>
                            </Form>
                            <Button color="info" onClick={testServerSignal}>
                                서버 신호 테스트
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default PageForm;
