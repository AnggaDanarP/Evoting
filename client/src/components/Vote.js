import React, { Component } from "react";
import Evoting from "../contracts/Evoting.json";
import getWeb3 from "../getWeb3";

import { FormGroup, FormControl, Button } from 'react-bootstrap';

import NavigationAdmin from './NavigationAdmin';
import Navigation from './Navigation';

class Vote extends Component {
  constructor(props) {
    super(props)

    this.state = {
      EvotingInstance: undefined,
      account: null,
      web3: null,
      daftarKandidat: null,
      idKandidat: null,
      toggle: false,
      myAccount: null,
      mulai: false,
      selesai: false,
      isOwner: false
    }
  }

  updateCandidateId = event => {
    this.setState({ idKandidat: event.target.value });
  }

  vote = async () => {
    // let kandidat = await this.state.EvotingInstance.methods.rincihanKandidat(this.state.idKandidat).call();
    // await this.state.EvotingInstance.methods.penambahanKandidat(this.state.nama, this.state.partai, this.state.visimisi).send({from : this.state.account , gas: 1000000});

    await this.state.EvotingInstance.methods.memilih(this.state.idKandidat).send({ from: this.state.account, gas: 1000000 });
    this.setState({ toggle: true });
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

      let myAccount = await this.state.EvotingInstance.methods.rincihanPemilih(this.state.account).call();
      this.setState({ myAccount: myAccount });


      let jumlahKandidat = await this.state.EvotingInstance.methods.mendapatkanJumlahKandidat().call();

      let daftarKandidat = [];
      for (let i = 0; i < jumlahKandidat; i++) {
        let kandidat = await this.state.EvotingInstance.methods.rincihanKandidat(i).call();
        
          daftarKandidat.push(kandidat);
        
      }
      this.setState({ daftarKandidat: daftarKandidat });

      let mulai = await this.state.EvotingInstance.methods.getStart().call();
      let selesai = await this.state.EvotingInstance.methods.getEnd().call();

      this.setState({ mulai: mulai, selesai: selesai });

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

    let daftarKandidat;
    if (this.state.daftarKandidat) {
      daftarKandidat = this.state.daftarKandidat.map((kandidat) => {
        return (
          <div className="candidate">
            <div className="candidateName">{kandidat.nama}</div>
            <div className="candidateDetails">
              <div>Partai : {kandidat.partai}</div>
              <div>Visi dan Misi : {kandidat.visimisi}</div>
              <div>Kandidat ID : {kandidat.idKandidat}</div>
            </div>
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

    if (this.state.selesai) {
      return (
        <div className="CandidateDetails">
          <div className="CandidateDetails-title">
            <h1>
              PEMILIHAN SELESAI
            </h1>
          </div>
          {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
        </div>
      );
    }

    if (!this.state.mulai) {
      return (
        <div className="CandidateDetails">
          <div className="CandidateDetails-title">
            <h1>
              VOTING BELUM DIMULAI
            </h1>
          </div>

          <div className="CandidateDetails-sub-title">
            Mohon tunggu.....sampai pemilihan dimulai!
          </div>
          {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
        </div>
      );
    }

    if (this.state.myAccount) {
      if (!this.state.myAccount.verifikasi) {
        return (
          <div className="CandidateDetails">
            <div className="CandidateDetails-title">
              <h1>
                Anda perlu verifikasi dari Admin untuk dapat melakukan Voting
              </h1>
            </div>

            <div className="CandidateDetails-sub-title">
              Mohon tunggu....proses verifikasi membutuhkan waktu
            </div>
            {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
          </div>
        );
      }
    }

    if (this.state.myAccount) {
      if (this.state.myAccount.telahMemilih) {
        return (
          <div className="CandidateDetails">
            <div className="CandidateDetails-title">
              <h1>
                ANDA SUDAH MENGGUNAKAN HAK PILIH ANDA
              </h1>
            </div>
            {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
          </div>
        );
      }
    }

    return (
      <div className="App">
        {/* <div>{this.state.owner}</div> */}
        {/* <p>Account address - {this.state.account}</p> */}
        <div className="CandidateDetails">
          <div className="CandidateDetails-title">
            <h1>
              VOTE
            </h1>
          </div>
        </div>
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}

        <div className="form">
          <FormGroup>
            <div className="form-label">Masukan ID kandidat yang ingin anda pilih - </div>
            <div className="form-input">
              <FormControl
                input='text'
                value={this.state.idKandidat}
                onChange={this.updateCandidateId}
              />
            </div>

            <Button onClick={this.vote} className="button-vote">
              Pilih
            </Button>
          </FormGroup>
        </div>

        {/* <Button onClick={this.getCandidates}>
          Get Name
        </Button> */}

        <div>
          {daftarKandidat}
        </div>

      </div>
    );
  }
}

export default Vote;
