import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Modal, ModalBody } from 'reactstrap';
import { DataContext } from '../../../context/DataContext';
import './styles.css';
import ModalComponent from './ModalComponent'; // 자세히 보기
import ProposalListModal from './ProposalListModal'; // 제안서 목록

const Buttons = ({ userId }) => {
    const [modal, setModal] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const { data } = useContext(DataContext);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProposalListModalOpen, setIsProposalListModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null); // 선택된 항목을 저장

    const toggle = () => setModal(!modal);
    const toggleProposalListModal = (item) => {
        setSelectedItem(item); // 선택된 항목 설정
        setIsProposalListModalOpen(!isProposalListModalOpen);
    };

    useEffect(() => {
        if (data && data.accounts && data.accounts.length > 0) {
            setIsLoading(false);
        }
    }, [data]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const items = (data.accounts || []).map((account) => {
        const totalLikes = account.posts.reduce((acc, post) => acc + post.likes, 0);
        const totalComments = account.posts.reduce((acc, post) => acc + post.comments.length, 0);
        const postCount = account.posts.length;

        const averageLikes = postCount ? Math.ceil(totalLikes / postCount) : 0;
        const averageComments = postCount ? Math.ceil(totalComments / postCount) : 0;

        const sortedPosts = account.posts.sort((a, b) => new Date(b.post_time) - new Date(a.post_time));
        const images = sortedPosts
            .slice(0, 6)
            .map((post) => (post.image_urls.length > 0 ? `http://localhost:8080/uploads/${post.image_urls[0]}` : ''));

        return {
            id: `Account ${account.account_id}`,
            profileImage: `http://localhost:8080/uploads/${account.profile_image}`,
            name: account.username,
            category: account.category.join(', '),
            followers: account.followers,
            likes: averageLikes,
            comments: averageComments,
            profileViews: account.profile_views,
            images: images,
            posts: sortedPosts,
        };
    });

    const imgClick = (post) => {
        setCurrentItem(post);
        setModal(true);
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const readMore = (item) => {
        console.log(`Fetching data for ${item.name}`); // 디버깅용 로그
        axios
            .get(`http://localhost:8080/api/account-summaries/${item.name}`)
            .then((response) => {
                console.log('Fetched data:', response.data); // 디버깅용 로그
                setCurrentItem({
                    ...item,
                    accountSummaries: response.data.accountSummaries,
                    followersAgeRanges: response.data.followersAgeRanges,
                    genderRatios: response.data.genderRatios,
                });
                toggleModal();
            })
            .catch((error) => {
                console.error('There was an error fetching the data!', error);
            });
    };

    const handleModalClick = (e) => {
        if (e.target.classList.contains('modal')) {
            setModal(false);
        }
    };

    return (
        <Container className="influencer-container">
            {items.map((item) => (
                <Row key={item.id} className="mb-5 influencer-row">
                    <Col md="3" className="profile-section">
                        <div className="d-flex align-items-center">
                            <input type="checkbox" className="mr-3" />
                            <img src={item.profileImage} alt={item.name} className="profile-image" />
                            <div className="item-info ml-3">
                                <h5>{item.name}</h5>
                                <p>{item.category}</p>
                                <Button className="details-button" onClick={() => readMore(item)}>
                                    자세히 보기
                                </Button>
                                {isModalOpen && (
                                    <ModalComponent
                                        isOpen={isModalOpen}
                                        onRequestClose={toggleModal}
                                        currentItem={currentItem}
                                        accountSummaries={data.accountSummaries}
                                    />
                                )}
                            </div>
                        </div>
                    </Col>
                    <Col md="6" className="stats-section">
                        <div className="item-stats d-flex justify-content-around text-center">
                            <div className="stat">
                                <strong>{item.followers.toLocaleString()}</strong>
                                <span>팔로워</span>
                            </div>
                            <div className="stat">
                                <strong>{item.likes.toLocaleString()}</strong>
                                <span>평균 좋아요</span>
                            </div>
                            <div className="stat">
                                <strong>{item.comments.toLocaleString()}</strong>
                                <span>평균 댓글</span>
                            </div>
                            <div className="stat">
                                <strong>{item.profileViews.toLocaleString()}</strong>
                                <span>프로필 조회수</span>
                            </div>
                        </div>
                        <div className="item-images mt-3 d-flex justify-content-center">
                            {item.posts
                                .slice(0, 6)
                                .map(
                                    (post, i) =>
                                        post.image_urls.length > 0 && (
                                            <img
                                                key={i}
                                                src={`http://localhost:8080/uploads/${post.image_urls[0]}`}
                                                alt={`Post ${i + 1}`}
                                                className="additional-image"
                                                onClick={() => imgClick(post)}
                                            />
                                        )
                                )}
                        </div>
                    </Col>
                    <Col md="3" className="actions-section d-flex flex-column align-items-end">
                        <Button className="suggest-button mb-2" onClick={() => toggleProposalListModal(item)}>
                            제안하기
                        </Button>
                    </Col>
                </Row>
            ))}
            {currentItem && currentItem.image_urls && currentItem.image_urls.length > 0 && (
                <Modal isOpen={modal} toggle={toggle} className="click_img" onClick={handleModalClick}>
                    <ModalBody className="text-center">
                        <img
                            src={`http://localhost:8080/uploads/${currentItem.image_urls[0]}`}
                            alt="Post"
                            className="img-fluid"
                        />
                        <div className="info">
                            <p>
                                좋아요: {currentItem.likes.toLocaleString()}&nbsp;&nbsp;댓글:{' '}
                                {currentItem.comments.length.toLocaleString()}&nbsp;&nbsp;게시 날짜:{' '}
                                {new Date(currentItem.post_time).toLocaleDateString()}
                            </p>
                        </div>
                    </ModalBody>
                </Modal>
            )}
            <ProposalListModal
                isOpen={isProposalListModalOpen}
                toggle={toggleProposalListModal}
                userId={userId}
                toId={selectedItem ? selectedItem.name : ''}
            />
        </Container>
    );
};

export default Buttons;
