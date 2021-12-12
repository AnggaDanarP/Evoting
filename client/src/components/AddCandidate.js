import React, { Component } from "react";
import Evoting from "../contracts/Evoting.json";
import getWeb3 from "../getWeb3";

import { FormGroup, FormControl, Button } from 'react-bootstrap';

import NavigationAdmin from './NavigationAdmin';
import Navigation from './Navigation';

class AddCandidate extends Component {
    constructor(props) {
        super(props)

        this.state = {
            EvotingInstance: undefined,
            account: null,
            web3: null,
            nama: '',
            partai: '',
            visimisi: '',
            candidates: null,
            isOwner: false
        }
    }

    updateNama = event => {
        this.setState({ nama: event.target.value });
    }

    updatePartai = event => {
        this.setState({ partai: event.target.value });
    }

    updateVisimisi = event => {
        this.setState({ visimisi: event.target.value });
    }

    penambahanKandidat = async () => {
        await this.state.EvotingInstance.methods.penambahanKandidat(this.state.nama, this.state.partai, this.state.visimisi).send({ from: this.state.account, gas: 1000000 });
        // Reload
        window.location.reload(false);
    }

    componentDidMount = async () => {

        // FOR REFRESHING PAGE ONLY ONCE -
        if (!window.location.hash) {
            window.location = window.location + '#loaded';
            window.location.reload();
        }
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();

            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = Evoting.networks[networkId];
            const instance = new web3.eth.Contract(
                Evoting.abi,
                deployedNetwork && deployedNetwork.address,
            );
            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.

            this.setState({ EvotingInstance: instance, web3: web3, account: accounts[0] });

            const owner = await this.state.EvotingInstance.methods.Admin().call();
            if (this.state.account === owner) {
                this.setState({ isOwner: true });
            }

        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    render() {
        if (!this.state.web3) {
            return (
                <div className="CandidateDetails">
                    <div className="CandidateDetails-title">
                        <h1>
                            Loading Web3, accounts, and contract..
                        </h1>
                    </div>
                    {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
                </div>
            );
        }

        if (!this.state.isOwner) {
            return (
                <div className="CandidateDetails">
                    <div className="CandidateDetails-title">
                        <h1>
                            HANYA ADMIN YANG BISA MENGAKSES
                        </h1>
                    </div>
                    {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
                </div>
            );
        }
        return (
            <div className="App">

                <div className="CandidateDetails">
                    <div className="CandidateDetails-title">
                        <h1>
                            Penambahan Kandidat
                        </h1>
                    </div>
                </div>
                {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}

                <div className="form">
                    <FormGroup>
                        <div className="form-label">Masukan nama - </div>
                        <div className="form-input">
                            <FormControl
                                input='text'
                                value={this.state.nama}
                                onChange={this.updateNama}
                            />
                        </div>
                    </FormGroup>

                    <FormGroup>
                        <div className="form-label">Dari Partai - </div>
                        <div className="form-input">
                            <FormControl
                                input='textArea'
                                value={this.state.partai}
                                onChange={this.updatePartai}
                            />
                        </div>
                    </FormGroup>

                    <FormGroup>
                        <div className="form-label">Visi dan Misi - </div>
                        <div className="form-input">
                            <FormControl
                                input='text'
                                value={this.state.visimisi}
                                onChange={this.updateVisimisi}
                            />
                        </div>
                    </FormGroup>

                    <Button onClick={this.penambahanKandidat} className="button-vote">
                        Tambah
                    </Button>
                </div>

            </div>
        );
    }
}

export default AddCandidate;
