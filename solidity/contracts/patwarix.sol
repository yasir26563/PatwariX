pragma solidity ^0.4.17;

contract Property{

    //Propety Characteristics

        string public pType;
        string public pAddress;
        string public pCity;
        string public pSizeInSquareFeet;
        string public pLongitude;
        string public pLatitude;
        
        string public pName; //optional used for named Propeties i.e. buildings, malls
        
        // string pKhewatNumber;
        // string pKhatoniNumber;
        // string pKhasraNumber;
        // string pGroupNumber;
        // string pMinAndSalam;
        // string pMortgage;
        // string pMortgageAwaal;
        // string pMortgageDoaym;
        // string pMortgageSoyam;
        // string pTypeOfHolding;
        // string pPatti;
        // string pChakTashkish;
        // string pConversionFactor;
        // string pRevenueUnit;
        // string pPercentageCollectionOfLandRevenue;
        // string pProffesionalAreaofVillage;
        // string pAlamat;
        // string pTotalShares;
        // string pLagan;
        // string pMazrua;

    //adresses of owners and creatorAuthority

    address public authority;
    address public owner;

    //used for temporary signatures during the transfer process
    //acting as an escrow

    address public seller;
    address public buyer;
    address public verificationAuthority;

    //Data Trails of Accounts

    address[] public chainOfOwners; //owners stored in chronological order
    //address public previousContract;  //if a new contract deployed for the same propoerty also used to implement chunking of land

    //manual documentation/files

//............................................FUNCTIONS.............................................................//
    
    //constructor creating the specific Property
    
    function Property(string _ptype, string _pAddress, string _pCity, string _pSizeInSquareFeet, string _pLatitude, string _pLongitude) public{
        
        authority= msg.sender;
        
        pType= _ptype;
        pAddress= _pAddress;
        pCity= _pCity;
        pSizeInSquareFeet= _pSizeInSquareFeet;
        pLatitude= _pLatitude;
        pLongitude= _pLongitude;
        pName="";
        
    }
    
    //Function to transfer the property first time to a person or company i.e. Allotment where sole power is to authority
    
    function InitialAllotment(address firstOwner) public {
        require(msg.sender==authority);
        require(owner==0); 
        
        owner= firstOwner;
        updateChainOfOwner();
    }
    
    function updateChainOfOwner() private{  //helper function used to add the owner during transaction to the chainOfOwners
    
        chainOfOwners.push(owner);
    }
    
    function changePropertyType(string newType) public {        //used to change type of propoerty
        require(msg.sender==authority);
        
        if(owner!=0){       //makes sure if owned by someone his signature is necessary
            require(seller==owner);
        }
        
        pType=newType;
        resetEscrow();
    }
    
    function changePropertyName(string newName) public {        //used to change name of propoerty
        require(msg.sender==authority);
        
        if(owner!=0){       //makes sure if owned by someone his signature is necessary
            require(seller==owner);
        }
        
        pName=newName;
        resetEscrow();
    }
    
    function getChainOfOwners() public view returns (address[]){ //return the entire array of all the chainOfOwners
        return chainOfOwners;
    }
    
    function sellerSign () public{        //used to sign by the seller
        require(owner!=0);
        require(msg.sender==owner);
        
        seller=msg.sender; //seller signs his consent to sell
    }
    
    //TODO: can implement cancel in between escrow operation should be with penalty
    
    function buyerSign() public{        //used to sign by the buyer
        require(owner!=0);      //makes sure InitialAllotment done
        require(owner==seller);
        
        buyer= msg.sender;  //buyer signs his consent to buy
    }
    
    function verificationAuthoritySign(address sellerVerify, address buyerVerify)public{        //used to verify the signs and sign by the authority
        require(owner!=0);
        require(authority==msg.sender);
        
        require(seller!=0); //makes sure seller has signed
        require(buyer!=0); //makes sure buyer has signed
        
        //verifying that the signed public addresses match what they should be
        
        require(seller==sellerVerify);
        require(owner==sellerVerify);
        
        require(buyer==buyerVerify);

        //authority now signs the escrow if every condition is true
        verificationAuthority=msg.sender;
    }
    
    function pullTransaction()public{       //used to complete a transaction after escrow is settled
        require(owner!=0);
        require(authority==msg.sender);
        require(verificationAuthority==msg.sender);
        
        owner=buyer;
        updateChainOfOwner();
        resetEscrow();
    }
    
    function cancelTransactionByAuthority()public{
        require(authority==msg.sender);
        resetEscrow();
    }
    
    function cancelTransactionByOwner()public{
        require(owner==msg.sender);
        resetEscrow();
    }
    
    function resetEscrow() private{     //used to reset escrow to 0
        seller=0;
        buyer=0;
        verificationAuthority=0;
    }
    
    
}