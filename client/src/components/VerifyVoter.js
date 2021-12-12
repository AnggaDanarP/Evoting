import React, { Component } from "react";
import Evoting from "../contracts/Evoting.json";
import getWeb3 from "../getWeb3";

import { Button } from 'react-bootstrap';

import NavigationAdmin from './NavigationAdmin';
import Navigation from './Navigation';

import '../index.css';

class VerifyVoter extends Component {
  constructor(props) {
    super(props)

    this.state = {
      EvotingInstance: undefined,
      account: null,
      web3: null,
      daftarPemilih: null,
      isOwner: false
    }
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

      // this.setState({ web3, accounts, contract: instance }, this.runExample);
      this.setState({ EvotingInstance: instance, web3: web3, account: accounts[0] });

      let jumlahPemilih = await this.state.EvotingInstance.methods.mendapatkanJumlahPemilih().call();

      let daftarPemilih = [];
      for (let i = 0; i < jumlahPemilih; i++) {
        let alamatPemilih = await this.state.EvotingInstance.methods.pemilih(i).call();
        let rincihanPemilih = await this.state.EvotingInstance.methods.rincihanPemilih(alamatPemilih).call();
        if (!rincihanPemilih.telahMemilih) {
        }
        daftarPemilih.push(rincihanPemilih);
      }
      this.setState({ daftarPemilih: daftarPemilih });

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

  verifikasi = async event => {
    await this.state.EvotingInstance.methods.memverifikasi(event.target.value).send({ from: this.state.account, gas: 1000000 });
    window.location.reload(false);
  }

  render() {
    let daftarPemilih;
    if (this.state.daftarPemilih) {
      daftarPemilih = this.state.daftarPemilih.map((pemilih) => {
        return (
          <div className="candidate">
            <div className="candidateName">{pemilih.nama}</div>
            <div className="candidateDetails">
              <div>ID : {pemilih.id}</div>
              <div>Alamat Pemilih : {pemilih.alamatPemilih}</div>
            </div>

            {pemilih.verifikasi ? <Button className="button-verified">Verified</Button> : <Button onClick={this.verifikasi} value={pemilih.alamatPemilih} className="button-verify">Verifikasi</Button>}
          </div>
        );
      });
    }

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
      <div>
        <div className="CandidateDetails">
          <div className="CandidateDetails-title">
            <h1>
              Verifikasi Pemilih
            </h1>
          </div>
        </div>
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}

        <div>
          {daftarPemilih}
        </div>
      </div>
    );
  }
}

export default VerifyVoter;
