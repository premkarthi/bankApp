'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];
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



function displayMovements(movements , sorted = false){

    let moves = sorted ? movements.slice().sort((a, b) => a - b) : movements

    containerMovements.innerHTML = '';


    moves.forEach((mov,i) => {
        const type = mov > 0 ? 'deposit' : 'withdrawal';
        const html = `
            <div class="movements__row">
            <div class="movements__type movements__type--${type}">${i + 1} deposit</div>
            <div class="movements__date">3 days ago</div>
            <div class="movements__value">${mov}</div>
            </div>
        `
        containerMovements.insertAdjacentHTML('afterbegin' , html)
    });
}


//Calculate the movements and display the value
function calDisplayBalance(acc){
    acc.balance = acc.movements.reduce((value, cur) => value + cur , 0);
    labelBalance.textContent = `${acc.balance} ₹`
}


//Calculate price summary

const calDisplaySummary = function(acc){
    const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov , 0);
    labelSumIn.textContent = `${incomes} ₹`
    

    const out = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov , 0);
    labelSumOut.textContent = `${Math.abs(out)} ₹`
    
    const intrest = acc.movements.filter((mov)=> mov > 0).map(deposit => (deposit * acc.interestRate)/100).filter((int, i, arr) => int >= 1).reduce((acc, int) => acc + int , 0)
    labelSumInterest.textContent = `${intrest} ₹`
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
      displayMovements(acc.movements);

      //Display balance
      calDisplayBalance(acc);

      //Display Summary
      calDisplaySummary(acc);
}



//Login function
let currentAccount;

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

        updateUI(currentAccount)
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
        
        // Clear all the input fields
        inputTransferTo = inputTransferAmount = '';
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





