import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Navigation extends Component {
    render() {
        return (
            <div className='navbar'>
                <Link to='/' className="heading">HOME</Link>
                <Link to='/CandidateDetails'>KANDIDAT</Link>
                <Link to='/RequestVoter'>DAFTAR MENJADI PEMILIH</Link>
                <Link to='/Vote'>VOTE</Link>
            </div>
        );
    }
}

export default Navigation;