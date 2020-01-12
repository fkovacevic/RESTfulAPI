var users = require('../models/dummyUsers');


 module.exports = {
    getCurrentUsersId: function () {
        var max = users[0].id;
        
        users.forEach(element => {
        max = element.id>=max ? element.id : max;
    });
    return max+1;
    }
  };
  

