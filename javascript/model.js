let _ = function (ele) {
  return document.querySelector(ele);
}
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

  getFilterValue = () => {
    let startingDate = _(".startingDate").value
    let endingDate = _(".endingDate").value;
    let cashFolwArr = [];
    let payModeArr = [];
    let filterCategoryArr = [];
    let minValue = _(".minValue").value;
    let maxValue = _(".maxValue").value;
    let isDateCorrect = true;


    if (startingDate != '' && endingDate != '') {
      if (new Date(startingDate) > new Date(endingDate) || new Date(startingDate) > new Date()|| new Date(endingDate) > new Date()) {
        startingDate = '';
        endingDate = '';
        isDateCorrect = false;
        _(".filterError").innerText = "Please provide a valide Date";
        this.showFilterError();
      }
    }
    else if (startingDate != '' && endingDate == '' || startingDate == '' && endingDate != '') {
      startingDate = '';
      endingDate = '';
      isDateCorrect = false;
      _(".filterError").innerText = "Date field sholud not be empty";
      this.showFilterError(startingDate, endingDate);
    }

    let cashFolwCheck = document.querySelectorAll('.cashFlowCheck');
    for (var i = 0; i < cashFolwCheck.length; i++) {
      if (cashFolwCheck[i].checked) {
        let caskflowVal = cashFolwCheck[i].value;
        if (this.incomeOrExpense.includes(caskflowVal)) {
          cashFolwArr.push(caskflowVal);
        }
      }
    }

    let payModeCheck = document.querySelectorAll('.payModeCheck');
    for (var i = 0; i < payModeCheck.length; i++) {
      if (payModeCheck[i].checked) {
        let paymodeValue = payModeCheck[i].value;
        if (this.patmodeArr.includes(paymodeValue)) {
          payModeArr.push(paymodeValue);
        }
      }
    }

    let selesctCat = document.querySelectorAll('.filterCheck');
    for (var i = 0; i < selesctCat.length; i++) {
      if (selesctCat[i].checked) {
        let selectedCategories = selesctCat[i].value;
        if (this.categoryArr.includes(selectedCategories)) {
          filterCategoryArr.push(selectedCategories);
        }
      }
    }

    if (isDateCorrect) {
      if (startingDate!=''||endingDate!=''||cashFolwArr.length != 0 || payModeArr.length != 0 || filterCategoryArr.length != 0 || minValue != '' || maxValue != '') {
          console.log("some Value");
      }
    }
  }

     

    // logoutWhileInactive = () => {
    //     localStorage.setItem("lastOUT", new Date());
    // }

   
   

}





