'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  pin: 1111,
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};


const accounts = [account1, account2];
console.log(accounts);

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


function getTransferDateDetails(date, locale){
    const calDaysPassed  = (date1, date2) =>{
     return Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24))
    }

    const daysPassed = calDaysPassed(new Date(),  date);

    if(daysPassed === 0) return "Today" 
    if(daysPassed === 1) return "Yesterday"    
    if(daysPassed <= 7) return `${daysPassed} days ago`    
    else{
        return  new Intl.DateTimeFormat(locale).format(date)
    }

}

function formatCur(value, locale, currency){
    let options = {
        style: 'currency',
        currency : currency
    }
    return new Intl.NumberFormat(locale , options).format(value)
}

function displayMovements(acc , sorted = false){

    let moves = sorted ? acc.movements.slice().sort((a, b) => a - b) : acc.movements

    containerMovements.innerHTML = '';


    moves.forEach((mov,i) => {

        const now = new Date(acc.movementsDates[i])
        
        const dataDetails = getTransferDateDetails(now , acc.locale)

        const type = mov > 0 ? 'deposit' : 'withdrawal';
        const html = `
            <div class="movements__row">
            <div class="movements__type movements__type--${type}">${i + 1} deposit</div>
            <div class="movements__date">${dataDetails}</div>
            <div class="movements__value">${formatCur(mov,acc.locale, acc.currency)}</div>
            </div>
        `
        containerMovements.insertAdjacentHTML('afterbegin' , html)
    });
}


//Calculate the movements and display the value
function calDisplayBalance(acc){
    acc.balance = acc.movements.reduce((value, cur) => value + cur , 0);
    labelBalance.textContent = `${formatCur(acc.balance, acc.locale, acc.currency)} `
}


//Calculate price summary

const calDisplaySummary = function(acc){
    const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov , 0);
    labelSumIn.textContent = `${formatCur(incomes, acc.locale, acc.currency)}`
    

    const out = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov , 0);
    labelSumOut.textContent = `${formatCur(out, acc.locale, acc.currency)}`
    
    const intrest = acc.movements.filter((mov)=> mov > 0).map(deposit => (deposit * acc.interestRate)/100).filter((int, i, arr) => int >= 1).reduce((acc, int) => acc + int , 0)
    labelSumInterest.textContent = `${formatCur(intrest, acc.locale, acc.currency)}`
}



///Get username onnly with first number
function getUserName(user){
    user.forEach((individalUser) => {
        individalUser.username = individalUser.owner.toLowerCase().split(' ').map(word => word[0]).join('');
    })
}
getUserName(accounts);

//UpdateUI

const updateUI = function(acc){
      //Display movements
      displayMovements(acc);

      //Display balance
      calDisplayBalance(acc);

      //Display Summary
      calDisplaySummary(acc);
}



//Login function
let currentAccount ;

// labelWelcome.textContent = `Welcome back ${currentAccount.owner.split(' ')[0]}`
// containerApp.style.opacity = 1;
// updateUI(currentAccount)


btnLogin.addEventListener('click' , function(e){
    e.preventDefault();

    currentAccount = accounts.find((acc) => acc.username === inputLoginUsername.value);

    if(currentAccount?.pin === Number(inputLoginPin.value)){
        
        //Dispaly UI and message
        labelWelcome.textContent = `Welcome back ${currentAccount.owner.split(' ')[0]}`
        containerApp.style.opacity = 1;

        //Clear the input fields
        inputLoginUsername.value = inputLoginPin.value = '';
        inputLoginPin.blur();

        const now = new Date()
       
        const options = {
            hour: 'numeric',
            minute: 'numeric',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            weekday: 'long',

        }
        const locale = currentAccount.locale

        labelDate.textContent = new Intl.DateTimeFormat(locale , options).format(now)

        updateUI(currentAccount);
        setTimerToLogout()
    }
    else{
        console.log("UserId wrong");
    }
});


//Transfer Amount 

btnTransfer.addEventListener('click' , function(e){
    e.preventDefault();

    const amount = Number(inputTransferAmount.value);
    const receiverAcc  = accounts.find(acc => acc.username === inputTransferTo.value);

    console.log(amount, receiverAcc);

    if(amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username){
        currentAccount.movements.push(-amount);
        receiverAcc.movements.push(amount)

        currentAccount.movementsDates.push(new Date().toISOString())
        receiverAcc.movementsDates.push(new Date().toISOString())

        
        // Clear all the input fields
        inputTransferTo.value = inputTransferAmount.value = '';
        inputTransferAmount.blur();

        //Update UI
        updateUI(currentAccount)

    }
})

//Request Loan 

btnLoan.addEventListener('click', function(e){
    e.preventDefault();

    const amount = Number(inputLoanAmount.value);

    if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)){
        currentAccount.movements.push(amount);

        currentAccount.movementsDates.push(new Date().toISOString())

        //Update UI
        updateUI(currentAccount)
    }
    else{
        console.log("We can't pay much amount");
    }
})


//Close Account

btnClose.addEventListener('click', function(e){
    e.preventDefault();

    if(currentAccount.pin === Number(inputClosePin.value)){
        const index = accounts.findIndex(acc => acc.username === currentAccount.username);
        accounts.splice(index, 1);

        containerApp.style.opacity = 0;
    }
})


//Sorting movements

let sorted = false

btnSort.addEventListener('click', function(e){
    e.preventDefault()
    displayMovements(currentAccount.movements, !sorted)

    sorted = !sorted
})


//Set timer to logout

function setTimerToLogout(){
    let time = 300;

    const timer  = setInterval(function(){
        const min = String(Math.trunc(time / 60)).padStart(2,0)
        const sec = String(time % 60).padStart(2,0)

        labelTimer.textContent = `${min}:${sec}`;

        time--;

        if(time === 0){
            clearInterval(timer);

            labelWelcome.textContent = "Log in to get started"
            containerApp.style.opacity = 0;
        }
    }, 1000)
}


/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const deposits = movements.filter((item) => item > 0)
const withdrawals = movements.filter((item) => item < 0)




