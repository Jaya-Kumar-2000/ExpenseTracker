_ = (ele) => {
    return document.querySelector(ele);
}

class loginModel {
    constructor(status) {
        this.emailVar;
        this.passwordVar;
        this.userId;
        this.init();
    }
    init = ()=>{
        this.checkCookie();
        window.addEventListener('focus', this.checkCookie);
    }

    checkCookie = () => {
        let isUserloggedIn = false;
        if (document.cookie.length != 0) {
            let myArray = document.cookie.split(";");
            let arr = myArray.map(x => {
                return x.split("=");
            });
            arr.forEach(function (eachCookie) {
                if (eachCookie[0] == "userLogin" && eachCookie[1] == "True") {
                    isUserloggedIn = true;
                }
            });
            console.log(isUserloggedIn)
            if (isUserloggedIn) {
                window.location.replace("index.html");
            }
        }
    }

    loginEventListeners = () => {
        _(".loginUserEmail").addEventListener("input", this.checkLoginInput);
        _(".loginPassword").addEventListener("input", this.checkLoginInput);
        _(".registerBtn").addEventListener("click", this.showForm);

        _(".fa-eye").addEventListener("click", this.showPassword);
    }

    showForm = (e) => {
        e.preventDefault();
        if (e.target.classList.contains("registerBtn")) {
            _("title").innerText = "Register User";
            this.registerForm();
        }
        else {
            _("title").innerText = "Login User";
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
				_(".incorectpassWord").classList.add("showErr");
			}
			else{
                document.cookie = "userLogin=True";
				var encrypted = CryptoJS.AES.encrypt(`${data.user.id}`, "Secret Passphrase");
				localStorage.setItem("userID", encrypted);
                window.location.replace("index.html");
                localStorage.setItem("lastOUT", new Date());
			}
		})
    }

    checkLoginInput = (e) => {
        _(".incorectpassWord").classList.remove("showErr");

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
            _(".loginButton").disabled = false;
            _(".loginButton").classList.add("btnStyle");
            document.querySelector(".logForm").addEventListener("submit", this.logUnUser);
        }
        else {
            _(".loginButton").disabled = true;
            _(".loginButton").classList.remove("btnStyle");
        }
    }

    loginForm = () => {
        _(".forms").innerHTML = "";
        let clonedTemplate = _(".loginDiv").content.cloneNode(true);
        _(".forms").append(clonedTemplate);
        this.loginEventListeners();
    }

    registerForm = () => {
        _(".forms").innerHTML = "";
        let clonedTemplate = _(".RegisterDiv").content.cloneNode(true);
        _(".forms").append(clonedTemplate);
        new regiterModel().addEventForRegisterForm()
    }

    otpForm = ()=>{
        _(".forms").innerHTML = "";
        let clonedTemplate = _(".OTP-div").content.cloneNode(true);
        _(".forms").append(clonedTemplate);
		_(".loginBtn").addEventListener("click", this.loginForm);
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