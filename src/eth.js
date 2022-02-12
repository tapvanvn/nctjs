var __pure__waiting__fn = window.__pure__waiting__fn ||[]
__pure__waiting__fn.push ( function (){

	var EthereumUtil = Class.extend ( "EthereumUtil",{

		init : function (  ){

			this.hearthInterfalID = -1
			this.accounts = []
			this.state = "init"
		},
		check : function() {

			var self = this

			if (window.ethereum) {
				
				this.state = "ready"

				//TODO: gather infomation about ethereum portal.

				if (self.hearthInterfalID > 0) {

					clearInterval(self.hearthInterfalID);
				}
			}
		},
		isReady: function() {

			return this.state == "ready"
		},
		requestAccounts: function (callback) { //callback(success bool, accounts)

			if (!this.isReady()) {
				//TODO: wait and serve machanism
				if(typeof callback == 'function') {

					callback(false, this.accounts)
				}
			}
			var self = this
			window.ethereum.request({ method: 'eth_requestAccounts' }).then(accounts => {

				self.accounts = accounts

				if(typeof callback == 'function') {

					callback(true, accounts)
				}
			})
		},
		GetSignature: function (params, account , callback) { //callback success signature
			if (!this.isReady()) {

				if(typeof callback == 'function') {

					callback(false, "")
				}
			}
			var self = this
			
			try {
				ethereum.request({
					
					method: 'eth_signTypedData',
					params: [ params ,  account],

				}).then((result)=>{
		
					callback(true, result)
				})
		
			} catch (error) {
		
				console.error(error);
			}
		}
	})

	window.eth = new EthereumUtil()

	var evt_handle = new EventHandle({Context:this, fn: function(evt){

        window.eth.hearthInterfalID = setInterval(window.eth.check, 1000)
    }});
  
    if(typeof (window.nct) !== 'undefined'){

        evt_handle.fn();
    } else {
        window.__pure__.onTrigger("nct.init", evt_handle);
    }
})