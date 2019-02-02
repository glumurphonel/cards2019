pragma solidity >=0.5.0<0.6.0;

contract FlashCards {
  address public admin;

  constructor() public {
    admin = msg.sender;
  }

  modifier isAdmin() {
    require(msg.sender == admin, "Not an admin");
    _;
  }

}
