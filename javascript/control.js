class Control {
  constructor() {
    this.model = new Model();
    this.view = new View();
    this.script = new indexModel();
    this.categoryArr = ["Salary", "Interests", "Business", "Extra Income", "Rent", "Food", "Bills", "Utilities", "Transportation", "Insurance", "Shopping", "Entertinment", "", "Health", "Housing", "Education", "Clothing", "Taxes", "Miscellaneous", "Personal Care", "Other"];
    this.patmodeArr = ["Cash", "Debit Card", "Credit Card", "UPI"];
    this.incomeOrExpense = ["Income", "Expense"];
    this.editingIndex;
    this.totalClickedCheckbox=0;
  }

  init = () => {
    this.loadData();
    this.dashBoardData();
    window.addEventListener('blur', this.script.logoutWhileInactive);
    window.addEventListener('focus', this.script.checkCookie);
  }

  loadData = () => {
    (this.model.getUserInfo()).then(response => {
      this.view.setUserInfo(response.user);
    })
    this.model.addTransaction('Income', 'medicine for health ', '2022/04/4', 100, 'Health', "Debit Card");
    this.model.addTransaction('Income', 'shopping for pongal ', '2022/04/24', 1000, 'Shopping', "Debit Card");
    this.model.addTransaction('Expense', 'really from salary', '2022/03/28', 2000, 'Salary', "Debit Card");
    this.model.addTransaction('Income', 'salary from office', '2022/03/22', 7000, 'Salary', "Debit Card");
    // this.model.addTransaction('Income', 'education for children', '2022/03/23', 2500, 'Education', "Debit Card");
    // this.model.addTransaction('Income', 'education for children', '2022/03/24', 2500, 'Education', "Debit Card");
    // this.model.addTransaction('Income', 'medicine for health ', '2022/04/4', 100, 'Health', "Debit Card");
    // this.model.addTransaction('Expense', 'shopping for pongal ', '2022/04/24', 1000, 'Shopping', "Debit Card");
    // this.model.addTransaction('Income', 'really from salary', '2022/03/28', 2000, 'Salary', "Debit Card");  
    // this.model.addTransaction('Income', 'salary from office', '2022/03/22', 7000, 'Salary', "Debit Card");
    // this.model.addTransaction('Expense', 'education for children', '2022/03/23', 2500, 'Education', "Debit Card");
    // this.model.addTransaction('Expense', 'education for children', '2022/03/24', 2500, 'Education', "Debit Card");
    // this.model.addTransaction('Expense', 'medicine for health ', '2022/04/4', 100, 'Health', "Debit Card");
    // this.model.addTransaction('Expense', 'education for children', '2022/03/24', 2500, 'Education', "Debit Card");
    // this.model.addTransaction('Income', 'really from salary', '2022/03/28', 2000, 'Salary', "Debit Card");  
    // this.model.addTransaction('Income', 'salary from office', '2022/03/22', 7000, 'Salary', "Debit Card");
    // this.model.addTransaction('Expense', 'education for children', '2022/03/23', 2500, 'Education', "Debit Card");
    // this.model.addTransaction('Expense', 'education for children', '2022/03/24', 2500, 'Education', "Debit Card");
    // this.model.addTransaction('Expense', 'medicine for health ', '2022/04/4', 100, 'Health', "Debit Card");
    // this.model.addTransaction('Expense', 'education for children', '2022/03/24', 2500, 'Education', "Debit Card");
  }

  dashBoardData = (e) => {
    this.script.showDefaultDashBoared(e);
    this.loadDashBoardData();
  }

  loadDashBoardData = () => {
    this.model.lastMonthTrans();
    this.displayTransactionDetails();
    this.displayLastFiveTransaction();
    this.displayChart();
    this.setupAddTranasactionEvent();
  }

  displayTransactionDetails = () => {
    this.view.transactionDetails(this.model.transactionDetails());
  }

  displayLastFiveTransaction = () => {
    this.view.lastFiveTransaction(this.model.lastFiveTransactions());
  }

  displayChart = () => {


  let isExpensehappened = this.model.lastMonthData.find(eachArr => eachArr.type === 'Expense');

    if(isExpensehappened!=undefined){
      _(".secondDiv").style.backgroundColor = "#fff";
      _(".secondDiv h2").remove();
      this.view.chart(this.model.expenseByCategory().keys, this.model.expenseByCategory().values);
    }
    else{
      _(".secondDiv").style.background =`url("https://css.zohostatic.com/newwiki/v_410/images/blank-slate/zls-oops-blank-slate.png") center no-repeat`
    }
  }


  loadTransactionData = (e) => {
    this.script.showTranscationDetails(e);
    this.displayAllTransaction();
    this.setEventsForTransaction();
    document.querySelector('.search').addEventListener('input', this.displaySearch);  
    this.setupAddDashBoardEvent();
    this.eventForFilterBox();
  }

  setupAddTranasactionEvent = () => {
    document.querySelector(".transcationLink").addEventListener('click', this.loadTransactionData);
  }


  displayAllTransaction = () => {
    document.querySelector(".allTransactionDiv").innerHTML = '';

    let arr = this.model.allTransactionDetails();
    _(".NoDataFoundErr")!=null ? _(".NoDataFoundErr").remove() : '';
     
    if(arr.length==0){
      let clonedTemplate = _(".noTranaction").content.cloneNode(true);
      _(".innerChild").append(clonedTemplate);
    }
    else{
      this.view.allTransaction(arr);
      this.script.callPagination();

    }  
  }

  setEventsForTransaction = () => {
    _(".addTransBtn").addEventListener("click", this.eventForNewTransaction);

    _(".navbar-header .fa-sliders ").addEventListener("click", this.script.showFilterFromRight);
    _(".filterBtn").addEventListener("click", this.showFilterFromRight);

    document.body.onresize = this.script.resizeEventforTransaction;
    _(".filterBox .DropDownHead").addEventListener("click", (e) => {
      _(".filterBox .DropDownBody").classList.toggle("showDropDown");
      _(".filterBox .DropDownHead i").classList.toggle("rotateDownBtn");
      _(".filterBox .DropDownHead").classList.toggle("listBorder");
      _(".filterBox .DropDownBody").addEventListener("click", this.script.selectFilterDropDownValue);

    })

    document.querySelectorAll(".checkBox").forEach((eachCheck) => {
      eachCheck.addEventListener("change", (e) => {
        this.getCheckboxStatus(e)
      })
    })
  }

  displaySearch = () => {
    
    document.querySelector('.allTransDetails tbody').innerHTML = '';
    let inputText = document.querySelector('.search').value;

    let arr =this.model.seachTransaction(inputText);
  
    _(".NoDataFoundErr")!=null ? _(".NoDataFoundErr").remove() : '';

    if(arr.length==0){
       _(".editDelterBtn")!=null ? _(".editDelterBtn").remove() : '';
      let clonedTemplate = _(".noTranaction").content.cloneNode(true);
      clonedTemplate.querySelector(".empty-state__message").innerText="Hello";
      _(".innerChild").append(clonedTemplate);
    }
    else{
      this.view.allTransaction(arr);
      this.script.callPagination();
    }  
  }


  setupAddDashBoardEvent = () => {
    document.querySelector(".dashboardLink").addEventListener('click', this.dashBoardData);
  }

  eventForFilterBox = () => {
    _(".submitFilter").addEventListener("click", this.getFilterValue);
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

  showFilterError = (startingDate, endingDate) => {
    _(".filterError").classList.add("showFilterErr");
    setTimeout(function () {
      _(".filterError").classList.remove("showFilterErr");
    }, 2000)
  }


  eventForNewTransaction = () => {
    this.script.addNewTransaction();
    this.closeAddTransactionPopup();
  }

  closeAddTransactionPopup = () => {
    document.querySelectorAll(".closeBtn").forEach((closeBtn) => {
      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (e.target.classList.contains("closeBtn")) {
          _(".popUpContainer").remove();
        }
      });
    });

    _(".addTransaction")!=null?_(".addTransaction").addEventListener("click", this.storeNewTransactionData):'';
    _(".editTansaction")!=null?_(".editTansaction").addEventListener("click", this.storeNewTransactionData):'';
  }

  storeNewTransactionData = (e) => {
    let type;
    if (_(".incomeRadio").checked) {
      let income = _(".incomeRadio").value
      if (this.incomeOrExpense.includes(income)) {
        type = income;
      }
    }
    else {
      let expense = _(".expenseRadio").value
      if (this.incomeOrExpense.includes(expense)) {
        type = expense;
      }
    }

    let date = new Date(_(".transDate").value) < Date.now() ? new Date(_(".transDate").value) : '';

    let amount = (_(".popupBox .amount").value > 0 && _(".popupBox .amount").value<1000000) ? Number(_(".popupBox .amount").value) : '';
    let category = _(".popupBox .categoryHead span").innerText;
    let payMode = _(".popupBox .payMode span").innerText;
    let desc = _(".popupBox .description").value;


    if (date != '' && amount != "" && desc != '' && this.categoryArr.includes(category) && this.patmodeArr.includes(payMode)) {
      if(e.target.classList.contains("addTransaction")){
        this.model.addTransaction(type, desc, date, amount, category, payMode);
      }
      else{
        this.totalClickedCheckbox=0;
        let objToEdit = this.model.transactions[this.editingIndex];
        objToEdit.type = type;
        objToEdit.category = category;
        objToEdit.payMode = payMode;
        objToEdit.date =  date;
        objToEdit.description = desc;
        objToEdit.amount = amount;
        
      }
      this.displayAllTransaction();
      this.setEventsForTransaction();
      _(".popUpContainer").remove();
    }
    else {
      _(".errMsgNewTrans").classList.add("showError");
      setTimeout(function () {
        _(".errMsgNewTrans").classList.remove("showError");
      }, 1500)
    }
  }

  getCheckboxStatus = (e) => {
    let ele = e.target;

    _(".deleteBtn").disabled = false;
    _(".deleteBtn").classList.add("editBtnHide");
    _(".editBtn").disabled = false;
    _(".editBtn").classList.add("editBtnHide");

    if(ele.classList.contains("selectAllTrans")){
      if (ele.checked) {
        this.totalClickedCheckbox = 0;
        document.querySelectorAll(".checkBox").forEach((eachList) => {
          eachList.checked=true;
          if(eachList.classList.contains("eachCheck")){
            eachList.parentNode.parentNode.classList.add("backgroundAdd");
            this.totalClickedCheckbox += 1;        
          }
        });
      }
      else{
        document.querySelectorAll(".checkBox").forEach((eachList) => {
          eachList.checked=false;
          if(eachList.classList.contains("eachCheck")){
            eachList.parentNode.parentNode.classList.remove("backgroundAdd");
            this.totalClickedCheckbox = 0;        
          }
        });
      }
    }
    else if (ele.classList.contains("allCheck")) {
      if (ele.checked) {
        this.totalClickedCheckbox = 0;
        console.log(document.querySelectorAll(".listItem"))
        document.querySelectorAll(".listItem").forEach((eachList) => {
          eachList.classList.add("backgroundAdd")
          eachList.querySelector(".checkBox").checked = true;
          this.totalClickedCheckbox += 1;        
        });
      }
      else {
        document.querySelectorAll(".listItem").forEach((eachList) => {
          eachList.classList.remove("backgroundAdd")
          eachList.querySelector(".checkBox").checked = false;
          this.totalClickedCheckbox -= 1;        
        });
      }
    }
    else {
      if (ele.checked) {
        this.totalClickedCheckbox += 1;
        ele.parentNode.parentNode.classList.add("backgroundAdd");
      }
      else {
        ele.parentNode.parentNode.classList.remove("backgroundAdd");
        _(".allCheck").checked = false;
        this.totalClickedCheckbox -= 1;
      }
    }
    if(this.totalClickedCheckbox == 0){
      _(".selectAllTrans").checked = false;
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
    if (this.totalClickedCheckbox >  1) {
      _(".editBtn").disabled = true;
      _(".editBtn").classList.remove("editBtnHide");
      _(".deleteBtn").addEventListener("click", this.eventForDeleteBtn);
    }

    _(".totalSelectedTrans").innerHTML = `${this.totalClickedCheckbox}/<b>${this.model.allTransactionDetails().length}</b>`;
  }


  eventForEditBtn = ()=>{
    document.querySelectorAll(".eachCheck").forEach((eachCheckBox) => {
      if (eachCheckBox.checked) {
        let tid = Number(eachCheckBox.getAttribute("index"));
        this.editingIndex = this.model.transactions.findIndex(object => {
          return object.tid === tid;
        });

        let editTransVal =  this.model.transactions[this.editingIndex];

        let clonedTemplate = _(".addTransactionPopup").content.cloneNode(true);
        clonedTemplate.querySelector("h1").innerHTML = `Edit Transaction<i class="fa-solid fa-xmark closeBtn"></i>`;
        clonedTemplate.querySelector(".button2").classList.remove("addTransaction");
        clonedTemplate.querySelector(".button2").classList.add("editTansaction");
        clonedTemplate.querySelector(".button2").innerText="Save";
        if(editTransVal.type=="Income"){
          clonedTemplate.querySelector(".incomeRadio").checked="true";
        }
        else{
          clonedTemplate.querySelector(".expenseRadio").checked="true";
        }

        var today = new Date(editTransVal.date);
        clonedTemplate.querySelector(".transDate").value=  today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);;

        
        clonedTemplate.querySelector(".amount").value = editTransVal.amount;
        clonedTemplate.querySelector(".newCatHead span").innerText=editTransVal.category;
        clonedTemplate.querySelector(".paymentMethod").innerText=editTransVal.payMode;
        clonedTemplate.querySelector(".description").value= editTransVal.description;

        _("main").append(clonedTemplate);

        this.script.setEventForNewTransDiv();
        this.closeAddTransactionPopup();

      }
    })  
  }

  eventForDeleteBtn = () => {
    document.querySelectorAll(".eachCheck").forEach((eachCheckBox) => {
      if (eachCheckBox.checked) {
        let tid = Number(eachCheckBox.getAttribute("index"));

        const index = this.model.transactions.findIndex(object => {
          return object.tid === tid;
        });

        this.totalClickedCheckbox=0;
        
        this.model.transactions.splice(index, 1);
        this.displayAllTransaction();
        this.setEventsForTransaction();

        if(this.model.transactions.length==0){
          document.querySelector('.search').removeEventListener('input', this.displaySearch);  
        }

      }
    });
  }
}

new Control().init();

