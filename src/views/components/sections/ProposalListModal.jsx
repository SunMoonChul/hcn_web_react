import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, ListGroup, ListGroupItem } from 'reactstrap';
import ContractModal from './ContractModal';
import '../../../assets/css/ProposalListModal.css';

const ProposalListModal = ({ isOpen, toggle, userId, toId }) => {
    const [proposals, setProposals] = useState([]);
    const [isContractModalOpen, setIsContractModalOpen] = useState(false);
    const [currentProposal, setCurrentProposal] = useState(null);

    useEffect(() => {
        if (isOpen && userId) {
            fetch(`http://localhost:8080/api/proposals/byUserId/${userId}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log('Fetched proposals:', data);
                    if (Array.isArray(data)) {
                        setProposals(data);
                    } else {
                        setProposals([]);
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                    setProposals([]);
                });
        }
    }, [isOpen, userId]);

    const toggleContractModal = () => setIsContractModalOpen(!isContractModalOpen);
    const refreshProposals = () => {
        if (userId) {
            fetch(`http://localhost:8080/api/proposals/byUserId/${userId}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log('Fetched proposals:', data);
                    if (Array.isArray(data)) {
                        setProposals(data);
                    } else {
                        setProposals([]);
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                    setProposals([]);
                });
        }
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const handleProposalClick = async (proposal) => {
        try {
            const response = await fetch(`http://localhost:8080/uploads/${proposal.photoUrl}`);
            const blob = await response.blob();
            const photoFile = new File([blob], proposal.photoUrl.split('/').pop(), { type: blob.type });

            const formData = new FormData();
            formData.append('fromId', userId);
            formData.append('toId', toId);
            formData.append('photoUrl', photoFile); // 파일로 변환된 photoUrl 추가
            formData.append('goodName', proposal.goodName);
            formData.append('goodDetail', proposal.goodDetail);
            formData.append('goodRequire', proposal.goodRequire);
            formData.append('term', proposal.term);
            formData.append('payWay', proposal.payWay);
            formData.append('pay', proposal.pay);
            formData.append('time', formatDate(new Date()));

            const sendResponse = await fetch('http://localhost:8080/api/sendProposal', {
                method: 'POST',
                body: formData,
            });
            const data = await sendResponse.json();
            console.log('Proposal sent:', data);
            toggle(); // 모달을 닫습니다.
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleEditClick = (proposal) => {
        setCurrentProposal(proposal);
        setIsContractModalOpen(true);
    };

    return (
        <>
            <Modal isOpen={isOpen} toggle={toggle} size="lg">
                <ModalHeader toggle={toggle}>제안서 목록</ModalHeader>
                <ModalBody>
                    <ListGroup>
                        {proposals.length > 0 ? (
                            proposals.map((proposal) => (
                                <ListGroupItem
                                    key={proposal.id}
                                    style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
                                >
                                    <div onClick={() => handleProposalClick(proposal)}>
                                        <img
                                            src={`http://localhost:8080/uploads/${proposal.photoUrl}`}
                                            alt={proposal.goodName}
                                            className="proposal-image"
                                        />
                                        이름 : {proposal.goodName}
                                        <div className="proposal-time">작성 시간: {proposal.time}</div>
                                    </div>
                                    <Button
                                        color="secondary"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditClick(proposal);
                                        }}
                                    >
                                        수정하기
                                    </Button>
                                </ListGroupItem>
                            ))
                        ) : (
                            <div>제안서가 없습니다.</div>
                        )}
                    </ListGroup>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        onClick={() => {
                            setCurrentProposal(null);
                            toggleContractModal();
                        }}
                    >
                        제안서 추가하기
                    </Button>
                    <Button color="secondary" onClick={toggle}>
                        닫기
                    </Button>
                </ModalFooter>
            </Modal>

            <ContractModal
                isOpen={isContractModalOpen}
                toggle={toggleContractModal}
                email={userId}
                refreshProposals={refreshProposals}
                initialProposal={currentProposal} // 수정할 제안서 정보를 넘겨줍니다.
            />
        </>
    );
};

export default ProposalListModal;
