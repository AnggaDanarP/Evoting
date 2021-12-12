// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.4.17;
// pragma experimental ABIEncoderv2;

contract Evoting {
    address public admin;
    uint jumlahKandidat;
    uint jumlahPemilih;
    bool mulai;
    bool selesai;

    function Evoting() public {
        admin = msg.sender;
        jumlahKandidat = 0;
        jumlahPemilih = 0;
        mulai = false;
        selesai = false;
    }

    // Hanya admin yang bisa mengakses
    function Admin() public view returns(address) {
        return admin;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin);
        _;
    }

    // Set up kandidat
    struct Kandidat{
        string nama;
        string partai;
        string visimisi;
        uint idKandidat;
        uint jumlahSuara;
    }

    mapping(uint => Kandidat) public rincihanKandidat;

    // Hanya admin yang melakukan
    function penambahanKandidat(string _nama, string _partai, string _visimisi) public onlyAdmin() {
        Kandidat memory newKandidat = Kandidat({
            nama : _nama,
            partai : _partai,
            visimisi : _visimisi,
            idKandidat : jumlahKandidat,
            jumlahSuara : 0
        });
        rincihanKandidat[jumlahKandidat] = newKandidat;
        jumlahKandidat += 1;
    }

    function mendapatkanJumlahKandidat() public view returns (uint) {
        return jumlahKandidat;
    }

    // Set up pemilih
    struct Pemilih {
        address alamatPemilih;
        string nama;
        string id;
        bool telahMemilih;
        bool verifikasi;
    }

    address[] public pemilih;
    mapping(address => Pemilih) public rincihanPemilih;

    function permohonanPemilih(string _nama, string _id) public {
        Pemilih memory newPemilih = Pemilih({
            alamatPemilih : msg.sender,
            nama : _nama,
            id : _id,
            telahMemilih : false,
            verifikasi : false
        });
        rincihanPemilih[msg.sender] = newPemilih;
        pemilih.push(msg.sender);
        jumlahPemilih += 1;
    }

    function mendapatkanJumlahPemilih() public view returns (uint) {
        return jumlahPemilih;
    }

    function memverifikasi(address _alamatPemilih) public onlyAdmin() {
        rincihanPemilih[_alamatPemilih].verifikasi = true;
    }

    // Proses pemilihan suara
    function memilih(uint idKandidat) public {
        require(rincihanPemilih[msg.sender].telahMemilih == false);
        require(rincihanPemilih[msg.sender].verifikasi == true);
        require(mulai == true);
        require(selesai == false);

        rincihanKandidat[idKandidat].jumlahSuara += 1;
        rincihanPemilih[msg.sender].telahMemilih = true;
    }

    function mulaiElection() public onlyAdmin {
        mulai = true;
        selesai = false;
    }

    function selesaiElection() public onlyAdmin {
        selesai = true;
        mulai = false;
    }

    function getStart() public view returns (bool) {
        return mulai;
    }

    function getEnd() public view returns (bool) {
        return selesai;
    }
}