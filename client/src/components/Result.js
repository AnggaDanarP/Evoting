import React, { Component } from "react";
import Evoting from "../contracts/Evoting.json";
import getWeb3 from "../getWeb3";

import NavigationAdmin from './NavigationAdmin';
import Navigation from './Navigation';

import { FormGroup, Button } from 'react-bootstrap';

class Result extends Component {
  constructor(props) {
    super(props)

    this.state = {
      EvotingInstance: undefined,
      account: null,
      web3: null,
      toggle: false,
      Hasil: null,
      isOwner: false,
      daftarKandidat:null,
      mulai: false,
      selesai: false
    }
  }

  hasil = async () => {

    let hasil = [];
    let max = 0;

    let jumlahKandidat = await this.state.EvotingInstance.methods.mendapatkanJumlahKandidat().call();
    for (let i = 0; i < jumlahKandidat; i++) {
      let kandidat = await this.state.EvotingInstance.methods.rincihanKandidat(i).call();
      if (kandidat.jumlahSuara >= max) {
        hasil.push(kandidat);
        max = kandidat.jumlahSuara
      } 
    }
    console.log(hasil)
    this.setState({ Hasil: hasil });
    this.setState({ toggle: true });

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

    let daftarKandidat;
    if (this.state.Hasil) {
      daftarKandidat = this.state.Hasil.map((kandidat) => {
        return (
          <div className="candidate">
            <div className="candidateName">{kandidat.nama} : {kandidat.jumlahSuara} Votes</div>
            <div className="candidateDetails">
              <div>Partai : {kandidat.partai}</div>
              <div>Visi dan Misi : {kandidat.visimisi}</div>
              <div>Candidate ID : {kandidat.idKandidat}</div>
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

    if (!this.state.selesai) {
      return (
        <div className="CandidateDetails">
          <div className="CandidateDetails-title">
            <h1>
              PEMILIHAN SELESAI....HASIL AKAN DIPERLIHATKAN
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
              HASIL
            </h1>
          </div>
        </div>
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}


        <div className="form">
          <FormGroup>
            <Button onClick={this.hasil} className="button-vote">
              Perlihatkan Hasil
            </Button>
          </FormGroup>
        </div>


        <br></br>

        {this.state.toggle ?
          <div className="CandidateDetails-mid-sub-title">
            Leaders -
          </div>
          
         

          : ''}

        <div>
          {daftarKandidat}
        </div>


      </div>
    );
  }
}

export default Result;
