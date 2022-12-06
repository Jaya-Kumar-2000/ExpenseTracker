class regiterModel {
	constructor() {
		this.loginForm = new loginModel();
		this.emailVar;
		this.passwordVar;
		this.reEnterPassword;
		this.dp;
		this.userName;
		this.otp;
	}

	_(ele) {
		return document.querySelector(ele);
	}

	addEventForRegisterForm = () => {
		this._(".registerUserName").addEventListener("input", this.checkRegisterInput);
		this._(".registerUserEmail").addEventListener("input", this.checkRegisterInput);
		this._(".registerPassword").addEventListener("input", this.checkRegisterInput);
		this._(".registerRePassword").addEventListener("input", this.checkRegisterInput);
		this._(".userImageGet").addEventListener("change", this.checkRegisterInput);
		this._(".loginBtn").addEventListener("click", this.loginForm.showForm);

		document.querySelectorAll(".fa-eye").forEach((ecahEyeIcon) => {
			ecahEyeIcon.addEventListener("click", this.loginForm.showPassword);
		})
	}

	registerUser = (e) => {
		e.preventDefault();

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
		this.dp = undefined;
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
		this.loginForm.otpForm();
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
		}).then(
		message => console.log(message)
		);

	}	

	addEVentsForOTPdiv = ()=>{
		this._(".verifyotp").addEventListener("click",this.verifyOTP);
		this._(".resendotp").addEventListener("click",this.sendOTP);
		this._(".otpInput").addEventListener("input",()=>{
			this._(".otpError").innerText ="";
		})
	}


	verifyOTP = ()=>{
		let otpDIVval = this._(".otpInput").value;
		if(otpDIVval!='' && otpDIVval.match(/^[0-9]{4,4}$/g)){
			if(otpDIVval==this.otp){
				console.log("correct")
			}
			else{
				this._(".otpError").innerText = "Sorry, You have entered invalid OTP";
			}
		}
		else{
			this._(".otpError").innerText = "Please try to give a valid input";
		}
	}


	sendNewUserData = () => {

		console.log({
			"user": {
				"name": this.userName,
				"email_id": this.emailVar.toLowerCase(),
				"password": this.reEnterPassword,
				"display_picture": this.dp
			}
		})
		fetch('http://127.0.0.1:8089/api/v1/users', {
			method: 'POST',
			// mode: 'no-cors',
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
					this.loginForm.redirectToMain()
				}
			})
		this._(".regForm").reset();
	}

	emailAlreadyExsit = () => {
		this._(".EmailExist").classList.add("showErr");
		setTimeout(() => {
			this._(".EmailExist").classList.remove("showErr");
		}, 2000)
	}

	checkRegisterInput = (e) => {

		if (e.target.classList.contains("userImageGet")) {
			e.preventDefault();
			this.dp = e.target.files[0];
		}
		else if (e.target.classList.contains("registerUserName")) {
			this.userName = undefined;
			if (e.target.value == "") {
				(e.target).classList.remove("border");
			}
			else if (e.target.value.match(/^[A-Za-z]+[A-Za-z ]{4,}$/)) {
				(e.target).classList.remove("border");
				this.userName = (e.target.value);
			}
			else {
				(e.target).classList.add("border");
			}
		}
		else if (e.target.classList.contains("registerUserEmail")) {
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

		else if (e.target.classList.contains("registerPassword")) {
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
		else if (e.target.classList.contains("registerRePassword")) {
			this.reEnterPassword = undefined;
			if (e.target.value == "") {
				(e.target).classList.remove("border");
			}
			else if (e.target.value.match(/^[0-9]{6,6}$/g)) {
				(e.target).classList.remove("border");
				this.reEnterPassword = (e.target.value);
			}
			else {
				(e.target).classList.add("border");
			}
		}

		if (this.userName != undefined && this.emailVar != undefined && this.reEnterPassword != undefined) {
			if (this.reEnterPassword == this.passwordVar) {
				this._(".registerButton").disabled = false;
				this._(".registerButton").classList.add("btnStyle");
				document.querySelector(".regForm").addEventListener("submit", this.registerUser);
			}
			else {
				this._(".registerButton").disabled = true;
				this._(".registerButton").classList.remove("btnStyle");
			}
		}
		else {
			this._(".registerButton").disabled = true;
			this._(".registerButton").classList.remove("btnStyle");
		}
	}
}


