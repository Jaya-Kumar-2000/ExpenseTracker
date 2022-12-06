class View {
  constructor() {
  }

  transactionDetails = (details) => {
    document.querySelector('.income span').innerText = `₹ ${parseFloat(details.income.toFixed(2))}`;
    document.querySelector('.expenses span').innerText = `₹ ${parseFloat(details.expense.toFixed(2))}`;
    document.querySelector('.balance span').innerText = `₹ ${parseFloat(details.balance.toFixed(2))}`;
    document.querySelector('.transcation span').innerText = details.totalTransaction;
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
      arr.forEach(element => {
        let divEle = document.createElement('tr');
        divEle.setAttribute('class', 'TransactionBody');

        let checkBoxTableRow = document.createElement('td');
        checkBoxTableRow.setAttribute("class","checkStyle")

        let checkBox = document.createElement("input");
        checkBox.setAttribute("type", "checkbox");
        checkBox.setAttribute("name", "selectTransaction");
        checkBox.setAttribute("id", "selectAll");
        checkBox.setAttribute("class", "checkBox eachCheck");
        checkBox.setAttribute("index", element.tid)
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


      document.querySelector('.allTransactionDiv').innerHTML +=` <div class="pagination">
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

    _(".totalSelectedTrans").innerHTML=`0/<b>${arr.length}</b>`
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


  setUserInfo = (data)=>{
    _(".userName").innerText = data.name;
    _(".userIDnumber").innerText = `ID: ${data.id}`;
    data.display_picture!='' ? _(".profileImg").style.backgroundImage=`url(${data.display_picture})`:'';

    //editWindow Info 
    data.display_picture!='' ? _(".userInfo figure").style.backgroundImage=`url(${data.display_picture})`:'';
    _(".UserID").value=data.id;
    _(".userNameMail h3").innerText=data.name;
    _(".userNameMail h6").innerText=data.email_id;
  }
}



//transaction detailc (balance,expense,income,transaction)
//list five transaction
//list all details
//fill chart details



