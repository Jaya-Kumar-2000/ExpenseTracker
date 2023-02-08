let _ = function (ele) {
  return document.querySelector(ele);
}
class CreateObj {
  constructor(type, description, date, amount, category, payMode, id) {
    this.type = type;
    this.description = description;
    this.date = date;
    this.amount = amount;
    this.category = category;
    this.payMode = payMode;
  }

}

class Model {
  constructor() {
    this.allTransactions = [];
    this.income = 0;
    this.expense = 0;
    this.id = 0;
    this.lastMonthData=[];
  }

  getDahBoardData = (id) => {
    this.lastMonthData = [];

    let currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    let day = currentDate.getDate()
    let month = currentDate.getMonth() + 1
    let year = currentDate.getFullYear()

    let today = year+"/"+month+"/"+day;

    let newDate = new Date();
    newDate.setMonth(new Date().getMonth() - 1);
    let lastMoth = newDate.toLocaleDateString().split("/").reverse().join("/")
<<<<<<< HEAD
    return fetch(`http://localhost:8089/api/v1/users/${id}/accounts?start_date=${lastMoth}&end_date=${today}`)
=======
    return fetch(`http://172.24.205.76:8089/api/v1/users/${id}/accounts?start_date=${lastMoth}&end_date=${today}`)
>>>>>>> c867786f6b01db8865ae2aeb8155da65475f03ea
    .then(res => {
      if (res.status != 204) {
        return res.json();
      }
    })
    .then(res => {
        if(res!=undefined){
          this.lastMonthData = res.accounts;
        }
        return "success";
    })
  }

  getTransactionData = (id) => {
    return fetch(`http://localhost:8089/api/v1/users/${id}/accounts`)
      .then(res => {
        if (res.status != 204) {
          return res.json();
        }
      })
      .then(res => {
        if(res!=undefined){
          this.allTransactions = res.accounts;
        }
        return "success";
      })
  }

  seachTransaction = (inputText) => { //search based on description || Category
    let userInput = inputText.toLowerCase();


    let filteredArray = this.allTransactions.filter(function (ele) {
      console.log()
      return (ele.description.toLowerCase().includes(userInput) || ele.category.display_name.toLowerCase().includes(userInput))
    })
    return filteredArray;
  }


  lastFiveTransactions = () => {
    let temp = this.lastMonthData.slice();
    return temp.splice(-5);
  }

  expenseByCategory = (type) => {
    let obj = {}

    this.lastMonthData.forEach(function (data) {
      if (data.type.name == type) {

        const val = data.category.display_name;
        if (obj[val]) {
          obj[val] += data.amount;
        } else {
          obj[val] = data.amount;
        }
      }
    })

    let donutObj = {
      keys: Object.keys(obj),
      values: Object.values(obj)
    }
    return donutObj;
  }



  transactionDetails = () => {
    this.income = 0;
    this.expense = 0;
    this.balance = 0;

    this.lastMonthData.forEach((eachTrans) => {
      eachTrans.type.name == "income" ? this.income += eachTrans.amount : this.expense += eachTrans.amount;
    })

    return {
      income: this.income,
      expense: this.expense,
      balance: this.income - this.expense,
      totalTransaction: this.lastMonthData.length
    }
  }



  logoutWhileInactive = (e) => {
    localStorage.setItem("lastOUT", new Date());
  }

  checkCookie = (e) => {
    let isUserloggedIn = false;

    if (document.cookie.length != 0) {
      let myArray = document.cookie.split(";");
      let arr = myArray.map(x => {
        return x.split("=");
      });
      arr.forEach(function (eachCookie) {
        if (eachCookie[0] == "userLogin" && eachCookie[1] == "true") {
          isUserloggedIn = true;
        }
        else {
          isUserloggedIn = false;
        }
      });
      if (isUserloggedIn) {
        if (localStorage.getItem("userID") != null) {
          let lastout = new Date(localStorage.getItem('lastOUT'));
          var diff = (new Date().getTime() - lastout.getTime()) / 1000;
          diff /= (60 * 60);
          if (diff >= 8) {
            localStorage.setItem("isloggedOut", "Yes");
            this.logoutUser();
          }
        }
        else {
          this.logoutUser();
        }
      }
      else {
        this.logoutUser();
      }
    }
    else {
      this.logoutUser();
    }
  }

  logoutUser = () => {
    document.cookie = "userLogin" + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.replace("index.html");
    localStorage.removeItem("userID");
    localStorage.removeItem("lastOUT");
  }

  getUserInfo = (uID) => {
    return fetch(`http://localhost:8089/api/v1/users/${uID}`)
      .then(res => {
        return res.json();
      })
      .then(data => {
        if (data.status == "error") {
          this.logoutUser();
        }
        else {
          return (data)
        }
      })
  }

  editUserInfo = (uID, editData) => {
    fetch(`http://localhost:8089/api/v1/users/${uID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editData)
    })
  }

  editPassWord = (obj) => {
    return fetch(`http://localhost:8089/api/v1/users/reset/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    })
      .then(res =>res.json())
      .then(data =>data);
  }

  sendNewTransData = (obj, userId) => {
    return fetch(`http://localhost:8089/api/v1/users/${userId}/accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj)
    }).then(res => res.json())
      .then(data => data)
  }

  getaddedTrans = (userId,transID)=>{
<<<<<<< HEAD
    return fetch(`http://localhost:8089/api/v1/users/${userId}/accounts/${transID}`, {
=======
    return fetch(`http://172.24.205.76:8089/api/v1/users/${userId}/accounts/${transID}`, {
>>>>>>> c867786f6b01db8865ae2aeb8155da65475f03ea
      method: 'GET',
    }).then(res => res.json())
      .then(data => data)
  }

  deleteTransaction = (userId, delArr) => {

<<<<<<< HEAD
    return fetch(`http://localhost:8089/api/v1/users/${userId}/accounts`, {
=======
    return fetch(`http://172.24.205.76:8089/api/v1/users/${userId}/accounts`, {
>>>>>>> c867786f6b01db8865ae2aeb8155da65475f03ea
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(delArr)
    }).then(res => res.json())
      .then(data => data.status)
  }

  updateTrans = (userId, transID, obj) => {
<<<<<<< HEAD
    return fetch(`http://localhost:8089/api/v1/users/${userId}/accounts/${transID}`, {
=======
    return fetch(`http://172.24.205.76:8089/api/v1/users/${userId}/accounts/${transID}`, {
>>>>>>> c867786f6b01db8865ae2aeb8155da65475f03ea
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(obj)
    }).then(res => res.json())
    .then(data => data.status)
  }

  getEditedData = (userId, transID,index)=>{
<<<<<<< HEAD
    return fetch(`http://localhost:8089/api/v1/users/${userId}/accounts/${transID}`, {
=======
    return fetch(`http://172.24.205.76:8089/api/v1/users/${userId}/accounts/${transID}`, {
>>>>>>> c867786f6b01db8865ae2aeb8155da65475f03ea
      method: 'GET',
    }).then(res => res.json())
    .then(data => {
      if('expense' in data){
        this.allTransactions[index] = data.expense;
      }
      else{
        this.allTransactions[index] = data.income;
      }
      return data;  
    })
  }

  popState = (state) => {
    window.onpopstate = function () {
      window.history.pushState("", "", `main.html#${state}`);
    };
  }
}





