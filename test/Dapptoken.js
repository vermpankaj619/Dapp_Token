var DappToken = artifacts.require('./DappToken.sol');

contract("DappToken", function(accounts) {

var tokenInstance;


it("initializes the contracy with the correct values", function () {
	return DappToken.deployed().then(function(instance){
		tokenInstance = instance;
		return tokenInstance.name();
	}).then(function(name){
		assert.equal(name, 'Dapp Token', "HAs the correct name");
		return tokenInstance.symbol();
	}).then(function(symbol){
		assert.equal(symbol, 'DAPP', "has the correct symbol");
		return tokenInstance.standard();
	}).then(function(standard){
		assert.equal(standard, "Dapp token v1.0", "has the correct standard")
	});
})

                  

   it("alloctaes the initial supply upon deployment" , function() {
   	return DappToken.deployed().then(function(instance){
   		tokenInstance = instance ;
   		return tokenInstance.totalSupply();
   	}).then(function(totalSupply){
   		assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 100000');
   		return tokenInstance.balanceOf(accounts[0]);
   	}).then(function(adminBalnace){
   		assert.equal(adminBalnace.toNumber(),1000000, "It allocates the initial supply to ths admin")
   	});
   });


it("transfer token ownership",function() {
  	   return DappToken.deployed().then(function(instance){
  		tokenInstance = instance;

  		return  tokenInstance.transfer.call(accounts[1], 99999999999999999999999999 )
  	}).then(assert.fail).catch(function(error){
  		assert(error.message.indexOf('revert') >= 0, "error message must conatin revert");
  	    return tokenInstance.transfer.call(accounts[1], 250000, {from: accounts[0]});
  	}).then(function(success){
  		assert.equal(success, true, "its retuen true")
  		return tokenInstance.transfer(accounts[1], 250000, {from: accounts[0]});
  
  }).then(function(recipt){
     assert.equal(recipt.logs.length, 1 ,"triggger one event");
     assert.equal(recipt.logs[0].event, 'Transfer', 'should be the Transfer event');
     assert.equal(recipt.logs[0].args._from, accounts[0], "logss the accounts the token are Transfered from");
     assert.equal(recipt.logs[0].args._to, accounts[1], "logss the accounts the token are Transfered to")
     assert.equal(recipt.logs[0].args._value, 250000, "logs transfer amonut");
  	   return tokenInstance.balanceOf(accounts[1]);
  }).then(function(balance){
  	assert.equal(balance.toNumber(), 250000,"add the amonut to the  reciving account");
  	    return tokenInstance.balanceOf(accounts[0]);
  }).then(function(balance){
  	assert.equal(balance.toNumber(), 750000, "deducts the account from the sebding account");
  })

});

  

it('approves tkoen for transfer',  function () {
	return DappToken.deployed().then(function(instance){
		tokenInstance = instance;
		return tokenInstance.approve.call(accounts[1], 100);
	}).then(function(success){
		assert.equal(success,  true, "it returns true");
		return tokenInstance.approve(accounts[1], 100);
	}).then(function(recipt){
    assert.equal(recipt.logs.length, 1 ,"triggger one event");
     assert.equal(recipt.logs[0].event, 'Approval', 'should be the "Approval" event');
     assert.equal(recipt.logs[0].args._owner, accounts[0], "logss the accounts the token are authorized by");
     assert.equal(recipt.logs[0].args._spender, accounts[1], "logss the accounts the token are authorized to")
     assert.equal(recipt.logs[0].args._value, 100, "logs transfer amonut");
     return tokenInstance.allowance(accounts[0], accounts[1]);
    }).then(function(allowance) {
      assert.equal(allowance.toNumber(), 100, 'stores the allowance for delegated trasnfer');
    });
  });










});
 