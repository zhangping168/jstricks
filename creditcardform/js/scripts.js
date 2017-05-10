// takes the form field value and returns true on valid number
function valid_credit_card(value) {
  // accept only digits, dashes or spaces
	if (/[^0-9-\s]+/.test(value)) return false;

	// The Luhn Algorithm. It's so pretty.
	var nCheck = 0, nDigit = 0, bEven = false;
	value = value.replace(/\D/g, "");

	for (var n = value.length - 1; n >= 0; n--) {
		var cDigit = value.charAt(n),
			  nDigit = parseInt(cDigit, 10);

		if (bEven) {
			if ((nDigit *= 2) > 9) nDigit -= 9;
		}

		nCheck += nDigit;
		bEven = !bEven;
	}

	return (nCheck % 10) == 0;
}

function validateExpDate(date){
	var currentDate = new Date(),
		currentMonth = currentDate.getMonth() + 1,
		currentYear = currentDate.getFullYear(),
		expMonth = Number(date.substr(0,2)),
		expYear = Number(date.substr(3, date.length));

	if( (expYear < currentYear) || (expYear == currentYear && expMonth <= currentMonth)){
		return false;
	}

	return true; 
}

function validateCVV(cvv){
	return cvv.length>2;
}

function getCardType(ccNumber){
	//Define regular expressions
	var cardPatterns={
		visa:/^4[0-9]{12}(?:[0-9]{3})?$/,
		mastercard:/^5[1-5][0-9]{14}$/,
		amex:/^3[47][0-9]{13}$/
	};

	for(var cardPattern in cardPatterns){
		if(cardPatterns[cardPattern].test(ccNumber)){
			return cardPattern;
		}
	}
	return false;
}
/*
* On document ready
*/

$(function(){
	var number = $("#cc-number"),
		expDate = $('#cc-expiration-date'),
		cvv = $('#cc-cvv'),
		paymentButton = $('#submit-payment'),
		ccInputs = $('.cc-input');
		timerInterval = 1000,
		timer=0,
		numberOK=false,
		expDateOK=false,
		cvvOK=false;

	//set the  mask
	number.inputmask('9999 9999 9999 9[999] [999]',{'placeholder':' '});
	expDate.inputmask('mm/yyyy');
	cvv.inputmask('999[9]',{'placeholder':' '});

	number.focus();


	ccInputs.keyup(function(e){
		if(e.keyCode !='9' && e.keyCode !='16'){
			//Keycode not shift+tab and Tab	

			clearTimeout(timer);
			timer = setTimeout(finishTyping, timerInterval, $(this).attr('id'),$(this).val());
		}
		
	});

	ccInputs.keydown(function(e){
		clearTimeout(timer);
	});

	ccInputs.focus(function(){
		$('#title-' + $(this).attr('id')).addClass('active');
	});

	ccInputs.blur(function(){
		$('h2 span').removeClass('active');
	});

	paymentButton.click(function(event){
		event.preventDefault();

		if($(this).hasClass('disabled')){
			return false;
		}

		$('#card-form').submit();
	});

	function finishTyping(id,value){
		var validationValue = value.replace( / /g,'' ),
			cardType = getCardType(validationValue),
			cardClass= (cardType != false)? 'cc-' + cardType :'cc-generic';

		switch(id){
			case 'cc-number':

				if(validationValue.length > 0){
					numberOK = valid_credit_card(validationValue) && getCardType(validationValue);

				}
				console.log('Number: ',numberOK);
				if(numberOK){
					number.removeClass('error');
					$('#cc-expiration-date-container').fadeIn('fast', function(){
						expDate.focus();
					});
					
				}else{
					number.addClass('error');
				}

				//Add cardClass to parent element
				number.parent().attr('class',cardClass);
				break;
			case 'cc-expiration-date':
				//inputmask value not contains mm and yyyy characters
				if(validationValue.indexOf('m') == -1 && validationValue.indexOf('y') == -1){
					expDateOK = validateExpDate(validationValue);
				}
				console.log('expDate:',expDateOK);
				if(expDateOK){
					expDate.removeClass('error');
					$('#cc-cvv-container').fadeIn('fast',function(){
						cvv.focus();
					});
					
				}else{
					expDate.addClass('error');
				}
				break;
			case 'cc-cvv':
				if(validationValue.length>0){
					cvvOK = validateCVV(validationValue);
				}
				console.log('CVV:',cvvOK);
				if(cvvOK){
					cvv.removeClass('error');
					paymentButton.focus();
				}else{
					cvv.addClass('error');
				}
				break;
			default:
				break;
		}

		if(numberOK && expDateOK && cvvOK){
			paymentButton.removeClass('disabled');
		}else{
			paymentButton.addClass('disabled');
		}
	};

});