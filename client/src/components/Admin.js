import React, { Component } from "react";
import Evoting from "../contracts/Evoting.json";
import getWeb3 from "../getWeb3";

import NavigationAdmin from './NavigationAdmin';
import Navigation from './Navigation';

import { Button } from 'react-bootstrap';


class Admin extends Component {
    constructor(props) {
        super(props)

        this.state = {
            EvotingInstance: undefined,
            account: null,
            web3: null,
            isOwner: false,
            mulai: false,
            selesai: false
        }
    }

    penambahanKandidat = async () => {

        await this.state.EvotingInstance.methods.penambahanKandidat(this.state.nama, this.state.partai, this.state.visimisi).send({ from: this.state.account, gas: 1000000 });
        // Reload
        window.location.reload(false);
    }

    mulaiElection = async () => {
        await this.state.EvotingInstance.methods.mulaiElection().send({ from: this.state.account, gas: 1000000 });
        window.location.reload(false);
    }

    selesaiElection = async () => {
        await this.state.EvotingInstance.methods.selesaiElection().send({ from: this.state.account, gas: 1000000 });
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

            let mulai = await this.state.EvotingInstance.methods.getStart().call();
            let selesai = await this.state.EvotingInstance.methods.getEnd().call();

            this.setState({ mulai: mulai, selesai: selesai });

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
                {/* <div>{this.state.owner}</div> */}
                {/* <p>Account address - {this.state.account}</p> */}
                <div className="CandidateDetails">
                    <div className="CandidateDetails-title">
                        <h1>
                            ADMIN PORTAL
                        </h1>
                    </div>
                </div>
                {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}


                <div className="admin-buttons">
                    {this.state.mulai
                        ? <Button onClick={this.mulaiElection} className="admin-buttons-start-s">Pemilihan Dimulai</Button>
                        : <Button onClick={this.mulaiElection} className="admin-buttons-start-e">Pemilihan Dimulai</Button>
                    }
                    {this.state.selesai
                        ? <Button onClick={this.selesaiElection} className="admin-buttons-end-s">Pemilihan Selesai</Button>
                        : <Button onClick={this.selesaiElection} className="admin-buttons-end-e">Pemilihan Selesai</Button>
                    }
                </div>

            </div>
        );
    }
}

export default Admin;
