function mortgageCalculation(amount, term, rate, type) {
  const r = (rate / 100) / 12;
  const n = term * 12;
  let overTerm;
  let formattedCurrency;

  if(type === "repayment") {
    let m = amount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    m = (m / 100)
    overTerm = m * n;

    // Format currency
    formattedCurrency = m.toLocaleString('en-UK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    overTerm = overTerm.toLocaleString('en-UK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })

    console.log(formattedCurrency);
  } else if(type === "interest") {
    let m = amount * r;
    m = (m / 100);
    overTerm = m * n;

    // Format currency
    formattedCurrency = m.toLocaleString('en-UK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
    overTerm = overTerm.toLocaleString('us-UK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  // Function return value
  if(!formattedCurrency && !overTerm){
    return
  }else{
    return {formattedCurrency, overTerm}
  }
  
}
//function to convert pounds to pence
function convertToPence(pounds) {
  console.log(pounds)
  return Math.round(pounds * 100);
}

//result UI
function resultUI(mortgage) {
  
  const html = `
    <div class="result-container">
      <div class="heading">
        <p class="result-heading">Your results</p>
        <p class="gray-text">
          Your result are shown below based on the information you provided.
          To adjust the results, edit the form and click "calculate repayments"
          again.
        </p>
      </div>

      <div class="bg">
        <div class="repayment-container">
         <div class="monthly-repayment-container">
          <p class="gray-text">Your monthly repayments</p>
          <p class="monthly-repayment">£${mortgage.formattedCurrency}</p>
         </div>
        
         <div class="total-term-repay">
          <p class="gray-text">Total you'll repay over the term</p>
          <p class="payment-over-term">£${mortgage.overTerm}</p>
         </div>
        </div>
      </div>
    </div>
  `
  return html;
}

//show error message
function showError(containerSelector, placholderSelector){
  const errorMessage = document.querySelector(`${containerSelector} .hide-error-message`);
  const prefixPlaceholder = document.querySelector(placholderSelector);

  if(errorMessage) {
    errorMessage.classList.add('show-error-message');
  }else{
    console.log('empty element')
  }
  if(prefixPlaceholder) {
    prefixPlaceholder.classList.add('prefix-placeholder-error')
  }else{
    return
  }
}

//remove errror message
function clearError(containerSelector, placholderSelector) {
  const errorMessage = document.querySelector(`${containerSelector} .hide-error-message`);
  const prefixPlaceholder = document.querySelector(placholderSelector);

  errorMessage.classList.remove('show-error-message');
  console.log('remove show error', errorMessage)
  prefixPlaceholder.classList.remove('prefix-placeholder-error');
  console.log('removed prefix error', prefixPlaceholder)
}

// Add input event Listners to clear error when user types
document.getElementById('mortgage-amount').addEventListener('input', () => {
  clearError('.amount-container', '.amount-prefix-placeholder.js-prefix-placeholder');
});

document.getElementById('mortgage-term').addEventListener('input', () => {
  clearError('.term-container', '.term-prefix-placeholder.js-prefix-placeholder');
});

document.getElementById('mortgage-rate').addEventListener('input', () => {
  clearError('.rate-container', '.rate-prefix-placeholder.js-prefix-placeholder');
});

document.querySelectorAll('input[name="option"]').forEach(radioButton => {
  radioButton.addEventListener('change', () => {
    const errorMessage = document.querySelector(`.mortage-type-container .hide-error-message`);
    errorMessage.classList.remove('show-error-message');
  })
})

//addEventListener to calculate button
const calculateBtn = document.querySelector('.js-calculate-btn');
if(calculateBtn) {
  calculateBtn.addEventListener('click', (event) => {
    event.preventDefault();
    //get mortage loan amount in pound and convert to pence
    let amount = document.getElementById('mortgage-amount').value.trim();
     //get mortage term in year
    let term = document.getElementById('mortgage-term').value.trim();
    //get mortage rate 
    let rate = document.getElementById('mortgage-rate').value.trim();
    // Get mortgage type
    let mortgageType = document.querySelector('input[name="option"]:checked');

    
    if(!amount &&  !term && !rate){
      let errorMessage = document.querySelectorAll('.hide-error-message');
      let prefixPlaceholder = document.querySelectorAll('.js-prefix-placeholder')

      prefixPlaceholder.forEach((prefixEelement) => {
        prefixEelement.classList.add('prefix-placeholder-error')
      })
      errorMessage.forEach((errorElement) => {
        errorElement.classList.add('show-error-message');
      })
      
    }

    if(amount){
      amount = convertToPence(Number(amount.replace(/,/g, "")));
    }else{
      showError('.amount-container', '.amount-prefix-placeholder.js-prefix-placeholder')
      return
    }
    
    if(term){
      term = Number(term);
    }else{
      showError('.term-container', '.term-prefix-placeholder.js-prefix-placeholder')
      return
    }
    
    if(rate) {
      rate = parseFloat(rate)
    }else{
     showError('.rate-container', '.rate-prefix-placeholder.js-prefix-placeholder')
      return
    }

    if(!mortgageType) {
      let errorMessageElement = document.querySelector('.mortage-type-container .hide-error-message');
      errorMessageElement.classList.add('show-error-message')
    }else{
      mortgageType = mortgageType.id;
    }

    const mortgage = mortgageCalculation(amount, term, rate, mortgageType);
    const resultSection = document.querySelector('.js-result-section');

    resultSection.innerHTML = resultUI(mortgage);

  })
}