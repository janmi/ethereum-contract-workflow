pragma solidity ^0.4.17;

/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
 // 防止数学运算溢出; 引入 SafeMath 机制来确保数学运算的安全，SafeMath 机制就是通过简单的检查确保常见的数学运算不出现预期之外的结果
library SafeMath {
    function mul(uint a, uint b) internal pure returns (uint) {
        uint c = a * b;
        assert(a == 0 || c / a == b);
        return c;
    }

    function div(uint a, uint b) internal pure returns (uint) {
        // assert(b > 0); // Solidity automatically throws when dividing by 0
        uint c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return c;
    }

    function sub(uint a, uint b) internal pure returns (uint) {
        assert(b <= a);
        return a - b;
    }

    function add(uint a, uint b) internal pure returns (uint) {
        uint c = a + b;
        assert(c >= a);
        return c;
    }
}


contract Project {
    using SafeMath for uint;

    struct Payment {
        string description;
        uint amount;
        address receiver;
        bool completed;
        // address[] voters;
        mapping( address => bool) voters;
        uint voterCount;
    }
    // 声明属性
    address public owner; // 项目所有者
    string public description; // 项目介绍
    uint public minInvest; // 最小投资金额
    uint public maxInvest; // 最大投资金额
    uint public goal; // 融资上限
    // address[] public investors; // 投资人列表
    uint public investorsCount; // 投资人计数
    mapping (address => uint) public investors;
    Payment[] public payments; // 资金支付列表

    // modifier 的工作机制，"_" 占位符提示编译器把原函数的代码插入到 "_"，从而变成新的函数。

    modifier ownerOnly () {
        require(msg.sender == owner);
        _;
    }

    // 合约构造函数，要求传入所有合约的基本属性
    constructor(string _description, uint _minInvest, uint _maxInvest, uint _goal) public {
        // msg 可以理解为全局对象
        owner = msg.sender;
        description = _description;
        minInvest = _minInvest;
        maxInvest = _maxInvest;
        goal = _goal;
    }
    // 参与项目投资的接口，投资人调用该接口时要求发送满足条件的资金，并且要求没有达到募资上线，这是所有合约接口中标记为 payable 的接口，即接受用户在交易中发送 ETH
    function contribute() public payable {
        require(msg.value >= minInvest);
        require(msg.value <= maxInvest);
        // require(address(this).balance <= goal);

        uint newBalance = 0;
        newBalance = address(this).balance.add(msg.value);
        require(newBalance <= goal);

        // investors.push(msg.sender);
        investors[msg.sender] = msg.value;
        investorsCount += 1;
    }
    // 发起资金支出请求，要求传入资金支出的细节信息
    function createPayment(string _description, uint _amount, address _receiver) ownerOnly public {
        // require(msg.sender == owner);

        Payment memory newPayment = Payment({
           description:_description,
           amount: _amount,
           receiver: _receiver,
           completed: false,
           // voters: new address[](0)
           voterCount: 0
        });
        
        payments.push(newPayment);
    }
    // 投票赞成某个资金支出请求，需要指定是哪条请求，要求投票的人是投资人，并且没有重复投票
    function approvePayment(uint index) public {
        Payment storage payment = payments[index];
        
        // must be investor to vote
        // bool isInvestor = false;
        // for (uint i = 0; i < investors.length; i++) {
        //     isInvestor = investors[i] == msg.sender;
        //     if(isInvestor) {
        //         break;
        //     }
        // }
        // require(isInvestor);
        
        require(investors[msg.sender] > 0);


        // can not vote twice
        // bool hasVoted = false;
        // for (uint j= 0; j < payment.voters.length; j++) {
        //     hasVoted = payment.voters[j] == msg.sender;
        //     if(hasVoted) {
        //         break;
        //     }
        // }
        // require(!hasVoted);
        // payment.voters.push(msg.sender);

        require(!payment.voters[msg.sender]);
        payment.voters[msg.sender] = true;
        payment.voterCount += 1;
    }
    // 完成资金支出，需要指定是哪笔支出，即调用该接口给资金接收方转账，不能重复转账，并且赞成票数超过投资人数量的 50%
    function doPayment (uint index) ownerOnly public {
        // require(msg.sender == owner);

        Payment storage payment = payments[index];
        require(!payment.completed);
        require(address(this).balance >= payment.amount);
        // require(payment.voters.length > (investors.length / 2));
        require(payment.voterCount > (investorsCount / 2));
        
        payment.receiver.transfer(payment.amount);
        payment.completed = true;
    }
}