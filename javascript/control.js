class Control {
  constructor() {
    this.model = new Model();
    this.view = new View();
    this.incomeArr = ["salary", "interests", "business", "extraIncome"]
    this.expenseArr = ["rent", "food", "bills", "utilities", "transportation", "insurance", "shopping", "entertainment", "healthCare", "housing", "education", "clothing", "taxes", "miscellaneous", "personalCare"];
    this.paymodeArr = ["cash", "debitCard", "creditCard", "UPI"];
    this.incomeOrExpense = ["income", "expense"];
    this.editingTrans;
    this.editingIndex;
    this.totalClickedCheckbox = 0;
    this.filterDrop = 0;
    this.userDetails;
    this.isDPchanged = false;
    this.isDPremoved = false;
    this.editImage;
    this.newImageURL = '';
    this.uName;
    this.pass = '';
    this.conPass = '';
    this.oldPin = '';
    this.type = "";

  }

  init = () => {
    if (navigator.onLine) {
      this.model.checkCookie();
      this.loadData();
      let clonedTemplate = _(".overAllDiv").content.cloneNode(true);
      _("main").append(clonedTemplate);
      window.addEventListener('blur', this.model.logoutWhileInactive);
      window.addEventListener('focus', this.model.checkCookie);
      window.addEventListener('focus', this.checkInterNetOnFocus);
    }
    else {
      let clonedTemplate = _(".noNetWorkDiv").content.cloneNode(true);
      _("body").prepend(clonedTemplate);
      _(".checkInternet").addEventListener("click", this.checkNetworkBTN)
    }

  }

  checkNetworkBTN = () => {
    _(".popUpwifiLoader").classList.add("displayFlex");
    setTimeout(() => {
      _(".popUpwifiLoader").classList.remove("displayFlex");
      if (navigator.onLine) {
        _(".networkPopup").remove();
        this.init();
      }
    }, 500)
  }

  checkInterNetOnFocus = () => {
    if (!navigator.onLine) {
      _(".mainContainer article") != null ? _(".mainContainer article").remove() : '';
      _(".logoutBtn").removeEventListener("click", this.model.logoutUser);
      _(".dashboardLink").removeEventListener('click', this.dashBoardData);
      _(".transcationLink").removeEventListener('click', this.loadTransactionData);

      if (_(".networkPopup") == null) {
        _(".showEditPopUP").removeEventListener("click", this.showEditPopup);
        _(".editContainer").removeEventListener("click", this.eventsForUserEdit);
        let clonedTemplate = _(".noNetWorkDiv").content.cloneNode(true);
        _("body").prepend(clonedTemplate);
        _(".checkInternet").addEventListener("click", this.againCheck);
      }
    }

  }

  againCheck = () => {
    _(".popUpwifiLoader").classList.add("displayFlex");
    setTimeout(() => {
      _(".popUpwifiLoader").classList.remove("displayFlex");
      if (navigator.onLine) {
        _(".networkPopup").remove();
        _(".showEditPopUP").addEventListener("click", this.showEditPopup);
        _(".editContainer").addEventListener("click", this.eventsForUserEdit);
        var current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace("active", "");

        if (this.type == "") {
          _(".dashboardLink").classList.add("active");
          this.dashBoardData();
        }
        else {
          _(".transcationLink").classList.add("active");
          this.loadTransactionData();
        }
      }
    }, 500)
  }

  loadData = () => {
    let uId = CryptoJS.AES.decrypt(localStorage.getItem("userID"), "Secret Passphrase").toString(CryptoJS.enc.Utf8);
    (this.model.getUserInfo(uId)).then(response => {
      this.userDetails = response;
      this.view.setUserInfo(response.user);
      this.model.getDahBoardData(this.userDetails.user.id)
      .then(res=>{
        if(res=="success"){
          this.dashBoardData();
        }
      });
      this.model.getTransactionData(this.userDetails.user.id)
    })
  }

  dashBoardData = (e) => {

    this.model.popState("DashBoard")
    this.view.showDefaultDashBoared(e);
    this.loadDashBoardData();
    this.setEventsForDashBoard();
  }

  loadDashBoardData = () => {

    this.displayTransactionDetails();
    this.displayLastFiveTransaction();
    this.displayExpenseChart();
    this.displayIncomeChart();

  }

  displayTransactionDetails = () => {
    this.view.transactionDetails(this.model.transactionDetails());
  }

  displayLastFiveTransaction = () => {
    this.view.lastFiveTransaction(this.model.lastFiveTransactions());
  }

  displayExpenseChart = () => {
    let isExpensehappened = this.model.lastMonthData.find(eachArr => eachArr.type.name === 'expense');

    if (isExpensehappened != undefined) {
      _(".expeseChart").style.background = "#fff";
      let obj = this.model.expenseByCategory('expense')
      this.view.expenseChart(obj,this.model.transactionDetails());
    }
    else {
      _(".expeseChart").style.background = `#fff url("images/no-data-found.gif") center no-repeat`
    }
  }
  

  displayIncomeChart = () => {
    let isIncomehappened = this.model.lastMonthData.find(eachArr => eachArr.type.name === 'income');

    if (isIncomehappened != undefined) {
      _(".incomeChart").style.background = "#fff";
      let obj = this.model.expenseByCategory('income')
      this.view.incomeChart(obj,this.model.transactionDetails());
    }
    else {
      _(".incomeChart").style.background = `#fff url("images/no-data-found.gif") center no-repeat`
    }
  }
  



  showBalanceInTrans = () => {
    this.view.balanceOfTrans(this.model.transactionDetails());
  }

  loadTransactionData = (e) => {
    this.type = "Transaction";
    this.model.popState("Transaction");
    this.view.showTranscationDetails(e);
    this.displayAllTransaction();
    this.setEventsForTransaction();
    this.setupAddDashBoardEvent();
    this.eventForFilterBox();
  }


  displayAllTransaction = () => {

    document.querySelector(".allTransactionDiv").innerHTML = '';

    let arr = this.model.allTransactions;

    _(".NoDataFoundErr") != null ? _(".NoDataFoundErr").remove() : '';

    if (arr.length == 0) {
      let clonedTemplate = _(".noTranaction").content.cloneNode(true);
      _(".innerChild").append(clonedTemplate);
    }
    else {
      document.querySelector('.search').addEventListener('input', this.displaySearch);
      this.view.allTransaction(arr);
      this.view.callPagination();

    }
  }

  setEventsForDashBoard = () => {
    _(".linksDiv").querySelectorAll(".a").forEach((aTag) => {
      aTag.addEventListener("click", this.view.changeButtonbackground);
    });
    _(".logoutBtn").addEventListener("click", this.model.logoutUser);
    _(".showInfo").addEventListener("click", this.view.showInfoFromLeft);
    _(".dialog").addEventListener("click", this.view.hideInfoFromLeft);
    _(".showEditPopUP").addEventListener("click", this.showEditPopup);

    document.querySelectorAll(".fa-eye").forEach((ecahEyeIcon) => {
      ecahEyeIcon.addEventListener("click", this.showPassword);
    });
    document.body.onresize = this.view.resizeEventforDashboard;
    _(".navbar-header .fa-sliders ").classList.remove("displayBlock");
    document.querySelector(".transcationLink").addEventListener('click', this.loadTransactionData);

  }

  setEventsForTransaction = () => {
    _(".addTransBtn").addEventListener("click", this.eventForNewTransaction);

    _(".navbar-header .fa-sliders ").addEventListener("click", this.view.showFilterFromRight);
    _(".filterBtn").addEventListener("click", this.view.showFilterFromRight);

    document.body.onresize = this.view.resizeEventforTransaction;
    _(".filterBox .DropDownHead").addEventListener("click", (e) => {
      e.stopPropagation()
      _(".filterBox .DropDownBody").classList.toggle("showDropDown");
      _(".filterBox .DropDownHead i").classList.toggle("rotateDownBtn");
      _(".filterBox .DropDownHead").classList.toggle("listBorder");
      _(".filterBox .DropDownBody").addEventListener("click", this.selectFilterDropDownValue);
    })
    this.getCheckIndex();
  }

  selectTransactions = (e) => {
    e.stopPropagation()
    _(".deleteBtn").disabled = false;
    _(".deleteBtn").classList.add("editBtnHide");
    _(".editBtn").disabled = false;
    _(".editBtn").classList.add("editBtnHide");

    let arr = ["TD", "SPAN"]
    let clicedEle = e.target;

    if(_(".fa-square-check")==null){
      this.totalClickedCheckbox = 0;
    }
    
    if (clicedEle.classList.contains("selectAllTrans")) {
      this.totalClickedCheckbox = 0;

      _(".allCheck").classList.remove("fa-square-check")

      if (clicedEle.classList.contains("fa-square-check")) {
        clicedEle.classList.remove("fa-square-check")
        document.querySelectorAll("tbody tr").forEach((eachRow) => {
          eachRow.classList.remove("backgroundAdd");
          eachRow.querySelector(".eachCheck").classList.remove("fa-square-check");
          this.totalClickedCheckbox = 0;
        })
      }
      else {
        clicedEle.classList.add("fa-square-check")
        document.querySelectorAll("tbody tr").forEach((eachRow) => {
          eachRow.classList.add("backgroundAdd");
          eachRow.querySelector(".eachCheck").classList.add("fa-square-check");
          this.totalClickedCheckbox += 1;
        })
      }
    }

    else if (clicedEle.classList.contains("allCheck")) {
      _(".selectAllTrans").classList.remove("fa-square-check");
      document.querySelectorAll(".TransactionBody .fa-square-check").forEach(eachCheck => {
        eachCheck.classList.remove("fa-square-check")
        eachCheck.parentNode.parentNode.classList.remove("backgroundAdd");
      })

      if (clicedEle.classList.contains("fa-square-check")) {
        clicedEle.classList.remove("fa-square-check")

        document.querySelectorAll(".listItem").forEach((eachList) => {
          eachList.classList.remove("backgroundAdd")
          eachList.querySelector("i").classList.remove("fa-square-check")
          this.totalClickedCheckbox -= 1;
        });
      }
      else {
        clicedEle.classList.add("fa-square-check")

        this.totalClickedCheckbox = 0;
        document.querySelectorAll(".listItem").forEach((eachList) => {
          eachList.classList.add("backgroundAdd");
          eachList.querySelector("i").classList.add("fa-square-check")
          this.totalClickedCheckbox += 1;
        });
      }
    }


    else if (clicedEle.tagName == "TD") {
      _(".allCheck").classList.remove("fa-square-check")
      let clickedCheckBox = e.target.parentNode.querySelector("i");
      if(clickedCheckBox.classList.contains("fa-square-check")) {
        clickedCheckBox.classList.remove("fa-square-check")
        e.target.parentNode.classList.remove("backgroundAdd");
        this.totalClickedCheckbox -= 1;
      }
      else {
        clickedCheckBox.classList.add("fa-square-check")
        e.target.parentNode.classList.add("backgroundAdd");
        this.totalClickedCheckbox += 1;
      }
    }

    else if (clicedEle.tagName == "I"||clicedEle.tagName == "B") {
      let clickedCheckBox = clicedEle.parentNode.parentNode.querySelector("i")
      _(".allCheck").classList.remove("fa-square-check")

      if (clickedCheckBox.classList.contains("fa-square-check")) {
        clickedCheckBox.classList.remove("fa-square-check")
        clickedCheckBox.parentNode.parentNode.classList.remove("backgroundAdd");
        this.totalClickedCheckbox -= 1;
      }
      else {
        clickedCheckBox.classList.add("fa-square-check")
        clickedCheckBox.parentNode.parentNode.classList.add("backgroundAdd");
        this.totalClickedCheckbox += 1;
      }
    }

    else if (clicedEle.tagName == "TR") {
      _(".allCheck").classList.remove("fa-square-check")
      let clickedCheckBox = e.target.querySelector("i");
      if (clickedCheckBox.classList.contains("fa-square-check")) {
        clickedCheckBox.classList.remove("fa-square-check")
        e.target.classList.remove("backgroundAdd");
        this.totalClickedCheckbox -= 1;
      }
      else {
        clickedCheckBox.classList.add("fa-square-check")
        e.target.classList.add("backgroundAdd");
        this.totalClickedCheckbox += 1;
      }
    }

    if (this.totalClickedCheckbox == 0) {
      _(".selectAllTrans").classList.remove("fa-square-check");
      _(".allCheck").classList.remove("fa-square-check");
      _(".editBtn").disabled = true;
      _(".editBtn").classList.remove("editBtnHide");
      _(".deleteBtn").disabled = true;
      _(".deleteBtn").classList.remove("editBtnHide");
    }
    if (this.totalClickedCheckbox == 1) {
      _(".editBtn").disabled = false;
      _(".editBtn").classList.add("editBtnHide");
      _(".editBtn").addEventListener("click", this.eventForEditBtn);
      _(".deleteBtn").addEventListener("click", this.eventForDeleteBtn);
    }
    if (this.totalClickedCheckbox > 1) {
      _(".editBtn").disabled = true;
      _(".editBtn").classList.remove("editBtnHide");
      _(".deleteBtn").addEventListener("click", this.eventForDeleteBtn);
    }

    _(".totalSelectedTrans").innerHTML = `${this.totalClickedCheckbox}/<b>${this.model.allTransactions.length}</b>`;


  }

  getCheckIndex = () => {
    if(_(".allTransDetails tbody")!=null){
      _(".allTransDetails tbody").addEventListener("mousedown", this.selectTransactions);
      _(".selectAllTrans").addEventListener("mousedown", this.selectTransactions);
      _(".allCheck").addEventListener("mousedown", this.selectTransactions);
    }
  }

  displaySearch = () => {
    this.totalClickedCheckbox = 0;
    document.querySelector('.allTransDetails').innerHTML = '';
    let inputText = document.querySelector('.search').value;
    this.sendInputVal(inputText);
  }

  sendInputVal = (inputText) => {
    let arr = this.model.seachTransaction(inputText);
    _(".NoDataFoundErr") != null ? _(".NoDataFoundErr").remove() : '';
    _(".pagination") != null ? _(".pagination").remove() : '';
    if (arr.length == 0) {
      _(".editDelterBtn") != null ? _(".editDelterBtn").remove() : '';
      let clonedTemplate = _(".noTranaction").content.cloneNode(true);
      clonedTemplate.querySelector(".empty-state__message").innerText = "No Records Found";
      _(".innerChild").append(clonedTemplate);
    }
    else {
      this.view.allTransaction(arr);
      this.getCheckIndex();
      this.view.callPagination();
    }
  }

  setupAddDashBoardEvent = () => {
    document.querySelector(".dashboardLink").addEventListener('click', this.dashBoardData);
  }

  eventForFilterBox = () => {
    _(".filterBox").addEventListener("click", () => {
      _(".filterBox .DropDownBody").classList.remove("showDropDown");
      _(".filterBox .DropDownHead i").classList.remove("rotateDownBtn");
      _(".filterBox .DropDownHead").classList.remove("listBorder");
    })
    _(".submitFilter").addEventListener("click", this.getFilterValue);
    _(".resetFilterForm").addEventListener("click", () => {
      _(".filterCatHead span").innerText = `Select Category`;
      this.filterDrop = 0;
      if (_(".fa-square-check") != null) {
        document.querySelectorAll(".fa-square-check").forEach((eachCheck) => {
          eachCheck.classList.remove("fa-square-check")
        })
      }
    })
  }

  eventForNewTransaction = () => {
    this.view.addNewTransaction();
    this.setEventForNewTransDiv();
    this.showDropDownNewTransaction();
    this.view.closeAddTransactionPopup();
    let listofincome = _("#incomeDropDown").content.cloneNode(true);
    _(".popUpContainer .dropDown").prepend(listofincome);
  }

  storeNewTransactionData = (e) => {
    let typeOfTrans;
    let date = '';
    let amount = '';
    let category = _(".popupBox .categoryHead span").classList[0];
    let payMode = _(".popupBox .payMode span").classList[0];
    let desc = '';
    let errorArr = [];

    if (_(".incomeRadio").checked) {
      let income = _(".incomeRadio").value
      if (this.incomeOrExpense.includes(income)) {
        typeOfTrans = income;
      }
    }
    else {
      let expense = _(".expenseRadio").value
      if (this.incomeOrExpense.includes(expense)) {
        typeOfTrans = expense;
      }
    }

    if (new Date(_(".transDate").value) < Date.now()) {
      date = new Date(_(".transDate").value).toLocaleDateString();
    }
    else {
      errorArr.push("Invalid Date")
    }

    if (_(".popupBox .amount").value > 0 && _(".popupBox .amount").value < 10000000) {
      amount = Number(_(".popupBox .amount").value)
    }
    else {
      errorArr.push("Invalid (0<Amount>10000000)")
    }

    if (typeOfTrans == "income") {
      if (!(this.incomeArr.includes(category))) {
        errorArr.push("Select Category");
        category = '';
      }
    }
    else {
      if (!(this.expenseArr.includes(category))) {
        errorArr.push("Select Category");
        category = '';
      }
    }

    if (!(this.paymodeArr.includes(payMode))) {
      errorArr.push("Select Pay Mode");
      payMode = "";
    }

    if (_(".popupBox .description").value == '') {
      errorArr.push("Fill the Description");
    }
    else {
      if((_(".popupBox .description").value).length>=50){
        errorArr.push("Description should be < 30");
      }
      else{
        desc = _(".popupBox .description").value;
      }
    }


    let obj = {
      "account": {
        "date": date,
        "type": {
          "name": typeOfTrans
        },
        "amount": amount,
        "category": {
          "name": category
        },
        "pay_type": {
          "name": payMode
        },
        "description": desc
      }
    }

    if (date != '' && amount != "" && desc != '' && payMode != '' && category != '') {
      if (e.target.classList.contains("addTransaction")) {
        this.model.sendNewTransData(obj, this.userDetails.user.id)
        .then(res => {
          if (res.status == "success") {

            this.model.getDahBoardData(this.userDetails.user.id)

            let key =Object.keys(res)[0];
            let id;
            if(key=="income" || key=="expense"){
              id=res[key].id
            }
            this.model.getaddedTrans(this.userDetails.user.id,id)
            .then(res=>{
              this.model.allTransactions.push(res[key]) 
              this.view.showSuccessMsg(typeOfTrans);
              this.displayAllTransaction();
              this.setEventsForTransaction();
              this.getDetails();
            })
          }
        });
      }

      else if (e.target.classList.contains("editTansaction")) {
        this.totalClickedCheckbox = 0;
        let id = this.model.allTransactions[this.editingIndex].id;
      
        this.model.updateTrans(this.userDetails.user.id, id, obj).then(res=>{
          if(res=="success"){
            this.model.getDahBoardData(this.userDetails.user.id)
            
            this.model.getEditedData(this.userDetails.user.id, id,this.editingIndex).then(res=>{
              if(res.status=="success"){
                this.getDetails();
                let key =Object.keys(res)[0];
                if(key=="income" || key=="expense"){
                  let editedRow = (_(`.TransactionBody.row${res[key].id}`));
                  editedRow.classList.remove("backgroundAdd");
                  editedRow.querySelector(".eachCheck").classList.remove("fa-square-check")
                  editedRow.querySelector(".catImg").innerHTML = `<b class="category-icon ${res[key].category.name}"></b> ${res[key].category.display_name}`;
                  editedRow.querySelector(".transactionDate").innerText=  new Date(res[key].date).toLocaleDateString();
                  editedRow.querySelector(".typeOfPay").innerText=  res[key].pay_type.display_name;
                  editedRow.querySelector(".transDesc").innerText=  res[key].description;
                  let amountDiv = editedRow.querySelector(".amountRightAllign");
                  amountDiv.innerText=  res[key].amount;
                  key === 'income' ? amountDiv.style.color = 'green' : amountDiv.style.color = 'red';
                  _(".totalSelectedTrans").innerHTML = `0/<b>${this.model.allTransactions.length}</b>`;
                }
              }  
            }) 
          }
        })

        let opc = 0;
        let time = setInterval(() => {
          _(`.row${this.editingTrans}`) !=null ? _(`.row${this.editingTrans}`).setAttribute("style", `background:rgba(254, 250, 221,${Math.abs(Math.sin(opc += .1))});`):'';
        }, 13);
        setTimeout(() => {
          clearInterval(time)
          _(`.row${this.editingTrans}`) !=null ? _(`.row${this.editingTrans}`).removeAttribute("style"):'';
        }, 1500)
      }
      _(".popUpContainer").remove();
    }
    else {
      _(".errMsgNewTrans").innerText = errorArr[0];
      _(".errMsgNewTrans").classList.add("showError");
      setTimeout(function () {
        _(".errMsgNewTrans") != null ? _(".errMsgNewTrans").classList.remove("showError") : '';
      }, 1500)
    }
  }

  getDetails = () => {
    this.showBalanceInTrans();
    if (_(".search").value != '') {
      this.displaySearch()
    }
  }

  eventForEditBtn = () => {
    this.view.addNewTransaction();
    this.editingTrans = Number((_(".TransactionBody .fa-square-check").id));
    let arr = this.model.allTransactions;
    this.editingIndex = arr.findIndex(object => object.id === this.editingTrans);
    let editTransVal = arr[this.editingIndex];
    _(".popUpContainer h1").innerHTML = `Edit Transaction<i class="fa-solid fa-xmark closeBtn"></i>`;
    _(".popUpContainer .button2").classList.remove("addTransaction");
    _(".popUpContainer .button2").classList.add("editTansaction");
    _(".popUpContainer .button2").innerText = "Save";
    if (editTransVal.type.name == "income") {
      this.setListForEdit("incomeDropDown", "incomeRadio")
    }
    else {
      this.setListForEdit("ExpenseDropDown", "expenseRadio")
      _(".popUpContainer .expenseRadio").checked = "true";
    }
    _(".popUpContainer .transDate").value = new Date(editTransVal.date).toISOString().substring(0,10);
   
    _(".popUpContainer .amount").value = editTransVal.amount;
    _(".popUpContainer .newCatHead span").classList.add(editTransVal.category.name);
    _(".popUpContainer .newCatHead span").innerText = editTransVal.category.display_name;
    _(".popUpContainer .paymodeOpt span").classList.add(editTransVal.pay_type.name);
    _(".popUpContainer .paymodeOpt span").innerText = editTransVal.pay_type.display_name;
    _(".popUpContainer .description").value = editTransVal.description;

    this.setEventForNewTransDiv();
    this.showDropDownNewTransaction();
    this.view.closeAddTransactionPopup();
  }

  setListForEdit = (typeOfEdit, ratio) => {
    let listofincome = _(`#${typeOfEdit}`).content.cloneNode(true);
    _(".popUpContainer .dropDown").prepend(listofincome);

    _(`.popUpContainer .${ratio}`).checked = "true";
  }
  setEventForNewTransDiv = () => {
    document.querySelectorAll(".popupBox input[type='radio']").forEach((input) => {
      input.addEventListener('change', this.view.popUPincomeORexpense);
    });
    _(".addTransaction") != null ? _(".addTransaction").addEventListener("click", this.storeNewTransactionData) : '';
    _(".editTansaction") != null ? _(".editTansaction").addEventListener("click", this.storeNewTransactionData) : '';
  }

  eventForDeleteBtn = () => {
    let clonedTemplate = _(".confirmDeletePopUP").content.cloneNode(true);
    _("main").append(clonedTemplate);
    _(".deletePopUP").addEventListener("mousedown", (e) => {
      if (e.target.classList.contains("yesBtn")) {
        this.deleteTranasction()
      }
      else if (e.target.classList.contains("closeBtn")) {
        _(".deletePopUP").remove()
      }
    })
  }

  deleteTranasction = () => {
    let obj = {"accounts": []}
    let UID;
    document.querySelectorAll(".TransactionBody .fa-square-check").forEach((eachCheckBox) => {
      let tid = Number(eachCheckBox.id);
      let lastMonthTransIndex = this.model.lastMonthData.findIndex(x => x.id === tid);
      this.model.lastMonthData.splice(lastMonthTransIndex, 1);

      let allTransIndex = this.model.allTransactions.findIndex(x => x.id === tid);
      UID = this.userDetails.user.id;
      eachCheckBox.parentNode.parentNode.remove();
      this.model.allTransactions.splice(allTransIndex, 1);
      obj.accounts.push(tid);
    });

    this.model.deleteTransaction(UID, obj).then(res=>{
      if(res=="success"){
        _(".deletePopUP").remove();
        this.totalClickedCheckbox = 0;

        this.showBalanceInTrans();
        if (this.model.allTransactions.length == 0) {
          _('.search').removeEventListener('input', this.displaySearch);
          document.querySelector(".allTransactionDiv").innerHTML = '';
          let clonedTemplate = _(".noTranaction").content.cloneNode(true);
          clonedTemplate.querySelector(".empty-state__message").innerText = "No Records Found";
          _(".innerChild").append(clonedTemplate);
        }
        else {
          if (_(".search").value != '') {
            this.displaySearch();
          }
        }
      }
    })
  }

  showEditPopup = () => {
    _(".editContainer").classList.add("fromLeftInfo");
    let uId = CryptoJS.AES.decrypt(localStorage.getItem("userID"), "Secret Passphrase").toString(CryptoJS.enc.Utf8);

    (this.model.getUserInfo(uId)).then(response => {
      this.userDetails = response;
      _(".editContainer").addEventListener("click", this.eventsForUserEdit);
    })
  }

  showPassword = (e) => {
    let classList = e.target.classList;
    classList.toggle("fa-eye-slash");
    if (classList.contains("fa-eye")) {
      (e.target.parentNode.previousElementSibling).type = "text";
      classList.remove("fa-eye");
    }
    else {
      showDropDownNewTransaction
        (e.target.parentNode.previousElementSibling).type = "password";
      classList.add("fa-eye");
    }
  }

  showDropDownNewTransaction = () => {
    _(".newCatHead").addEventListener("click", (e) => {
      e.stopPropagation();
      this.selectCategoryValue();
      this.view.categoryType();
    });
    _(".payMode").addEventListener("click", (e) => {
      e.stopPropagation();
      this.selectPayModeValue();
      this.view.payModeType();
    });

    _(".popupBox").addEventListener("click", () => {
      try {
        _(".paymodeList").classList.remove("showDropDown");
        _(".payMode i").classList.remove("rotateDownBtn");
        _(".payMode").classList.remove("listBorder");
        _(".newCatList").classList.remove("showDropDown");
        _(".newCatHead i").classList.remove("rotateDownBtn");
        _(".newCatHead").classList.remove("listBorder");
      } catch (error) { }
    })

  }


  selectCategoryValue = () => {
    _(".CategoryAndPaymode .categoryList").addEventListener("click", (e) => {
      e.stopPropagation();
      this.view.selectClickedValue(e, _(".CategoryAndPaymode .categoryList"));
    });
  }

  selectPayModeValue = () => {
    _(".CategoryAndPaymode .paymodeList").addEventListener("click", (e) => {
      e.stopPropagation();
      this.view.selectClickedValue(e, _(".CategoryAndPaymode .paymodeList"));
    });
  }


  selectFilterDropDownValue = (e) => {
    e.stopPropagation()
    let arr = ["B", "SPAN", "I"]
    let clickedEle = e.target.tagName;

    if (arr.includes(clickedEle)) {
      let clickedCheckBox = e.target.parentNode.querySelector("i")
      if (clickedCheckBox.classList.contains("fa-square-check")) {
        clickedCheckBox.classList.remove("fa-square-check")
        this.filterDrop -= 1;
      }
      else {
        clickedCheckBox.classList.add("fa-square-check")
        this.filterDrop += 1;
      }
    }
    else if (e.target.tagName == "H4") {
      let clickedCheckBox = e.target.querySelector("i");
      if (clickedCheckBox.classList.contains("fa-square-check")) {
        clickedCheckBox.classList.remove("fa-square-check")
        this.filterDrop -= 1;
      }
      else {
        clickedCheckBox.classList.add("fa-square-check")
        this.filterDrop += 1;
      }
    }
    if (this.filterDrop == 0) {
      _(".filterCatHead span").innerText = `Select Category`;

    }
    else {
      _(".filterCatHead span").innerText = `${this.filterDrop} selected`;
    }
  }


  eventsForUserEdit = (e) => {
    let ele = e.target.classList;
    if (ele.contains("showEditProfileopt")) {
      _(".listOfOptions").classList.toggle("showListOfOptions");
    }
    else if (ele.contains("cancelBtn")) {
      _(".inputInfos").reset();

      _(".UserID").value = this.userDetails.user.id;

      _(".listOfOptions").classList.remove("showListOfOptions");
      _(".editContainer").classList.remove("fromLeftInfo");
      this.userDetails.user.display_picture != '' ? _(".userInfo figure").style.backgroundImage = `url(${this.userDetails.user.display_picture})` : _(".userInfo figure").removeAttribute("style");
      this.isDPremoved = false;
    }
    else if (ele.contains("chengeDPli")) {
      this.updateNewImage(e);
    }
    else if (ele.contains("removeBtn")) {
      this.removeCurrentImage();
    }
    else if (ele.contains("saveBtn")) {
      this.saveChangesOfEdit(e)
    }
    else {
      _(".listOfOptions").classList.remove("showListOfOptions")
    }
  }

  saveChangesOfEdit = () => {
    this.userName = _(".UserNameInput");
    this.validateuserName(this.userName);
    this.validatePassword();
  }

  validateuserName = (nameInput) => {
    this.uName = undefined;
    if (nameInput.value == '' || nameInput.value.match(/^[A-Za-z]+[A-Za-z ]{4,}$/)) {
      nameInput.classList.remove("borderRed");
      this.uName = nameInput.value;
    }
    else {
      nameInput.classList.add("borderRed")
    }
  }

  validatePassword = () => {
    let oldPinEle = _(".oldPin");
    let newPin = _(".UserpassInput");
    let confirmNewPin = _(".reEnterPass");

    if (oldPinEle.value == '' || oldPinEle.value.match(/^[0-9]{6,6}$/g)) {
      this.oldPin = oldPinEle.value;
      oldPinEle.classList.remove("borderRed");
    }
    else {
      this.oldPin = 'err';
      oldPinEle.classList.add("borderRed");
    }

    if (newPin.value == '' || newPin.value.match(/^[0-9]{6,6}$/g)) {
      this.pass = newPin.value;
      newPin.classList.remove("borderRed");
    }
    else {
      this.pass = '';
      newPin.classList.add("borderRed");
    }

    if (confirmNewPin.value == '' || confirmNewPin.value.match(/^[0-9]{6,6}$/g)) {
      if (confirmNewPin.value == newPin.value) {
        confirmNewPin.classList.remove("borderRed");
        this.conPass = confirmNewPin.value;
      }
      else {
        this.conPass = 'err';
        confirmNewPin.classList.add("borderRed")
      }
    }
    else {
      this.conPass = 'err';
      confirmNewPin.classList.add("borderRed");
    }
    this.checkPassword();
  }


  checkPassword = () => {

    if (this.oldPin.length == 6 && this.conPass.length == 6) {
      if (this.oldPin != this.conPass) {
        (this.model.editPassWord({
          "user": {
            "old_password": this.oldPin,
            "new_password": this.conPass,
            "email_id": this.userDetails.user.email_id
          }
        })).then(data => {
          if (data.status == "error") {
            _(".Oldpass").classList.add("displayBlock");
            setTimeout(() => {
              _(".Oldpass").classList.remove("displayBlock");
            }, 1500)
          }
          else {
            if (this.uName != undefined) {
              _(".inputInfos").reset();
              _(".editContainer").classList.remove("fromLeftInfo");
              this.checkDPupdatedOrNot();
            }
          }
        })
      }
      else {
        _(".samePass").classList.add("displayBlock");
        setTimeout(() => {
          _(".samePass").classList.remove("displayBlock");
        }, 1500)
      }
    }
    else if (this.oldPin.length == 0 && this.conPass.length == 0) {
      if (this.uName != undefined) {
        _(".inputInfos").reset();
        _(".editContainer").classList.remove("fromLeftInfo");
        this.checkDPupdatedOrNot();
      }
    }
    else if (this.oldPin == 0) {
      _(".oldPin").classList.add("borderRed");
    }
  }

  updateNewImage = (e) => {
    this.isDPremoved = false;
    this.isDPchanged = false;

    _(".listOfOptions").classList.remove("showListOfOptions");
    this.newImageURL = '';
    _(".changeUserDP").addEventListener("change", (e) => {
      this.editImage = e.target.files[0];
      var reader = new FileReader();

      reader.onload = (e) => {
        _(".userInfo figure").style.backgroundImage = `url(${e.target.result})`;
        this.isDPchanged = true;
      }
      if (_(".changeUserDP").value.length) {
        reader.readAsDataURL(e.target.files[0]);
      }
    });
  }

  removeCurrentImage = () => {
    this.newImageURL = '';
    this.isDPremoved = false;
    this.isDPchanged = false;

    if (_(".userInfo figure") != null) {
      _(".userInfo figure").removeAttribute("style");
      this.isDPremoved = true;
    }
    _(".listOfOptions").classList.remove("showListOfOptions");
  }

  checkDPupdatedOrNot = () => {
    if (this.isDPchanged) {
      if (this.userDetails.user.display_picture != '') {
        firebase.storage().refFromURL(this.userDetails.user.display_picture).delete();
      }
      const ref = firebase.storage().ref("images/" + this.editImage.name);
      const task = firebase.storage().ref("images/" + this.editImage.name).put(this.editImage)
      task.then((snapshot) => {
        snapshot.ref.getDownloadURL().then((url) => {
          if (url != undefined) {
            this.newImageURL = url;
            _(".profileImg").style.backgroundImage = `url(${this.newImageURL})`;
            this.sendEditedDetails();
            this.isDPchanged = false;
          }
        })
      })
    }
    else {
      this.sendEditedDetails();
    }
  }


  sendEditedDetails = () => {
    _(".userName").innerHTML = this.uName;
    _(".UserID").value = this.userDetails.user.id;
    _(".userNameMail h3").innerText = this.uName;

    if (this.uName == '') {
      _(".userName").innerHTML = this.userDetails.user.name;
      _(".userNameMail h3").innerText = this.userDetails.user.name;
    }
    let editUser = { "user": {} }

    if (this.uName != '') {
      editUser.user["name"] = this.uName;
    }

    if (this.isDPremoved) {
      this.userDetails.user.display_picture != '' ? (_(".profileImg").removeAttribute("style")) : "";
      firebase.storage().refFromURL(this.userDetails.user.display_picture).delete();
      editUser.user["display_picture"] = '';
    }
    if (this.isDPchanged) {
      editUser.user["display_picture"] = this.newImageURL;
    }
    this.model.editUserInfo(this.userDetails.user.id, editUser);
    this.isDPremoved = false;
  }

  getFilterValue = () => {
    let startingDate = _(".startingDate").value
    let endingDate = _(".endingDate").value;
    let cashFolwArr = [];
    let payModeArr = [];
    let filterCategoryArr = [];
    let minValue = _(".minValue").value;
    let maxValue = _(".maxValue").value;
    let filterObj = {}
    let err = ''

    if (startingDate != '' && endingDate != '') {
      if (new Date(startingDate) > new Date(endingDate) || new Date(startingDate) > new Date() || new Date(endingDate) > new Date()) {
        startingDate = '';
        endingDate = '';
        _(".dateError").innerText = "Please provide a valid Date";
        this.view.showFilterError("dateError");
        err = "Invalid Date";
      }
      else {
        filterObj['startDate'] = startingDate;
        filterObj['endDate'] = endingDate
      }
    }
    else if (startingDate != '' && endingDate == '' || startingDate == '' && endingDate != '') {
      startingDate = '';
      endingDate = '';
      err = "Invalid Date";
      _(".dateError").innerText = "Date field should not be empty";
      this.view.showFilterError("dateError");
    }

    let cashFolwCheck = document.querySelectorAll('.cashFlowCheck');
    let cashFlowLength = cashFolwCheck.length;
    for (var i = 0; i < cashFlowLength; i++) {
      if (cashFolwCheck[i].checked) {
        let caskflowVal = cashFolwCheck[i].value;
        if (this.incomeOrExpense.includes(caskflowVal)) {
          cashFolwArr.push(caskflowVal);
        }
        else {
          err = "invalid Cash Flow"
        }
      }
    }
    if (cashFolwArr.length > 0) {
      filterObj['cashFlow'] = cashFolwArr;
    }

    let payModeCheck = document.querySelectorAll('.payModeCheck');
    let payCheckLength = payModeCheck.length;
    for (var i = 0; i < payCheckLength; i++) {
      if (payModeCheck[i].checked) {
        let paymodeValue = payModeCheck[i].value;
        if (this.paymodeArr.includes(paymodeValue)) {
          payModeArr.push(paymodeValue);
        }
        else {
          err = "invalid paymode"
        }
      }
    }

    if (payModeArr.length > 0) {
      filterObj['payMode'] = payModeArr;
    }

    let selectCat = document.querySelectorAll('.filterCheck');
    let selectLength = selectCat.length;
    for (var i = 0; i < selectLength; i++) {
      if (selectCat[i].classList.contains("fa-square-check")) {
        let selectedCategories = selectCat[i].id;
        if (this.expenseArr.includes(selectedCategories) || this.incomeArr.includes(selectedCategories)) {
          filterCategoryArr.push(selectedCategories);
        }
        else {
          err = "invalid category"
        }
      }
    }
    if (filterCategoryArr.length > 0) {
      filterObj['categories'] = filterCategoryArr;
    }

    if (minValue != '' && maxValue != '') {
      minValue = Number(minValue);
      maxValue = Number(maxValue);
      if ((minValue < 0 && maxValue < 0) || (minValue > maxValue)) {
        minValue = '';
        maxValue = '';
        err = "invalid amount"
        this.view.errorOfAmount("Please provide valid amount");
      }
      else {
        filterObj['minAmount'] = minValue;
        filterObj['maxAmount'] = maxValue;
      }
    }
    else if (minValue != '' && maxValue == '' || minValue == '' && maxValue != '') {
      minValue = '';
      maxValue = '';
      err = "invalid amount"
      this.view.errorOfAmount("Amount fieled shouldn't be empty");
    }

    if (err == '') {
      if (Object.keys(filterObj).length > 0) {
        console.log(filterObj)
      }
    }

    // if (startingDate != '' || endingDate != '' || cashFolwArr.length != 0 || payModeArr.length != 0 || filterCategoryArr.length != 0 || (minValue != '' && maxValue != '' )) {
    //   console.log(filterObj);
    // }
  }






}

window.onload = new Control().init();




// const obj = {
//   "startDate": "2022-12-28",
//   "endDate": "2023-01-09",
//   "cashFlow": [
//       "income",
//       "expense"
//   ],
//   "payMode": [
//       "cash",
//       "debitCard",
//       "creditCard",
//       "UPI"
//   ],
//   "categories": [
//       "business",
//       "rent",
//       "food",
//       "bills",
//       "utilities",
//       "transportation",
//       "insurance",
//       "shopping",
//       "entertainment",
//       "salary",
//       "healthCare",
//       "housing",
//       "extraIncome",
//       "education",
//       "clothing",
//       "taxes",
//       "interests",
//       "miscellaneous",
//       "personalCare"
//   ],
//   "minAmount": 1,
//   "maxAmount": 12
// }

// const encodedData = (JSON.stringify(obj))

// fetch(`https://www.example.com?users=${encodedData}`)
//   .then(res => res.text())
//   .then(res => console.log(res))
//   .catch(err => console.error(err))


// const permutator = (inputArr) => {
//   let result = [];

//   const permute = (arr, m = []) => {
//     if (arr.length === 0) {
//       result.push(m)
//     } else {
//       for (let i = 0; i < arr.length; i++) {
//         let curr = arr.slice();
//         let next = curr.splice(i, 1);
//         permute(curr.slice(), m.concat(next))
//      }
//    }
//  }

//  permute(inputArr)

//  return result;
// }


// console.log(permutator([1,1,2]));


// var permArr = [],
//   usedChars = [];

// function permute(input) {
//   var i, ch;
//   for (i = 0; i < input.length; i++) {
//     ch = input.splice(i, 1)[0];
//     usedChars.push(ch);
//     if (input.length == 0) {
//       permArr.push(usedChars.slice());
//     }
//     permute(input);

//     input.splice(i, 0, ch);
//     usedChars.pop();
//   }
//   return permArr
// };


// document.write(JSON.stringify(permute([5, 3, 7, 1])));

