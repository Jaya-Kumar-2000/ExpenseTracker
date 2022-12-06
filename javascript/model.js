class CreateObj {
  constructor(type, description, date, amount, id, category, payMode) {
    this.type = type;
    this.description = description;
    this.date = new Date(date);
    this.amount = amount;
    this.tid = id;
    this.category = category;
    this.payMode = payMode;
  }
}
class Model {
  constructor() {
    this.transactions = [];
    this.income = 0;
    this.expense = 0;
    this.id = 0;
    this.lastMonthData;
    this.userID = CryptoJS.AES.decrypt(localStorage.getItem("userID"), "Secret Passphrase").toString(CryptoJS.enc.Utf8)
  }

  addTransaction = (type, description, date, amount, category, payMode) => {
    this.transactions.push(new CreateObj(type, description, date, amount, this.id++, category, payMode));
    return this.transactions;
  }


  getUserInfo = ()=>{
    return fetch(`http://127.0.0.1:8089/api/v1/users/${this.userID}`)
		.then(res => {
			return res.json();
		})
		.then(data => {
      return (data)
		})
  }


  seachTransaction = (inputText) => { //search based on description
    let filteredArray = this.transactions.filter(function (ele) {
      console.log(ele)
      return ele.description.includes(inputText)
    })
    return filteredArray;
  }

  lastFiveTransactions = () => {
    let temp = this.transactions.slice();
    return temp.splice(-5);
  }

  expenseByCategory = () => {
    let obj = {}
    
    this.lastMonthData.forEach(function (t) {
      if (t.type == 'Expense') {
        if (obj[t.category]) {
          obj[t.category] += t.amount;
        } else {
          obj[t.category] = t.amount;
        }
      }
    })
    let donutObj = {
      keys: Object.keys(obj),
      values: Object.values(obj)
    }
    return donutObj;
  }

  allTransactionDetails = () => {
    return this.transactions;
  }

  lastMonthTrans = ()=>{
    this.lastMonthData = this.transactions.slice().splice(-10);
  }

  transactionDetails = () => {
    this.income = 0;
    this.expense = 0;
    this.balance=0;
   
    this.lastMonthData.forEach((eachTrans)=>{   
      eachTrans.type=="Income"? this.income+= eachTrans.amount : this.expense+=eachTrans.amount;
    })

    return {
      income: this.income,
      expense: this.expense,
      balance: this.income - this.expense,
      totalTransaction: this.transactions.slice(0, 10).length
    }
  }
}





