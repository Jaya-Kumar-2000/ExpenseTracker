class Control {
  constructor() {
    this.model = new Model();
    this.view = new View();
    this.categoryArr = ["Salary", "Interests", "Business", "Extra Income", "Rent", "Food", "Bills", "Utilities", "Transportation", "Insurance", "Shopping", "Entertinment", "", "Health", "Housing", "Education", "Clothing", "Taxes", "Miscellaneous", "Personal Care", "Other"];
    this.patmodeArr = ["Cash", "Debit Card", "Credit Card", "UPI"];
    this.incomeOrExpense = ["Income", "Expense"];
    this.editingIndex;
    this.totalClickedCheckbox = 0;
    this.userDetails;
    this.isDPchanged = false;
    this.isDPremoved = false;
    this.editImage;
    this.newImageURL = '';
    this.uName;
    this.pass;
    this.conPass;
  }

  init = () => {
    this.loadData();
    this.dashBoardData();
    // window.addEventListener('blur', this.model.logoutWhileInactive);   ///important to check again 
    // window.addEventListener('focus', this.model.checkCookie);
  }

  loadData = () => {
    (this.model.getUserInfo()).then(response => {
      this.view.setUserInfo(response.user);
    })
    this.model.addTransaction('Income', 'medicine for health ', '2022/04/4', 100, 'Health', "Debit Card");
    this.model.addTransaction('Income', 'shopping for pongal ', '2022/04/24', 1000, 'Shopping', "Debit Card");
    this.model.addTransaction('Expense', 'really from salary', '2022/03/28', 2000, 'Salary', "Debit Card");
    this.model.addTransaction('Income', 'salary from office', '2022/03/22', 7000, 'Salary', "Debit Card");
    this.model.addTransaction('Income', 'education for children', '2022/03/23', 2500, 'Education', "Debit Card");
    this.model.addTransaction('Income', 'education for children', '2022/03/24', 2500, 'Education', "Debit Card");
    this.model.addTransaction('Income', 'medicine for health ', '2022/04/4', 100, 'Health', "Debit Card");
    this.model.addTransaction('Expense', 'shopping for pongal ', '2022/04/24', 1000, 'Shopping', "Debit Card");
    this.model.addTransaction('Income', 'really from salary', '2022/03/28', 2000, 'Salary', "Debit Card");
    this.model.addTransaction('Income', 'salary from office', '2022/03/22', 7000, 'Salary', "Debit Card");
    this.model.addTransaction('Expense', 'education for children', '2022/03/23', 2500, 'Education', "Debit Card");
    this.model.addTransaction('Expense', 'education for children', '2022/03/24', 2500, 'Education', "Debit Card");
    this.model.addTransaction('Expense', 'medicine for health ', '2022/04/4', 100, 'Health', "Debit Card");
    this.model.addTransaction('Expense', 'education for children', '2022/03/24', 2500, 'Education', "Debit Card");
    this.model.addTransaction('Income', 'really from salary', '2022/03/28', 2000, 'Salary', "Debit Card");
    this.model.addTransaction('Income', 'salary from office', '2022/03/22', 7000, 'Salary', "Debit Card");
    this.model.addTransaction('Expense', 'education for children', '2022/03/23', 2500, 'Education', "Debit Card");
    this.model.addTransaction('Expense', 'education for children', '2022/03/24', 2500, 'Education', "Debit Card");
    this.model.addTransaction('Expense', 'medicine for health ', '2022/04/4', 100, 'Health', "Debit Card");
    this.model.addTransaction('Expense', 'education for children', '2022/03/24', 2500, 'Education', "Debit Card");

  }

  dashBoardData = (e) => {
    this.view.showDefaultDashBoared(e);
    this.loadDashBoardData();
    this.setEventsForDashBoard();
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

    if (isExpensehappened != undefined) {
      _(".secondDiv").style.backgroundColor = "#fff";
      _(".secondDiv h2").remove();
      this.view.chart(this.model.expenseByCategory().keys, this.model.expenseByCategory().values);
    }
    else {
      _(".secondDiv").style.background = `url("https://css.zohostatic.com/newwiki/v_410/images/blank-slate/zls-oops-blank-slate.png") center no-repeat`
    }
  }


  loadTransactionData = (e) => {
    this.view.showTranscationDetails(e);
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
    _(".NoDataFoundErr") != null ? _(".NoDataFoundErr").remove() : '';

    if (arr.length == 0) {
      let clonedTemplate = _(".noTranaction").content.cloneNode(true);
      _(".innerChild").append(clonedTemplate);
    }
    else {
      this.view.allTransaction(arr);
      this.view.callPagination();

    }
  }

  setEventsForDashBoard = () => {
    _(".linksDiv").querySelectorAll(".a").forEach((aTag) => {
      aTag.addEventListener("click", this.view.changeButtonbackground)
    });

    _(".logoutBtn").addEventListener("click", this.logoutBtn);
    _(".showInfo").addEventListener("click", this.showInfoFromLeft);
    _(".dialog").addEventListener("click", this.hideInfoFromLeft);
    _(".showEditPopUP").addEventListener("click", this.showEditPopup);

    document.querySelectorAll(".fa-eye").forEach((ecahEyeIcon) => {
      ecahEyeIcon.addEventListener("click", this.showPassword);
    });

    document.body.onresize = this.view.resizeEventforDashboard;

  }

  setEventsForTransaction = () => {
    _(".addTransBtn").addEventListener("click", this.eventForNewTransaction);

    _(".navbar-header .fa-sliders ").addEventListener("click", this.view.showFilterFromRight);
    _(".filterBtn").addEventListener("click", this.view.showFilterFromRight);

    document.body.onresize = this.view.resizeEventforTransaction;
    _(".filterBox .DropDownHead").addEventListener("click", (e) => {
      _(".filterBox .DropDownBody").classList.toggle("showDropDown");
      _(".filterBox .DropDownHead i").classList.toggle("rotateDownBtn");
      _(".filterBox .DropDownHead").classList.toggle("listBorder");
      _(".filterBox .DropDownBody").addEventListener("click", this.selectFilterDropDownValue);

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

    let arr = this.model.seachTransaction(inputText);

    _(".NoDataFoundErr") != null ? _(".NoDataFoundErr").remove() : '';

    if (arr.length == 0) {
      _(".editDelterBtn") != null ? _(".editDelterBtn").remove() : '';
      let clonedTemplate = _(".noTranaction").content.cloneNode(true);
      clonedTemplate.querySelector(".empty-state__message").innerText = "Hello";
      _(".innerChild").append(clonedTemplate);
    }
    else {
      this.view.allTransaction(arr);
      this.view.callPagination();
    }
  }


  setupAddDashBoardEvent = () => {
    document.querySelector(".dashboardLink").addEventListener('click', this.dashBoardData);
  }

  eventForFilterBox = () => {
    _(".submitFilter").addEventListener("click", this.model.getFilterValue);
  }



  showFilterError = (startingDate, endingDate) => {
    _(".filterError").classList.add("showFilterErr");
    setTimeout(function () {
      _(".filterError").classList.remove("showFilterErr");
    }, 2000)
  }


  eventForNewTransaction = () => {
    this.view.addNewTransaction();
    this.view.closeAddTransactionPopup();
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

    let amount = (_(".popupBox .amount").value > 0 && _(".popupBox .amount").value < 1000000) ? Number(_(".popupBox .amount").value) : '';
    let category = _(".popupBox .categoryHead span").innerText;
    let payMode = _(".popupBox .payMode span").innerText;
    let desc = _(".popupBox .description").value;


    if (date != '' && amount != "" && desc != '' && this.categoryArr.includes(category) && this.patmodeArr.includes(payMode)) {
      if (e.target.classList.contains("addTransaction")) {
        this.model.addTransaction(type, desc, date, amount, category, payMode);
      }
      else {
        this.totalClickedCheckbox = 0;
        let objToEdit = this.model.transactions[this.editingIndex];
        objToEdit.type = type;
        objToEdit.category = category;
        objToEdit.payMode = payMode;
        objToEdit.date = date;
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

    if (ele.classList.contains("selectAllTrans")) {
      if (ele.checked) {
        this.totalClickedCheckbox = 0;
        document.querySelectorAll(".checkBox").forEach((eachList) => {
          eachList.checked = true;
          if (eachList.classList.contains("eachCheck")) {
            eachList.parentNode.parentNode.classList.add("backgroundAdd");
            this.totalClickedCheckbox += 1;
          }
        });
      }
      else {
        document.querySelectorAll(".checkBox").forEach((eachList) => {
          eachList.checked = false;
          if (eachList.classList.contains("eachCheck")) {
            eachList.parentNode.parentNode.classList.remove("backgroundAdd");
            this.totalClickedCheckbox = 0;
          }
        });
      }
    }
    else if (ele.classList.contains("allCheck")) {
      if (ele.checked) {
        this.totalClickedCheckbox = 0;
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
    if (this.totalClickedCheckbox == 0) {
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
    if (this.totalClickedCheckbox > 1) {
      _(".editBtn").disabled = true;
      _(".editBtn").classList.remove("editBtnHide");
      _(".deleteBtn").addEventListener("click", this.eventForDeleteBtn);
    }

    _(".totalSelectedTrans").innerHTML = `${this.totalClickedCheckbox}/<b>${this.model.allTransactionDetails().length}</b>`;
  }


  eventForEditBtn = () => {
    document.querySelectorAll(".eachCheck").forEach((eachCheckBox) => {
      if (eachCheckBox.checked) {
        let tid = Number(eachCheckBox.getAttribute("index"));
        this.editingIndex = this.model.transactions.findIndex(object => {
          return object.tid === tid;
        });

        let editTransVal = this.model.transactions[this.editingIndex];

        let clonedTemplate = _(".addTransactionPopup").content.cloneNode(true);
        clonedTemplate.querySelector("h1").innerHTML = `Edit Transaction<i class="fa-solid fa-xmark closeBtn"></i>`;
        clonedTemplate.querySelector(".button2").classList.remove("addTransaction");
        clonedTemplate.querySelector(".button2").classList.add("editTansaction");
        clonedTemplate.querySelector(".button2").innerText = "Save";
        if (editTransVal.type == "Income") {
          clonedTemplate.querySelector(".incomeRadio").checked = "true";
        }
        else {
          clonedTemplate.querySelector(".expenseRadio").checked = "true";
        }

        var today = new Date(editTransVal.date);
        clonedTemplate.querySelector(".transDate").value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);;


        clonedTemplate.querySelector(".amount").value = editTransVal.amount;
        clonedTemplate.querySelector(".newCatHead span").innerText = editTransVal.category;
        clonedTemplate.querySelector(".paymentMethod").innerText = editTransVal.payMode;
        clonedTemplate.querySelector(".description").value = editTransVal.description;

        _("main").append(clonedTemplate);

        this.setEventForNewTransDiv();
        this.showDropDownNewTransaction();
        this.view.closeAddTransactionPopup();

        _(".addTransaction") != null ? _(".addTransaction").addEventListener("click", this.storeNewTransactionData) : '';
        _(".editTansaction") != null ? _(".editTansaction").addEventListener("click", this.storeNewTransactionData) : '';

      }
    })
  }

  setEventForNewTransDiv = () => {

    let listofincome = _("#incomeDropDown").content.cloneNode(true);
    _(".popUpContainer .dropDown").prepend(listofincome);

    document.querySelectorAll(".popupBox input[type='radio']").forEach((input) => {
      input.addEventListener('change', this.popUPincomeORexpense);
    });
  }


  eventForDeleteBtn = () => {
    document.querySelectorAll(".eachCheck").forEach((eachCheckBox) => {
      if (eachCheckBox.checked) {
        let tid = Number(eachCheckBox.getAttribute("index"));

        const index = this.model.transactions.findIndex(object => {
          return object.tid === tid;
        });

        this.totalClickedCheckbox = 0;

        this.model.transactions.splice(index, 1);
        this.displayAllTransaction();
        this.setEventsForTransaction();

        if (this.model.transactions.length == 0) {
          document.querySelector('.search').removeEventListener('input', this.displaySearch);
        }

      }
    });
  }

  logoutBtn = () => {
    window.location.replace("login.html");
    document.cookie = "userLogin" + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    localStorage.removeItem("userID");
  }

  showInfoFromLeft = () => {
    _(".info").classList.add("fromLeftInfo");
    _(".dialog").classList.add("dialogPopup");
  }

  hideInfoFromLeft = () => {
    _(".info").classList.remove("fromLeftInfo");
    _(".editContainer").classList.remove("fromLeftInfo");
    _(".listOfOptions").classList.remove("showListOfOptions");
    _(".dialog").classList.remove("dialogPopup")
    _(".filterBox").classList.remove("fromRightFilter");
  }

  showEditPopup = () => {
    _(".editContainer").classList.add("fromLeftInfo");
    (this.model.getUserInfo()).then(response => {
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
      (e.target.parentNode.previousElementSibling).type = "password";
      classList.add("fa-eye");
    }
  }

  showDropDownNewTransaction = () => {
    _(".newCatHead").addEventListener("click", () => {
      this.selectCategoryValue();
      this.view.categoryType();
    });

    _(".payMode").addEventListener("click", () => {
      this.selectPayModeValue();
      this.view.payMoodeType();
    });
  }


  selectCategoryValue = () => {
    _(".CategoryAndPaymode .categoryList").addEventListener("click", (e) => {
      this.selectClickedValue(e, _(".CategoryAndPaymode .categoryList"));
    });
  }

  selectPayModeValue = () => {
    _(".CategoryAndPaymode .paymodeList").addEventListener("click", (e) => {
      this.selectClickedValue(e, _(".CategoryAndPaymode .paymodeList"));
    });
  }



  selectClickedValue = (e, ele) => {
    let tagName = e.target.tagName;
    let val;
    if (tagName == "H4") {
      val = e.target.querySelector("span").innerText;
    }
    else {
      val = e.target.parentNode.querySelector("span").innerText;
    }
    ele.nextElementSibling.innerHTML = `<span>${val}</span> <i class="fa-solid fa-caret-down"></i>`
    ele.classList.remove("showDropDown");
    ele.nextElementSibling.classList.remove("listBorder")
  }


  selectFilterDropDownValue = (e) => {
    e.stopPropagation()
    let arr = ["B", "SPAN"]
    let clickedEle = e.target.tagName;

    if (arr.includes(clickedEle)) {
      let clickedCheckBox = e.target.parentNode.querySelector("input")
      if (clickedCheckBox.checked == true) {
        clickedCheckBox.checked = false;
      }
      else {
        clickedCheckBox.checked = true
      }
    }
    else if (e.target.tagName == "H4") {
      let clickedCheckBox = e.target.querySelector("input");
      if (clickedCheckBox.checked == true) {
        clickedCheckBox.checked = false;
      }
      else {
        clickedCheckBox.checked = true
      }
    }
  }

  popUPincomeORexpense = (e) => {
    let listofincome;
    _(".newCatHead").innerHTML = `<span>Select Category</span><i class="fa-solid fa-caret-down newCat"></i>`;

    _(".popUpContainer .DropDownBody").remove();
    _(".popUpContainer .categoryHead i").classList.remove("rotateDownBtn");
    _(".popUpContainer .categoryHead").classList.remove("listBorder");
    if (e.target.id == "expense") {
      listofincome = _("#ExpenseDropDown").content.cloneNode(true);
    }
    else {
      listofincome = _("#incomeDropDown").content.cloneNode(true);
    }
    _(".popUpContainer .dropDown").prepend(listofincome);
  }

  eventsForUserEdit = (e) => {
    let ele = e.target.classList;
    if (ele.contains("showEditProfileopt")) {
      _(".listOfOptions").classList.toggle("showListOfOptions");
    }
    else if (ele.contains("cancelBtn")) {
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
    this.password = _(".UserpassInput");
    this.confirmPassword = _(".reEnterPass");
    this.validateuserName(this.userName);
    this.validatePassWord(this.password);
    this.validateConfirmPassWord(this.confirmPassword, this.password);
    this.validateAllEditedIput();
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

  validatePassWord = (passwordElement) => {
    this.pass = undefined;
    if (passwordElement.value == '' || passwordElement.value.match(/^[0-9]{6,6}$/g)) {
      passwordElement.classList.remove("borderRed");
      this.pass = passwordElement.value;
    }
    else {
      passwordElement.classList.add("borderRed")
    }
  }

  validateConfirmPassWord = (confirmInput, passWordInput) => {
    this.conPass = undefined;
    if (confirmInput.value == '' || confirmInput.value.match(/^[0-9]{6,6}$/g)) {
      if (confirmInput.value == passWordInput.value) {
        confirmInput.classList.remove("borderRed");
        this.conPass = confirmInput.value;
      }
      else {
        confirmInput.classList.add("borderRed")
      }
    }
    else {
      confirmInput.classList.add("borderRed")
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
            this.sendEditedDEtails();
            this.isDPchanged = false;
          }
        })
      })
    }
    else {
      this.sendEditedDEtails();
    }
  }


  sendEditedDEtails = () => {
    _(".userName").innerHTML = this.uName;
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
    else {
      editUser.user["display_picture"] = this.newImageURL;
    }
    fetch(`http://127.0.0.1:8089/api/v1/users/${this.userDetails.user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editUser)
    })

    this.isDPremoved = false;

  }

  validateAllEditedIput = () => {
    if (this.uName != undefined && this.pass != undefined && this.conPass != undefined) {
      _(".inputInfos").reset();
      _(".editContainer").classList.remove("fromLeftInfo");
      this.checkDPupdatedOrNot();
    }
  }

}

new Control().init();

