import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DataContext } from '../../../context/DataContext';

const LoginForm = () => {
    const navigate = useNavigate();
    const { data, setData } = useContext(DataContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        console.log('Current data in context after update:', data);
    }, [data]);

    const handleSuccess = (event) => {
        event.preventDefault();

        const loginData = {
            email,
            password,
        };

        axios
            .post('http://localhost:8080/login', loginData)
            .then((response) => {
                console.log('Response Data:', response.data);
                if (response.data.status === 'success') {
                    alert(`${email}님, 환영합니다!`);
                    setData(response.data); // 전역 상태에 데이터 저장

                    // 로그인 성공 후 모든 사용자 요약 정보 가져오기
                    axios
                        .get('http://localhost:8080/api/account-summaries')
                        .then((accountResponse) => {
                            console.log('Account Summaries Data:', accountResponse.data);
                            setData((prevData) => ({
                                ...prevData,
                                accountSummaries: accountResponse.data,
                                loginState: true,
                                loginUser: { email },
                            }));
                            console.log(data.loginUser);
                            navigate('/'); // 홈으로 이동
                        })
                        .catch((accountError) => {
                            console.error('There was an error fetching the account summaries!', accountError);
                            alert('계정 요약 데이터를 가져오는 중 오류가 발생했습니다.');
                        });
                } else {
                    alert('로그인 정보가 올바르지 않습니다.');
                }
            })
            .catch((error) => {
                console.error('There was an error!', error);
                alert('로그인 중 오류가 발생했습니다.');
            });
    };

    const handleCancel = (event) => {
        event.preventDefault();
        navigate('/'); // 홈 페이지로 리다이렉트
    };

    return (
        <div>
            <div className="spacer" id="forms-component">
                <Container>
                    <Row className="justify-content-center">
                        <Col md="7" className="text-center">
                            <h1 className="title font-bold">이건 로그인</h1>
                            <h6 className="subtitle">
                                Here you can check Demos we created based on WrapKit. Its quite easy to Create your own
                                dream website &amp; dashboard in No-time.
                            </h6>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Container>
                <Row>
                    <Col md="12">
                        <Form className="row" onSubmit={handleSuccess}>
                            <FormGroup className="col-md-6 form-group-margin">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter email"
                                />
                            </FormGroup>

                            <FormGroup className="col-md-6 form-group-margin">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                />
                            </FormGroup>

                            <FormGroup className="col-md-12 ml-3">
                                <Input id="checkbox1" type="checkbox" />
                                <Label htmlFor="checkbox1"> Remember me </Label>
                            </FormGroup>
                            <Col md="12">
                                <Button type="submit" className="btn btn-success waves-effect waves-light m-r-10">
                                    Login
                                </Button>
                                <Button
                                    type="button"
                                    className="btn btn-inverse waves-effect waves-light"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                            </Col>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default LoginForm;
