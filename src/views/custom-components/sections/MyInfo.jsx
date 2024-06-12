import React, { useContext, useState, useEffect } from 'react';
import {
    Container,
    Row,
    Col,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Label,
    Input,
} from 'reactstrap';
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
    const [chargeModal, setChargeModal] = useState(false); // 금액 충전 모달 상태
    const [chargeAmount, setChargeAmount] = useState(0); // 충전할 금액

    useEffect(() => {
        if (loginUser && loginUser.email) {
            axios
                .get(`http://localhost:8080/user/${loginUser.email}`) // user_id를 email로 사용
                .then((response) => {
                    setInfo(response.data);
                    console.log(response.data);
                })
                .catch((error) => {
                    console.error('There was an error fetching the user data!', error);
                });
        }
    }, [loginUser]);

    const toggleModal = (field) => {
        setEditField(field);
        setModal(!modal);
    };

    const toggleChargeModal = () => {
        setChargeModal(!chargeModal);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInfo({
            ...info,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        setError('');
        setSelectedFile(file);

        const formData = new FormData();
        formData.append('file', file);
        console.log(formData);
        formData.append('userId', loginUser.email);

        axios
            .post('http://localhost:8080/upload', formData)
            .then((response) => {
                console.log(response.data);
                setInfo({
                    ...info,
                    profileImageUrl: response.data, // 응답으로 받은 파일 이름 설정
                });
            })
            .catch((error) => {
                console.error('There was an error uploading the file!', error);
            });
    };

    const handleSave = () => {
        axios
            .post('http://localhost:8080/update', info)
            .then((response) => {
                setInfo(response.data);
                setModal(false);
            })
            .catch((error) => {
                console.error('There was an error updating the user data!', error);
            });
    };

    const handleFieldChange = (e) => {
        setInfo({
            ...info,
            category: e.target.value,
        });
    };

    const handleAgeGroupChange = (e) => {
        const { value, checked } = e.target;
        setInfo((prevState) => {
            if (checked) {
                return { ...prevState, ageGroups: [...prevState.ageGroups, value] };
            } else {
                return { ...prevState, ageGroups: prevState.ageGroups.filter((age) => age !== value) };
            }
        });
    };

    const handleCharge = () => {
        axios
            .post('http://localhost:8080/charge', { userId: loginUser.email, amount: chargeAmount })
            .then((response) => {
                setInfo(response.data);
                setChargeModal(false);
            })
            .catch((error) => {
                console.error('There was an error charging the points!', error);
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
                                className="company-image"
                            />
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
                            <a href={info.websiteUrl || '#'} target="_blank" rel="noopener noreferrer">
                                {info.websiteUrl || 'N/A'}
                            </a>
                        </div>
                    </div>
                    <div className="info-section">
                        <div className="info-box">
                            <h2>회사 소개</h2>
                            <p>
                                {info.companyDescription || 'N/A'}{' '}
                                <Button size="sm" onClick={() => toggleModal('companyDescription')}>
                                    수정
                                </Button>
                            </p>
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
                            <Button size="sm" className="mr-2" onClick={toggleChargeModal}>
                                충전
                            </Button>
                            <Button size="sm">환전</Button>
                        </div>
                    </div>
                    <div className="info-section">
                        <div className="info-box">
                            <h2>선호 분야</h2>
                            <p>
                                {info.category}{' '}
                                <Button size="sm" onClick={() => toggleModal('category')}>
                                    수정
                                </Button>
                            </p>
                        </div>
                    </div>
                    <div className="info-section">
                        <div className="info-box">
                            <h2>광고 선호 연령대</h2>
                            <p>
                                {info.ageGroups.join(', ')}{' '}
                                <Button size="sm" onClick={() => toggleModal('ageGroups')}>
                                    수정
                                </Button>
                            </p>
                        </div>
                    </div>
                </Col>
            </Row>

            <Modal isOpen={modal} toggle={() => setModal(!modal)} size="lg">
                <ModalHeader toggle={() => setModal(!modal)}>
                    수정{' '}
                    {editField === 'companyDescription'
                        ? '회사 소개'
                        : editField === 'category'
                        ? '선호 분야'
                        : '광고 선호 연령대'}
                </ModalHeader>
                <ModalBody>
                    <Form>
                        {editField === 'companyDescription' && (
                            <FormGroup>
                                <Label for="companyDescription">수정 회사 소개</Label>
                                <Input
                                    type="text"
                                    name="companyDescription"
                                    id="companyDescription"
                                    value={info.companyDescription || ''}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                        )}
                        {editField === 'category' && (
                            <FormGroup>
                                <Label for="category">선호 분야 선택</Label>
                                <Input
                                    type="select"
                                    name="category"
                                    id="category"
                                    value={info.category}
                                    onChange={handleFieldChange}
                                >
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
                        {editField === 'ageGroups' && (
                            <FormGroup>
                                <Label>광고 선호 연령대 선택</Label>
                                <div>
                                    <Input
                                        type="checkbox"
                                        id="ageGroup1"
                                        value="10대"
                                        checked={info.ageGroups.includes('10대')}
                                        onChange={handleAgeGroupChange}
                                    />{' '}
                                    10대
                                    <Input
                                        type="checkbox"
                                        id="ageGroup2"
                                        value="20대"
                                        checked={info.ageGroups.includes('20대')}
                                        onChange={handleAgeGroupChange}
                                    />{' '}
                                    20대
                                    <Input
                                        type="checkbox"
                                        id="ageGroup3"
                                        value="30대"
                                        checked={info.ageGroups.includes('30대')}
                                        onChange={handleAgeGroupChange}
                                    />{' '}
                                    30대
                                    <Input
                                        type="checkbox"
                                        id="ageGroup4"
                                        value="40대"
                                        checked={info.ageGroups.includes('40대')}
                                        onChange={handleAgeGroupChange}
                                    />{' '}
                                    40대
                                    <Input
                                        type="checkbox"
                                        id="ageGroup5"
                                        value="50대 이상"
                                        checked={info.ageGroups.includes('50대 이상')}
                                        onChange={handleAgeGroupChange}
                                    />{' '}
                                    50대 이상
                                </div>
                            </FormGroup>
                        )}
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleSave}>
                        저장
                    </Button>
                    <Button color="secondary" onClick={() => setModal(false)}>
                        취소
                    </Button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={chargeModal} toggle={toggleChargeModal}>
                <ModalHeader toggle={toggleChargeModal}>금액 충전</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="chargeAmount">충전할 금액</Label>
                            <Input
                                type="number"
                                name="chargeAmount"
                                id="chargeAmount"
                                value={chargeAmount}
                                onChange={(e) => setChargeAmount(Number(e.target.value))}
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleCharge}>
                        충전
                    </Button>
                    <Button color="secondary" onClick={toggleChargeModal}>
                        취소
                    </Button>
                </ModalFooter>
            </Modal>
        </Container>
    );
};

export default MyInfo;
