class loginModel {
    constructor(status) {
        this.emailVar;
        this.passwordVar;
        this.userId;
    }

    _(ele) {
        return document.querySelector(ele);
    }


    checkCookie = () => {
        // let isUserloggedIn = false;
        // if (document.cookie.length != 0) {
        //     let myArray = document.cookie.split(";");
        //     let arr = myArray.map(x => {
        //         return x.split("=");
        //     });
        //     arr.forEach(function (eachCookie) {
        //         if (eachCookie[0] == "userLogin" && eachCookie[1] == true) {
        //             isUserloggedIn = true;
        //         }
        //     });
        //     if (isUserloggedIn) {
        //         window.location.replace("index.html");
        //     }
        // }
    }

    loginEventListeners = () => {
        this._(".loginUserEmail").addEventListener("input", this.checkLoginInput);
        this._(".loginPassword").addEventListener("input", this.checkLoginInput);
        this._(".registerBtn").addEventListener("click", this.showForm);

        this._(".fa-eye").addEventListener("click", this.showPassword);

        window.addEventListener('focus', this.checkCookie);
        window.onload = this.checkCookie;

    }

    showForm = (e) => {
        e.preventDefault();
        if (e.target.classList.contains("registerBtn")) {
            this._("title").innerText = "Register User";
            this.registerForm();
        }
        else {
            this._("title").innerText = "Login User";
            this.loginForm();
        }
    };


    logUnUser = (e) => {
        e.preventDefault();
        console.log(e)

        fetch('http://127.0.0.1:8089/api/v1/auth', {
			method: 'POST',
			// mode: 'no-cors',
			headers: {
				'Content-Type': 'application/json',
				'Content-Type': 'application/json; charset=UTF-8',
			},
			
			body: JSON.stringify({
                "login" : {
                    "email_id" : this.emailVar.toLowerCase(),
                    "password" :this.passwordVar
                }
            })
		})
        .then(res => {
			return res.json();
		})
		.then(data => {
            console.log(data)
			if(data.status == "error"){
				this._(".incorectpassWord").classList.add("showErr");
			}
			else{
				var encrypted = CryptoJS.AES.encrypt(`${data.user.id}`, "Secret Passphrase");
				localStorage.setItem("userID", encrypted);
				this.redirectToMain();
			}
		})
    }

    redirectToMain = () => {
        window.location.replace("index.html");
        document.cookie = "userLogin=True";
    }

    checkLoginInput = (e) => {
        this._(".incorectpassWord").classList.remove("showErr");

        if (e.target.classList.contains("loginUserEmail")) {
            this.emailVar = undefined;

            if (e.target.value == "") {
                (e.target).classList.remove("border");
            }
            else if (e.target.value.match(/^[A-Za-z]+([\.-]?\w+)\@(\w+([\.-]?\w+))\.(\w+([\.]?\w{1,}))$/gi)) {
                (e.target).classList.remove("border");
                this.emailVar = (e.target.value);
            }
            else {
                (e.target).classList.add("border");
            }
        }
        else if (e.target.classList.contains("loginPassword")) {
            this.passwordVar = undefined;
            if (e.target.value == "") {
                (e.target).classList.remove("border");
            }
            else if (e.target.value.match(/^[0-9]{6,6}$/g)) {
                (e.target).classList.remove("border");
                this.passwordVar = (e.target.value);
            }
            else {
                (e.target).classList.add("border");
            }
        }

        if (this.emailVar != undefined && this.passwordVar != undefined) {
            this._(".loginButton").disabled = false;
            this._(".loginButton").classList.add("btnStyle");
            document.querySelector(".logForm").addEventListener("submit", this.logUnUser);
        }
        else {
            this._(".loginButton").disabled = true;
            this._(".loginButton").classList.remove("btnStyle");
        }
    }

    loginForm = () => {
        this._(".forms").innerHTML = "";
        let clonedTemplate = this._(".loginDiv").content.cloneNode(true);
        this._(".forms").append(clonedTemplate);
        this.loginEventListeners();
    }

    registerForm = () => {
        this._(".forms").innerHTML = "";
        let clonedTemplate = this._(".RegisterDiv").content.cloneNode(true);
        this._(".forms").append(clonedTemplate);
        new regiterModel().addEventForRegisterForm()
    }

    otpForm = ()=>{
        this._(".forms").innerHTML = "";
        let clonedTemplate = this._(".OTP-div").content.cloneNode(true);
        this._(".forms").append(clonedTemplate);
		this._(".loginBtn").addEventListener("click", this.loginForm);
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

}

window.onload = new loginModel().loginForm();