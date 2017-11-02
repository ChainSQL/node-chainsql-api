'use strict'

var callback2Promise = function(func,opt){
    var self = this;
    var f = func;
	return new Promise(function(resolve,reject){
		try{
			if(opt){
				func(opt,function(err,data){
					if(err) 
						reject(err);
					resolve(data);
				})
			}else{
				(function(err,data){
					if(err) 
						reject(err);
					resolve(data);
				})
			}

		}catch(e){
			reject(e);
		}
	});
}

module.exports = callback2Promise;