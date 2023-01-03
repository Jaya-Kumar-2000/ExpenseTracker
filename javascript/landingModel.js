_ = (ele) => {
    return document.querySelector(ele);
}

class landingModel {
    constructor() {
		this.emailVar;
		this.userName;
		this.passwordVar;
		this.reEnterPassword;
		this.image;
        this.checkCookie();
        window.addEventListener('focus', this.checkCookie);
    }

    eventForLanding = ()=>{
		if(localStorage.isloggedOut){
			this.setLoginForm();
			localStorage.removeItem("isloggedOut");
		}
        _(".optionsEntry").addEventListener("click",this.headerLink);
        _(".startBtnContainer").addEventListener("click",this.getStartContainer)
    }

     headerLink = (e)=>{
        if(e.target.classList.contains("signInLand")){
            this.setLoginForm()
        }
        else if(e.target.classList.contains("signUpLand")){
            this.setRegisterForm()
        }
    }

    getStartContainer = (e)=>{
        if(e.target.classList.contains("startBtn")){
            this.setRegisterForm()
        }
        // else if(e.target.classList.contains("callBtn")){
        //     console.log("called")
        // }
    }

    checkCookie = () => {
        let isUserloggedIn = false;
        if (document.cookie.length != 0) {
            let myArray = document.cookie.split(";");
            let arr = myArray.map(x => {
                return x.split("=");
            });
            arr.forEach(function (eachCookie) {
                if (eachCookie[0] == "userLogin" && eachCookie[1] == "true") {
                    isUserloggedIn = true;
                }
            });

            if (isUserloggedIn) {
                window.location.replace("main.html");
            }
        }
    }

    setLoginForm = ()=>{
		_("title").innerText = "Login User";
        this.setForm("loginDiv");
        this.loginEventListeners();  
    }

    setRegisterForm = ()=>{
		_("title").innerText = "Register User";
        this.setForm("RegisterDiv");
        this.addEventForRegisterForm()
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
            this.setForm("RegisterDiv");
            this.addEventForRegisterForm()
        }
        else {
            _("title").innerText = "Login User";
            this.setForm("loginDiv");
            this.loginEventListeners(); 
        }
    };

    setForm = (type)=>{
        _(".userForm")!=null?_(".userForm").remove():'';

        let clonedFormTemplate = _(`.allFormTemplate`).content.cloneNode(true);
        _("body").prepend(clonedFormTemplate);

        let clonedTemplate = _(`.${type}`).content.cloneNode(true);
        _(".forms").append(clonedTemplate);



		_(".userForm").addEventListener("mousedown", (e)=>{
			if(e.target.classList.contains("closeFormBtn")){
				_(".userForm").remove();
			}
		})
    }

    logUnUser = (e) => {
        e.preventDefault();
        if(navigator.onLine){
            fetch('http://127.0.0.1:8089/api/v1/auth', {
                method: 'POST',
                // mode: 'no-cors',
                headers: {
                    'Content-Type': 'applicatioindex.html#DashBoardn/json',
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
                if(data.status == "error"){
                    _(".incorectpassWord").classList.add("showErr");
                }
                else{
                    document.cookie = "userLogin=true";
                    var encrypted = CryptoJS.AES.encrypt(`${data.user.id}`, "Secret Passphrase");
                    localStorage.setItem("userID", encrypted);
                    window.location.replace("index.html");
                    localStorage.setItem("lastOUT", new Date());
                }
            })
			.catch(error => {
				console.error('There was an error!', error);
			});
        }
        else{
            _('.userForm').remove();
            let clonedTemplate = _(".noNetWork").content.cloneNode(true);
            _("body").prepend(clonedTemplate);
            _(".checkInternet").addEventListener("click",this.checkNetworkAgain);
        }    
    }

    checkNetworkAgain = ()=>{
        _(".popUpwifiLoader").style.display="flex";
        setTimeout(()=>{
			if(navigator.onLine){
                _(".networkPopup").remove();
				this.eventForLanding();
			}   
			else{
                _(".popUpwifiLoader").style.display="none";
			}
		},600)
    }

    checkLoginInput = (e) => {
        _(".incorectpassWord").classList.remove("showErr");

        if (e.target.classList.contains("loginUserEmail")) {
            this.emailVar = undefined;
			this.checkConditions(e,/^[A-Za-z]+([\.-]?\w+)\@(\w+([\.-]?\w+))\.(\w+([\.]?\w{1,}))$/gi,"email")
        }
        else if (e.target.classList.contains("loginPassword")) {
            this.passwordVar = undefined;
			this.checkConditions(e,/^[0-9]{6,6}$/gi,"pass")
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

    addEventForRegisterForm = () => {
		_(".registerUserName").addEventListener("input", this.checkRegisterInput);
		_(".registerUserEmail").addEventListener("input", this.checkRegisterInput);
		_(".registerPassword").addEventListener("input", this.checkRegisterInput);
		_(".registerRePassword").addEventListener("input", this.checkRegisterInput);
		_(".userImageGet").addEventListener("change", this.checkRegisterInput);
		_(".loginBtn").addEventListener("click", this.showForm);

		document.querySelectorAll(".fa-eye").forEach((ecahEyeIcon) => {
			ecahEyeIcon.addEventListener("click", this.showPassword);
		})
	}


    checkRegisterInput = (e) => {

		if (e.target.classList.contains("userImageGet")) {
			e.preventDefault();
			this.image = e.target.files[0];
			this.dp = e.target.files[0];
			if(this.dp != undefined){
				_(".userDP").style.background="#86DEAE";
			}
			else{
				_(".userDP").style.background="#e1e2e2";
			}
		}
		else if (e.target.classList.contains("registerUserName")) {
			this.userName = undefined;
			this.checkConditions(e,/^[A-Za-z]+[A-Za-z ]{4,}$/,"uName")

		}
		else if (e.target.classList.contains("registerUserEmail")) {
			this.emailVar = undefined;
			this.checkConditions(e,/^[A-Za-z]+([\.-]?\w+)\@(\w+([\.-]?\w+))\.(\w+([\.]?\w{1,}))$/gi,"email")
		}

		else if (e.target.classList.contains("registerPassword")) {
			this.passwordVar = undefined;
			this.checkConditions(e,/^[0-9]{6,6}$/gi,"pass")
		}
		else if (e.target.classList.contains("registerRePassword")) {
			this.reEnterPassword = undefined;
			this.checkConditions(e,/^[0-9]{6,6}$/gi,"rePass")
			
		}

		if (this.userName != undefined && this.emailVar != undefined && this.reEnterPassword != undefined) {
			if (this.reEnterPassword == this.passwordVar) {
				_(".registerButton").disabled = false;
				_(".registerButton").classList.add("btnStyle");
				document.querySelector(".regForm").addEventListener("submit", this.registerUser);
			}
			else {
				_(".registerButton").disabled = true;
				_(".registerButton").classList.remove("btnStyle");
			}
		}
		else {
			_(".registerButton").disabled = true;
			_(".registerButton").classList.remove("btnStyle");
		}
	}
    

	checkConditions =(e,condition,variable)=>{
		if (e.target.value == "") {
			(e.target).classList.remove("border");
		}
		else if (e.target.value.match(condition)) {
			(e.target).classList.remove("border");
			if(variable==="email"){
				this.emailVar=e.target.value
			}
			else if(variable==="pass"){
				this.passwordVar = (e.target.value);
			}
			else if(variable==="uName"){
				this.userName = e.target.value;
			}
			else if(variable==="rePass"){
				this.reEnterPassword = e.target.value;
			}
		}
		else {
			(e.target).classList.add("border");
		}
	}


    registerUser = (e) => {
		e.preventDefault();
		if(navigator.onLine){
			// console.log(this.userName,this.reEnterPassword,this.emailVar,this.dp)

			if (this.dp == undefined) {
				this.dp = '';
				this.sendOTPdiv();
			}
			else {
				const ref = firebase.storage().ref("images/" + this.dp.name);
				const task = ref.put(this.dp)
				task.then((snapshot) => {
					snapshot.ref.getDownloadURL().then((url) => {
						if (url != undefined) {
							this.dp = url;
							this.sendOTPdiv();
						}
					})
				})
			}
		}
		else{
            _('.userForm').remove();
            let clonedTemplate = _(".noNetWork").content.cloneNode(true);
            _("body").prepend(clonedTemplate);
            _(".checkInternet").addEventListener("click",this.checkNetworkAgain);
		}	
	}

    otpForm = ()=>{
        _(".forms").innerHTML = "";
        let clonedTemplate = _(".OTP-div").content.cloneNode(true);
        _(".forms").append(clonedTemplate);
		_(".emailIDOtpDiv").innerText=this.emailVar;
		_(".loginBtn").addEventListener("click", this.setLoginForm);
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


	generateOTP = () => {
		var digits = '0123456789';
		let OTP = '';
		for (let i = 0; i < 4; i++) {
			OTP += digits[Math.floor(Math.random() * 10)];
		}
		return OTP;
	}


	sendOTPdiv = () => {
		this.otpForm();
		this.sendOTP();
		this.addEVentsForOTPdiv();
	}

	sendOTP = ()=>{
		this.otp = this.generateOTP();

		Email.send({
			SecureToken: "e002b65b-0595-42ca-bef0-2524bad1ae1e",
			To: this.emailVar.toLowerCase(),
			From: "kumar2000kamaraj@gmail.com",
			Subject: "OTP for account Creation: ",
			Body: `Please use the verification code to create an account: ${this.otp}`
		})
	}	

	addEVentsForOTPdiv = ()=>{
		_(".verifyotp").addEventListener("click",this.verifyOTP);
		_(".resendotp").addEventListener("click",()=>{
			_(".msgOTPsent").innerText = "New OTP has been sent"
			setTimeout(()=>{
				_(".msgOTPsent").innerText = "OTP sent to your Email Id";	
			},2000)
			this.sendOTP();
		})	
		_(".otpInput").addEventListener("input",()=>{
			_(".otpError").innerText ="";
		})
	}


	verifyOTP = ()=>{
		let otpDIVval = _(".otpInput").value;
		if(otpDIVval!='' && otpDIVval.match(/^[0-9]{4,4}$/g)){
			if(otpDIVval==this.otp){
				this.sendNewUserData();
			}
			else{
				_(".otpInput").value='';
				_(".otpError").innerText = "Sorry, You have entered invalid OTP";
			}
		}
		else{
			_(".otpError").innerText = "4 Digits are enough";
		}
	}


	sendNewUserData = () => {

		fetch('http://127.0.0.1:8089/api/v1/users', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Content-Type': 'application/json; charset=UTF-8',
			},

			body: JSON.stringify({
				"user": {
					"name": this.userName,
					"email_id": this.emailVar.toLowerCase(),
					"password": this.reEnterPassword,
					"display_picture": this.dp
				}
			})
		})

		.then(res => {
			return res.json();
		})
		.then(data => {
			if (data.status == "error") {
				this.emailAlreadyExsit();
			}
			else {
				var encrypted = CryptoJS.AES.encrypt(`${data.user.id}`, "Secret Passphrase");
				localStorage.setItem("userID", encrypted);
				localStorage.setItem("lastOUT", new Date());
				document.cookie = "userLogin=true";
				window.location.replace("index.html");
				this.dp=undefined;
			}
		})
	}

	emailAlreadyExsit = () => {
		firebase.storage().refFromURL(this.dp).delete();
		this.dp = this.image;
		_(".otpConfirmation").remove();
		this.setRegisterForm();
		_(".registerUserName").value = this.userName;
		_(".registerUserEmail").value = this.emailVar;
		_(".registerUserEmail").focus();
		_(".registerPassword").value = this.passwordVar;
		_(".registerRePassword").value = this.reEnterPassword;
		if(this.dp!=''){
			_(".userDP").style.background="#86DEAE";
		}

		_(".EmailExist").classList.add("showErr");
		setTimeout(() => {
			_(".EmailExist").classList.remove("showErr");
		}, 2000)
	}
}


window.onload = new landingModel().eventForLanding();


