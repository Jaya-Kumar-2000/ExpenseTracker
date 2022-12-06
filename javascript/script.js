let _ = function (ele) {
    return document.querySelector(ele);
}

class indexModel {
    constructor() {
        this.model =  new Model()
        this.isDPchanged = false;
        this.editImage;
        this.newImageURL = '';
        this.uName;
        this.pass;
        this.conPass;
        this.currentPage = 1;
        this.pageCount = 0;
        this.listItems;
        this.userDetails;
    }

    checkCookie = (e) => {
        // let isUserloggedIn = false;
        // if (document.cookie.length != 0) {
        //     let myArray = document.cookie.split(";");
        //     let arr = myArray.map(x => {
        //         return x.split("=");
        //     });
        //     arr.forEach(function (eachCookie) {
        //         if (eachCookie[0] == "userLogin" && eachCookie[1] == "True") {
        //             isUserloggedIn = true;
        //         }
        //     });
        //     if (!isUserloggedIn) {
        //         window.location.replace("login.html");
        //     }
        //     else {
        //         let lastout = new Date(localStorage.getItem('lastOUT'));
        //         var diff = (new Date().getTime() - lastout.getTime()) / 1000;
        //         diff /= (60 * 60);
        //         // console.log(diff)
        //         // console.log(Math.abs(Math.round(diff)))
        //         if (diff >= 1) {
        //             document.cookie = "userLogin" + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        //             window.location.replace("login.html");
        //         }
        //     }
        // }
        // else {
        //     window.location.replace("login.html");
        // }
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

        this.setEventsForDashBoard();

        document.body.onresize = this.resizeEventforDashboard;


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

    changeButtonbackground = (e) => {
        var current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace("active", "");
        e.target.classList.add("active");
        _(".info").classList.remove("fromLeftInfo");
        _(".dialog").classList.remove("dialogPopup");
    }
    logoutBtn = () => {
        window.location.replace("login.html");
        document.cookie = "userLogin" + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
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

    setEventsForDashBoard = () => {
        _(".linksDiv").querySelectorAll(".a").forEach((aTag) => {
            aTag.addEventListener("click", this.changeButtonbackground)
        });

        _(".logoutBtn").addEventListener("click", this.logoutBtn);
        _(".showInfo").addEventListener("click", this.showInfoFromLeft);
        _(".dialog").addEventListener("click", this.hideInfoFromLeft);
        _(".showEditPopUP").addEventListener("click", this.showEditPopup);

        document.querySelectorAll(".fa-eye").forEach((ecahEyeIcon) => {
            ecahEyeIcon.addEventListener("click", this.showPassword);
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

    showEditPopup = (e) => {
        _(".editContainer").classList.add("fromLeftInfo");
        (this.model.getUserInfo()).then(response => {
            this.userDetails = response;
            _(".editContainer").addEventListener("click", this.eventsForEdit);
        })
    }

    updateNewImage = (e) => {
        _(".listOfOptions").classList.remove("showListOfOptions")

        _(".changeUserDP").addEventListener("change", (e) => {
            this.editImage = e.target.files[0];
            var reader = new FileReader();

            reader.onload = (e) => {
                _(".userInfo figure").style.backgroundImage = `url(${e.target.result})`;
                this.isDPchanged = true;
            }
            reader.readAsDataURL(this.editImage);
        });
    }

    validateuserName = (nameInput) => {
        this.uName=undefined;
        if (nameInput.value=='' || nameInput.value.match(/^[A-Za-z]+[A-Za-z ]{4,}$/)) {
            nameInput.classList.remove("borderRed");
            this.uName = nameInput.value;
        }
        else {
            nameInput.classList.add("borderRed")
        }
    }


    validatePassWord = (passwordElement) => {
        this.pass = undefined;
        if (passwordElement.value=='' || passwordElement.value.match(/^[0-9]{6,6}$/g)) {
            passwordElement.classList.remove("borderRed");
            this.pass = passwordElement.value;
        }
        else {
            passwordElement.classList.add("borderRed")
        } 
    }

    validateConfirmPassWord = (confirmInput,passWordInput) => {
        this.conPass = undefined;
        if (confirmInput.value=='' || confirmInput.value.match(/^[0-9]{6,6}$/g)) {
            if(confirmInput.value==passWordInput.value){
                confirmInput.classList.remove("borderRed");
                this.conPass = confirmInput.value;
            }
            else{
                confirmInput.classList.add("borderRed")
            }
        }
        else {
            confirmInput.classList.add("borderRed")
        }    
    }

    removeCurrentImage = () => {
        let ImageFigureEdit = (_(".userInfo figure").getAttribute("style"));
        if (ImageFigureEdit != null) {
            _(".userInfo figure").removeAttribute("style");
            this.newImageURL="";
            // console.log(this.userDetails.user.display_picture)
            // firebase.storage().refFromURL(this.userDetails.user.display_picture).delete();
        }
        _(".listOfOptions").classList.remove("showListOfOptions");
    }

    checkDPUPdatedOrNot = () => {
        if (this.isDPchanged) {
            if(this.userDetails.user.display_picture!=''){
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
            (_(".profileImg").getAttribute("style"))!=null ? (_(".profileImg").removeAttribute("style")):"";
            this.sendEditedDEtails();
            this.isDPchanged = false;
        }
    }


    sendEditedDEtails = () => {
        _(".userName").innerHTML=this.uName;
        _(".userNameMail h3").innerText=this.uName;

        if(this.uName==''){
            _(".userName").innerHTML=this.userDetails.user.name;
            _(".userNameMail h3").innerText=this.userDetails.user.name;
        }

        console.log(this.uName,this.newImageURL,this.userDetails.user.id )

        let user = {"user" : { } }

        if(this.newImageURL!=''){
            user.user["display_picture"] = this.newImageURL;
        }
        else if(this.uName!=''){
            user.user["name"] = this.uName;
        }

        console.log(user);


        fetch(`http://127.0.0.1:8089/api/v1/users/${this.userDetails.user.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},

			body: JSON.stringify(user)
		})
		.then(res => {
			return res.json();
		})
		.then(data => {
			console.log(data)	
		})

    }


    validateAllEditedIput = () => {
        if (this.uName != undefined && this.pass != undefined && this.conPass != undefined) {
            _(".inputInfos").reset();
            _(".editContainer").classList.remove("fromLeftInfo");
            this.checkDPUPdatedOrNot();
        }
    }


    saveChangesOfEdit = () => {

        this.userName = _(".UserNameInput");
        this.password = _(".UserpassInput");
        this.confirmPassword = _(".reEnterPass");
         
        this.validateuserName(this.userName);
        this.validatePassWord(this.password);
        this.validateConfirmPassWord(this.confirmPassword,this.password);
        this.validateAllEditedIput()
    }


    eventsForEdit = (e) => {
        let ele = e.target.classList;
        if (ele.contains("showEditProfileopt")) {
            _(".listOfOptions").classList.toggle("showListOfOptions");
        }
        else if (ele.contains("cancelBtn")) {
            _(".listOfOptions").classList.remove("showListOfOptions");
            _(".editContainer").classList.remove("fromLeftInfo")
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


    addEventsForEditPopUp = () => {
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

    addNewTransaction = () => {
        let clonedTemplate = _(".addTransactionPopup").content.cloneNode(true);
        _("main").append(clonedTemplate);
        this.setEventForNewTransDiv();
    }


    setEventForNewTransDiv = () => {
        this.showDropDownNewTransaction();

        let listofincome = _("#incomeDropDown").content.cloneNode(true);
        _(".popUpContainer .dropDown").prepend(listofincome);

        document.querySelectorAll(".popupBox input[type='radio']").forEach((input) => {
            input.addEventListener('change', this.popUPincomeORexpense);
        });
    }

    showDropDownNewTransaction = () => {
        _(".newCatHead").addEventListener("click", () => {
            _(".newCatHead").previousElementSibling.classList.toggle("showDropDown");
            _(".newCatHead i").classList.toggle("rotateDownBtn");
            _(".newCatHead").classList.toggle("listBorder")
            this.selectCategoryValue();
            if (_(".payMode").classList.contains("listBorder")) {
                _(".payMode").previousElementSibling.classList.remove("showDropDown");
                _(".payMode i").classList.remove("rotateDownBtn");
                _(".payMode").classList.remove("listBorder");
            }
        })

        _(".payMode").addEventListener("click", () => {
            _(".paymodeList").classList.toggle("showDropDown");
            _(".payMode i").classList.toggle("rotateDownBtn");
            _(".payMode").classList.toggle("listBorder");
            this.selectPayModeValue();
            if (_(".newCatHead").classList.contains("listBorder")) {
                _(".newCatList").classList.remove("showDropDown");
                _(".newCatHead i").classList.remove("rotateDownBtn");
                _(".newCatHead").classList.remove("listBorder");
            }
        })
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

    showFilterFromRight = () => {
        _(".filterBox").classList.add("fromRightFilter");
        _(".dialog").classList.add("dialogPopup")
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

    logoutWhileInactive = () => {
        localStorage.setItem("lastOUT", new Date());
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

        if(this.pageCount<=1){
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

                if(_(".selectAllTrans").checked==false){
                    document.querySelectorAll(".checkBox").forEach((eachCheck)=>{
                        eachCheck.checked=false;
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