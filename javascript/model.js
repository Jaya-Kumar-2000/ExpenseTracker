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
    this.lastMonthData;
  }

  getDahBoardData = (id) => {
    let arr = [];
    this.allTransactions = [];
    // let today = new Date();
    // console.log(today.toLocaleDateString())
    // let newDate = new Date();
    // newDate.setMonth(new Date().getMonth() - 1);
    // console.log(newDate.toLocaleDateString())

  }

  getTransactionData = (id) => {
    return fetch(`http://172.24.205.76:8089/api/v1/users/${id}/accounts`)
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
      return (ele.description.toLowerCase().includes(userInput) || ele.category.display_name.toLowerCase().includes(userInput))
    })
    return filteredArray;
  }


  lastFiveTransactions = () => {
    let temp = this.allTransactions.slice();
    return temp.splice(-5);
  }

  expenseByCategory = () => {
    let obj = {}

    this.lastMonthData.forEach(function (data) {
      if (data.type.name == 'expense') {

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


  lastMonthTrans = () => {
    this.lastMonthData = this.allTransactions.slice().splice(-10);
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
      totalTransaction: this.allTransactions.slice(0, 10).length
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
    return fetch(`http://172.24.205.76:8089/api/v1/users/${uID}`)
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
    fetch(`http://172.24.205.76:8089/api/v1/users/${uID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editData)
    })
  }

  editPassWord = (obj) => {
    return fetch(`http://172.24.205.76:8089/api/v1/users/reset/password`, {
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
    return fetch(`http://172.24.205.76:8089/api/v1/users/${userId}/accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(obj)
    }).then(res => res.json())
      .then(data => data)
  }

  deleteTransaction = (userId, transID) => {
    fetch(`http://172.24.205.76:8089/api/v1/users/${userId}/accounts/${transID}`, {
      method: 'DELETE',
    })
  }

  updateTrans = (userId, transID, obj) => {
    fetch(`http://172.24.205.76:8089/api/v1/users/${userId}/accounts/${transID}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify(obj)
    })
  }


  popState = (state) => {
    window.onpopstate = function () {
      window.history.pushState("", "", `main.html#${state}`);
    };
  }
}





