class View {
  constructor() {
    this.listItems;
    this.currentPage = 1;
    this.pageCount = 0;
  }

  transactionDetails = (details) => {
    document.querySelector('.income span').innerText = `₹ ${parseFloat(details.income.toFixed(2))}`;
    document.querySelector('.expenses span').innerText = `₹ ${parseFloat(details.expense.toFixed(2))}`;
    document.querySelector('.balance span').innerText = `₹ ${parseFloat(details.balance.toFixed(2))}`;
    document.querySelector('.transcation span').innerText = details.totalTransaction;
    document.querySelector('.amount').innerText = `₹ ${parseFloat(details.balance.toFixed(2))}`;
  }

  balanceOfTrans = (details)=>{
    document.querySelector('.amount').innerText = `₹ ${parseFloat(details.balance.toFixed(2))}`;
  }
  lastFiveTransaction = (arr) => {
    if (arr.length != 0) {

      let recentTransHead = `<tr class="TransactionHead">
      <th>Date</th>
      <th>Category</th>
      <th>Payment Mode</th>
      <th>Description</th>
      <th class="amountRightAllign">Amount</th>
    </tr>`;

      document.querySelector('.lastFiveTransaction tbody').innerHTML = recentTransHead;

      let docFrag = new DocumentFragment();
      arr.forEach(element => {

        let divEle = document.createElement('tr');
        divEle.setAttribute('class', 'TransactionBody');

        let date = document.createElement('td');
        date.textContent = element.date.toLocaleDateString();

        let category = document.createElement('td');
        category.textContent = element.category;


        let payMode = document.createElement('td');
        payMode.textContent = element.payMode;

        let description = document.createElement('td');
        description.textContent = element.description;

        let amount = document.createElement('td');
        amount.setAttribute("class", "amountRightAllign");
        amount.textContent = `₹ ${element.amount}`;
        element.type === 'Income' ? amount.style.color = 'green' : amount.style.color = 'red';

        divEle.appendChild(date);
        divEle.appendChild(category);
        divEle.appendChild(payMode);
        divEle.appendChild(description);
        divEle.appendChild(amount);

        docFrag.prepend(divEle);

      });

      document.querySelector(".lastFiveTransaction  tbody").appendChild(docFrag);
    }
    else {
      _(".thirdDiv").innerHTML += `<h3 class="noRecentTrans">No Recent Transactions Found</h3>`;
    }

  }

  allTransaction = (arr) => {
    let allTranactionDetails = `<div class="editDelterBtn">

    <div class="selectAllTransDiv">
      <input type="checkbox" id="selectAllTrans" class="checkBox selectAllTrans" name="selectAllTrans" value="selectAll" />
      <p class="totalSelectedTrans"></p>
    </div>  
    <div>
      <button class="editBtn" disabled><i class="fa-solid fa-pencil"></i><span>Edit</span></button>
      <button class="deleteBtn" disabled><i class="fa-regular fa-trash-can"></i><span>Delete</span></button>
    </div>  
  </div>
  <table class="allTransDetails" id="paginated-list" data-current-page="1" aria-live="polite">
    <tbody>

      <tr class="TransactionHead">
        <th class="checkStyle"><input type="checkbox" id="checkBox" class="checkBox allCheck" name="selectTransaction" value="selectAll" /></th>
        <th>Category</th>
        <th>Date</th>
        <th>Payment Mode</th>
        <th>Description</th>
        <th class="amountRightAllign">Amount</th>
      </tr>
    </tbody>
  </table>
`;

    document.querySelector('.allTransactionDiv').innerHTML = allTranactionDetails;

    let docFrag = new DocumentFragment();
    arr.forEach((element,index) => {
      let divEle = document.createElement('tr');
      divEle.setAttribute('class', `TransactionBody row${index}`);

      let checkBoxTableRow = document.createElement('td');
      checkBoxTableRow.setAttribute("class", "checkStyle")

      let checkBox = document.createElement("input");
      checkBox.setAttribute("type", "checkbox");
      checkBox.setAttribute("name", "selectTransaction");
      checkBox.setAttribute("id", "selectAll");
      checkBox.setAttribute("class", `checkBox eachCheck`);
      checkBox.setAttribute("index", index)
      checkBoxTableRow.appendChild(checkBox)

      let category = document.createElement('td');
      category.textContent = element.category;

      let date = document.createElement('td');
      date.textContent = element.date.toLocaleDateString();

      let payMode = document.createElement('td');
      payMode.textContent = element.payMode;


      let description = document.createElement('td');
      description.textContent = element.description;

      let amount = document.createElement('td');
      amount.setAttribute("class", "amountRightAllign");
      amount.textContent = `₹ ${element.amount}`;
      element.type === 'Income' ? amount.style.color = 'green' : amount.style.color = 'red';

      divEle.appendChild(checkBoxTableRow);
      divEle.appendChild(category);
      divEle.appendChild(date);
      divEle.appendChild(payMode);
      divEle.appendChild(description);
      divEle.appendChild(amount);
      docFrag.prepend(divEle);

    });
    document.querySelector('.allTransDetails tbody').appendChild(docFrag);


    document.querySelector('.allTransactionDiv').innerHTML += ` <div class="pagination">
      <button class="pagination-button" id="prev-button" aria-label="Previous page" title="Previous page">
      <i class="fa-solid fa-backward"></i>
    </button>
    <nav class="pagination-container">
      <div id="pagination-numbers"> 
      </div>          
    </nav>
    
    <button class="pagination-button" id="next-button" aria-label="Next page" title="Next page">
    <i class="fa-solid fa-forward"></i>
    </button></div>`;

    _(".totalSelectedTrans").innerHTML = `0/<b>${arr.length}</b>`
  }

  chart = (label, datas) => {

    const data = {
      labels: label,
      datasets: [{
        label: 'EXPENSE TRACKER',
        backgroundColor: ['#F64069', '#F9C235', '#3BA2EB', '#FACD57', '4BC0C0', '#11d8a3'],
        data: datas,
      }]
    };

    const config = {
      type: 'doughnut',
      data: data
    };

    const myChart = new Chart(
      document.getElementById('myChart'),
      config
    );
  }


  setUserInfo = (data) => {

    _(".userName").innerText = data.name;
    _(".userIDnumber").innerText = `ID: ${data.id}`;
    data.display_picture != '' ? _(".profileImg").style.backgroundImage = `url(${data.display_picture})` : '';

    //editWindow Info 
    data.display_picture != '' ? _(".userInfo figure").style.backgroundImage = `url(${data.display_picture})` : '';
    _(".UserID").value = data.id;
    _(".userNameMail h3").innerText = data.name;
    _(".userNameMail h6").innerText = data.email_id;
  }


  showDefaultDashBoared = (e) => {
    if (e != undefined) {
      e.preventDefault();
    }
    _(".dashBoard") != null ? _(".dashBoard").remove() : '';
    _(".transactionArticle") != null ? _(".transactionArticle").remove() : '';
    window.history.pushState("", "", `index.html`);
    window.history.pushState("", "", `${window.location.href}#DashBoard`);

    let clonedTemplate = _(".dashBoardSection").content.cloneNode(true);
    _(".mainContainer").append(clonedTemplate);

  }

  showTranscationDetails = (e) => {
    e.preventDefault();

    _(".dashBoard") != null ? _(".dashBoard").remove() : '';
    _(".transactionArticle") != null ? _(".transactionArticle").remove() : '';

    window.history.pushState("", "", `index.html`);
    window.history.pushState("", "", `${window.location.href}#Transaction`);

    let clonedTemplate = _(".tranactionDiv").content.cloneNode(true);
    _(".mainContainer").append(clonedTemplate);

    if (document.documentElement.clientWidth <= 500) {
      _(".newTransaction").innerText = "+";
    }
    if (window.matchMedia("(max-width: 786px)")) {
      _(".navbar-header .fa-sliders").classList.add("displayBlock");
    }

  }

  resizeEventforDashboard = () => {
    _(".info").classList.remove("fromLeftInfo")
    _(".dialog").classList.remove("dialogPopup")

    _(".editContainer").classList.remove("fromLeftInfo");
    _(".listOfOptions").classList.remove("showListOfOptions");
  }

  resizeEventforTransaction = () => {
    _(".info").classList.remove("fromLeftInfo")
    _(".dialog").classList.remove("dialogPopup")

    _(".editContainer").classList.remove("fromLeftInfo");
    _(".listOfOptions").classList.remove("showListOfOptions");

    _(".filterBox").classList.remove("fromRightFilter");
    _(".filterBox .categoryList").classList.remove("showDropDown");
    _(".filterBox .categoryHead i").classList.remove("rotateDownBtn");
    _(".filterBox .categoryHead").classList.remove("listBorder")

    var w = document.documentElement.clientWidth;
    if (w <= 500) {
      _(".newTransaction").innerText = "+";
    }
    else {
      _(".newTransaction").innerText = "ADD TRANSACTION";
    }
  }

  changeButtonbackground = (e) => {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace("active", "");
    e.target.classList.add("active");
    _(".info").classList.remove("fromLeftInfo");
    _(".dialog").classList.remove("dialogPopup");
  }

  addNewTransaction = () => {
    let clonedTemplate = _(".addTransactionPopup").content.cloneNode(true);
    _("main").append(clonedTemplate);
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
  }

  categoryType = () => {
    _(".newCatHead").previousElementSibling.classList.toggle("showDropDown");
    _(".newCatHead i").classList.toggle("rotateDownBtn");
    _(".newCatHead").classList.toggle("listBorder")
    if (_(".payMode").classList.contains("listBorder")) {
      _(".payMode").previousElementSibling.classList.remove("showDropDown");
      _(".payMode i").classList.remove("rotateDownBtn");
      _(".payMode").classList.remove("listBorder");
    }
  }

  payMoodeType = () => {
    _(".paymodeList").classList.toggle("showDropDown");
    _(".payMode i").classList.toggle("rotateDownBtn");
    _(".payMode").classList.toggle("listBorder");
    if (_(".newCatHead").classList.contains("listBorder")) {
      _(".newCatList").classList.remove("showDropDown");
      _(".newCatHead i").classList.remove("rotateDownBtn");
      _(".newCatHead").classList.remove("listBorder");
    }
  }

  showFilterFromRight = () => {
    _(".filterBox").classList.add("fromRightFilter");
    _(".dialog").classList.add("dialogPopup")
  }

  callPagination = () => {
    this.listItems = document.querySelectorAll("#paginated-list .TransactionBody");
    this.pageCount = Math.ceil(this.listItems.length / 16);

    for (let i = 1; i <= this.pageCount; i++) {
      this.appendPageNumber(i);
    }

    this.setCurrentPage(1);

    _("#prev-button").addEventListener("click", () => {
      this.setCurrentPage(this.currentPage - 1);
    });

    _("#next-button").addEventListener("click", () => {
      this.setCurrentPage(this.currentPage + 1);
    });

    document.querySelectorAll(".pagination-number").forEach((button) => {
      const pageIndex = Number(button.getAttribute("page-index"));
      if (pageIndex) {
        button.addEventListener("click", () => {
          this.setCurrentPage(pageIndex);
        });
      }
    });

    if (this.pageCount <= 1) {
      _(".pagination").remove()
    }
  }

  appendPageNumber = (index) => {
    const pageNumber = document.createElement("button");
    pageNumber.className = "pagination-number";
    pageNumber.innerHTML = index;
    pageNumber.setAttribute("page-index", index);
    pageNumber.setAttribute("aria-label", "Page " + index);
    _("#pagination-numbers").appendChild(pageNumber);
  };

  setCurrentPage = (pageNum) => {
    this.currentPage = pageNum;

    this.handleActivePageNumber();
    this.handlePageButtonsStatus();

    const prevRange = (pageNum - 1) * 16;
    const currRange = pageNum * 16;

    this.listItems.forEach((item, index) => {
      item.classList.add("filterBtn");
      item.classList.remove("listItem");

      if (index >= prevRange && index < currRange) {
        item.classList.remove("filterBtn");
        item.classList.add("listItem");

        if (_(".selectAllTrans").checked == false) {
          document.querySelectorAll(".checkBox").forEach((eachCheck) => {
            eachCheck.checked = false;
            eachCheck.parentNode.parentNode.classList.remove("backgroundAdd");
          })
        }
      }
    });
  };

  handleActivePageNumber = () => {
    document.querySelectorAll(".pagination-number").forEach((button) => {
      button.classList.remove("active");
      const pageIndex = Number(button.getAttribute("page-index"));
      if (pageIndex == this.currentPage) {
        button.classList.add("active");
      }
    });
  };

  handlePageButtonsStatus = () => {
    if (this.currentPage === 1) {
      this.disableButton(_("#prev-button"));
    } else {
      this.enableButton(_("#prev-button"));
    }
    if (this.pageCount === this.currentPage) {
      this.disableButton(_("#next-button"));
    } else {
      this.enableButton(_("#next-button"));
    }
  };

  disableButton = (button) => {
    button.classList.add("disabled");
    button.setAttribute("disabled", true);
  };

  enableButton = (button) => {
    button.classList.remove("disabled");
    button.removeAttribute("disabled");
  };
}



//transaction detailc (balance,expense,income,transaction)
//list five transaction
//list all details
//fill chart details




