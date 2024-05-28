// src/views/custom-components/Login.jsx
import React from 'react';
import PropTypes from 'prop-types';
import Header from '../../components/header/header.jsx';
import Footer from '../../components/footer/footer.jsx';
import LoginForm from './sections/loginform.jsx';

const Login = () => {
    return (
        <div id="main-wrapper">
            <Header />
            <div className="page-wrapper">
                <div className="container-fluid">
                    {/* 로그인 및 회원가입 */}
                    <LoginForm />
                </div>
            </div>
            <Footer />
        </div>
    );
};

Login.propTypes = {
    classes: PropTypes.object,
};

export default Login;
