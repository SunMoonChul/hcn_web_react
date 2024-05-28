import React from 'react';
import PropTypes from 'prop-types';

// core components
import Header from '../../components/header/header.jsx';
import Footer from '../../components/footer/footer.jsx';

// sections for this page
import PageForm from './sections/form.jsx';

//회원가입 폼
const CustomComponents = () => {
    return (
        <div id="main-wrapper">
            <Header />
            <div className="page-wrapper">
                <div className="container-fluid">
                    {/* 로그인 및 회원가입*/}
                    <PageForm />
                </div>
            </div>
            <Footer />
        </div>
    );
};

CustomComponents.propTypes = {
    classes: PropTypes.object,
};

export default CustomComponents;
