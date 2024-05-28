/* eslint-disable */
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Container, NavbarBrand, Navbar, NavbarToggler, Collapse, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

import logo from '../../assets/images/logos/hcn_logo.png';
import { DataContext } from '../../context/DataContext';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { data, setData } = useContext(DataContext);
    const { loginState, loginUser } = data || {}; // Ensure data is always an object
    const navigate = useNavigate();

    const toggle = () => setIsOpen(!isOpen);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    const handleLogout = () => {
        setData({
            loginState: false,
            loginUser: null,
            accountSummaries: [],
            // other initial state properties
        });
        navigate('/');
    };

    return (
        <div className="topbar" id="top">
            <div className="header6">
                <Container className="po-relative">
                    <Navbar className="navbar-expand-lg h6-nav-bar">
                        <NavbarBrand href="/">
                            <img src={logo} alt="wrapkit" style={{ width: '100px', height: 'auto' }} />
                        </NavbarBrand>
                        <NavbarToggler onClick={toggle}>
                            <span className="ti-menu"></span>
                        </NavbarToggler>
                        <Collapse
                            isOpen={isOpen}
                            navbar
                            className="hover-dropdown font-14 justify-content-end"
                            id="h6-info"
                        >
                            {loginState ? (
                                <Dropdown nav isOpen={dropdownOpen} toggle={toggleDropdown}>
                                    <DropdownToggle nav caret>
                                        {loginUser?.email}
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                        <DropdownItem>
                                            <Link to="/my-info" className="dropdown-item">내정보</Link>
                                        </DropdownItem>
                                        <DropdownItem onClick={handleLogout}>
                                            로그아웃
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            ) : (
                                <>
                                    <div className="act-buttons">
                                        <Link to="/login" className="btn btn-success-gradiant font-14">
                                            Login
                                        </Link>
                                    </div>
                                    <div className="act-buttons">
                                        <Link to="/custom-components" className="btn btn-success-gradiant font-14">
                                            Join
                                        </Link>
                                    </div>
                                </>
                            )}
                        </Collapse>
                    </Navbar>
                </Container>
            </div>
        </div>
    );
};

export default Header;
