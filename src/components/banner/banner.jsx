import React, { useState } from 'react';
import { Container, Row, Col, Input, Button } from 'reactstrap';

const HeaderBanner = () => {

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        console.log('검색어:', searchQuery);
        // 검색 로직 구현 필요
    };

    return (
        <div className="static-slider-head">
            <Container>
                <Row className="justify-content-center">
                    <Col lg="8" md="6" className="align-self-center text-center">
                        <h1 className="title">인플루언서 공정 거래 플랫폼</h1>
                        {/* 검색창 */}
                        <div className="search-bar d-flex">
                            <Input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="검색어 입력"
                                className="flex-grow-1"
                            />
                            <Button onClick={handleSearch} color="info" className="ml-2">
                                검색
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default HeaderBanner;
