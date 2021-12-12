import React, { Component } from "react";
import Evoting from "../contracts/Evoting.json";
import getWeb3 from "../getWeb3";

import '../index.css';

import NavigationAdmin from './NavigationAdmin';
import Navigation from './Navigation';

class CandidateDetails extends Component {
  constructor(props) {
    super(props)

    this.state = {
      EvotingInstance: undefined,
      account: null,
      web3: null,
      jumlahKandidat: 0,
      daftarKandidat: null,
      loaded: false,
      isOwner: false
    }
  }

  // getCandidates = async () => {
  //   let result = await this.state.EvotingInstance.methods.getCandidates().call();

  //   this.setState({ candidates : result });
  //   for(let i =0; i <result.length ; i++)


  // }

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

      let jumlahKandidat = await this.state.EvotingInstance.methods.mendapatkanJumlahKandidat().call();
      this.setState({ jumlahKandidat: jumlahKandidat });

      let daftarKandidat = [];
      for (let i = 0; i < jumlahKandidat; i++) {
        let kandidat = await this.state.EvotingInstance.methods.rincihanKandidat(i).call();

        daftarKandidat.push(kandidat);
      }

      this.setState({ daftarKandidat: daftarKandidat });

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
            <div className="CandidateDetails">
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

    return (
      <div className="CandidateDetails">
        <div className="CandidateDetails-title">
          <h1>
            Daftar Kandidat
          </h1>
        </div>

        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}

        <div className="CandidateDetails-sub-title">
          Total Jumlah Kandidat- {this.state.jumlahKandidat}
        </div>
        <div>
          {daftarKandidat}
        </div>
      </div>
    );
  }
}

export default CandidateDetails;
