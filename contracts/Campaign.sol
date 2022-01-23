// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;

// Parent contract
contract CampaignFactory{
    address[] public deployedCampaigns;

    // Campaign public camp;

    function createCampaign(uint minimum, string memory desc) public{
        address newCampaign = address(new Campaign(minimum,msg.sender,desc));
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns(address[] memory){
        return deployedCampaigns;
    }
}


// child contract
contract Campaign{

    struct Request{
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address=>bool) approvals;
    }


    string public description;

    mapping(uint=>Request) public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address=>bool) public approvers;
    uint public approversCount;
    uint public numRequests;


    modifier restrictedToManager(){
        require(msg.sender == manager);
        _;
    }


    constructor(uint minimum, address creater ,string memory desc){
        manager = creater;
        minimumContribution = minimum;
        description = desc;
    }


    function contribute() public payable{
        require(msg.value>minimumContribution);
        // approvers.push(msg.sender);
        approvers[msg.sender]=true;
        approversCount++;
    }


    function createRequest(string memory desc, uint val, address rec) public restrictedToManager{
        Request storage newRequest = requests[numRequests++];

        newRequest.description = desc;
        newRequest.value=val;
        newRequest.recipient=rec;
        newRequest.complete=false;
        newRequest.approvalCount=0;
    }


    function approveRequest(uint index) public{
        // check if the user has contributed to campaign
        require(approvers[msg.sender]);

        // avoid duplicate votes
        require(!requests[index].approvals[msg.sender]);

        // approve request
        requests[index].approvals[msg.sender]=true;
        requests[index].approvalCount++;
        
    }


    function finalizeRequest(uint index) public restrictedToManager{
        Request storage request = requests[index];
        // check if request is already completed
        require(!request.complete);

        uint approvalRatio = (request.approvalCount/approversCount)*100;

        // check if more than 50% users have approved
        require(approvalRatio>=50);

        // send money to recipient
        payable(request.recipient).transfer(request.value);

        request.complete=true;
    }

    function getSummary() public view returns(uint,uint,uint,uint,address,string memory){
        return (
            minimumContribution,
            address(this).balance,
            numRequests,
            approversCount,
            manager,
            description
        );
    }

}
