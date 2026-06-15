const exprEl = document.getElementById('expr');
const resultEl = document.getElementById('result');
const keys = document.querySelector('.keys');

let expr = '';

function updateDisplay(){
	exprEl.textContent = expr || '0';
	const res = compute(expr);
	resultEl.textContent = (res === null) ? '' : res;
}

function compute(input){
	if(!input) return '';
	// Replace visual operators if any
	const sanitized = input.replace(/×/g,'*').replace(/÷/g,'/');
	// Allow only numbers, operators, parentheses, decimal and percent and spaces
	if(!/^[0-9+\-*/().%\s]+$/.test(sanitized)) return null;
	try{
		const value = Function('return (' + sanitized + ')')();
		if(typeof value === 'number' && isFinite(value)){
			// show up to 10 significant digits, trim trailing zeros
			return parseFloat(value.toPrecision(12)).toString();
		}
		return null;
	}catch(e){
		return null;
	}
}

function pressKey(k){
	if(k === 'clear'){
		expr = '';
		updateDisplay();
		return;
	}
	if(k === 'del'){
		expr = expr.slice(0,-1);
		updateDisplay();
		return;
	}
	if(k === 'equals'){
		const val = compute(expr);
		if(val !== null && val !== ''){
			expr = val;
			updateDisplay();
		}
		return;
	}
	// append normal key
	// Prevent multiple leading zeros
	if(expr === '0' && /[0-9]/.test(k)) expr = k;
	else expr += k;
	updateDisplay();
}

keys.addEventListener('click', (e)=>{
	const btn = e.target.closest('button');
	if(!btn) return;
	const action = btn.dataset.action;
	const key = btn.dataset.key;
	if(action) pressKey(action);
	else if(key) pressKey(key);
});

// Keyboard support
window.addEventListener('keydown', (e)=>{
	if(e.ctrlKey || e.metaKey) return; // ignore shortcuts
	const key = e.key;
	if(/^[0-9]$/.test(key)) { pressKey(key); e.preventDefault(); return; }
	if(key === 'Enter' || key === '='){ pressKey('equals'); e.preventDefault(); return; }
	if(key === 'Backspace'){ pressKey('del'); e.preventDefault(); return; }
	if(key === 'Escape'){ pressKey('clear'); e.preventDefault(); return; }
	if(key === '.') { pressKey('.'); e.preventDefault(); return; }
	if(key === '+' || key === '-' || key === '*' || key === '/' || key === '%' || key === '(' || key === ')'){
		pressKey(key);
		e.preventDefault();
		return;
	}
});

// initialize
updateDisplay();
