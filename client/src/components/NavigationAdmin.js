import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NavigationAdmin extends Component {
    render() {
        return (
            <div className='navbar'>
                <div className="Admin">ADMIN</div>
                <Link to='/' className="heading">HOME</Link>
                <Link to='/CandidateDetails'>KANDIDAT</Link>
                <Link to='/RequestVoter'>DAFTAR MENJADI PEMILIH</Link>
                <Link to='/Vote'>VOTE</Link>
                <Link to='/VerifyVoter'>VERIFIKASI</Link>
                <Link to='/AddCandidate'>PENAMBAHAN KANDIDAT</Link>
                <Link to='/Result'>HASIL</Link>
                <Link to='/Admin'>MULAI/BERHENTI</Link>
            </div>
        );
    }
}

export default NavigationAdmin;