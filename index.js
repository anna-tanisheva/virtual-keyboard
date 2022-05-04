'use strict';

const HTML = document.querySelector('html');
const HEAD = document.querySelector('head');
const BODY = document.querySelector('body');

let template = `<header class="header">
<div class="container">
	<h1 class="main-header">Virtual Keyboard</h1>
</div>
</header>
<main class="main">
<div class="container">
	<textarea name="output" id="output" cols="30" rows="10" class="output" autofocus></textarea>

	<div class="keyboard-wrapper"></div>
</div>
</main>
<footer class="footer">
<div class="container">
	<div class="footer-git">
		<span class="year">&copy;2022 &nbsp;</span>
		<a href="https://github.com/anna-tanisheva" class="footer-link github" target="_blank">Anna Tanisheva</a>
	</div>
	<a href="#" class="footer-link rs" target="_blank">
		<img src="img/logo-rsschool3.png" alt="school-logo" class="logo">
	</a>
</div>
</footer>`
BODY.innerHTML = template;

//key template
const KEYBOARD = document.querySelector('.keyboard-wrapper');
let serverKeys = ['Tab', 'Backspace', 'Del', 'Shift', 'CapsLock', 'Enter', 'Space', '&#8593', '&#8592', '&#8595', '&#8594'];
let shiftActive = false;

function createKey(value, shiftValue, keyCode, inner) {
	let key = document.createElement('div');
	let keyOverlay = document.createElement('div');
	key.classList.add('key');
	key.setAttribute('data-key', keyCode);
	key.setAttribute('data-value', value);
	key.setAttribute('data-shift-value', shiftValue);
	keyOverlay.classList.add('key-overlay');
	if (inner.length > 1) {
		inner.forEach((elem) => {
			if (elem === inner[0]) {
				let first = document.createElement('span');
				first.innerHTML += elem;
				first.classList.add('inner-first');
				first.classList.add('inner');
				key.append(first);
			} else {
				let second = document.createElement('span');
				second.innerHTML += elem;
				second.classList.add('inner-second');
				second.classList.add('inner');
				key.append(second);
			}
		})
	} else {
		key.classList.add('span2');
		if (key.getAttribute('data-value') === 'Del' || key.getAttribute('data-value') === 'Ctrl-left' || key.getAttribute('data-value') === 'Win' || key.getAttribute('data-value') === 'Alt-left' || key.getAttribute('data-value') === 'Arrow-up' || key.getAttribute('data-value') === 'Alt-right' || key.getAttribute('data-value') === 'Arrow-left' || key.getAttribute('data-value') === 'Arrow-down' || key.getAttribute('data-value') === 'Arrow-right' || key.getAttribute('data-value') === 'Shift-right') {
			key.classList.remove('span2');
			key.classList.add('span1');
		} else if (key.getAttribute('data-value') === 'Space') {
			key.classList.remove('span2');
			key.classList.add('span6');
		} else if (key.getAttribute('data-value') === 'Shift-left') {
			key.classList.remove('span2');
			key.classList.add('span3');
		}
		if (serverKeys.includes(inner[0])) {
			keyOverlay.classList.add('server')
		}
		if (key.getAttribute('data-value') === 'Shift-left' || key.getAttribute('data-value') === 'Shift-right') {
			key.classList.add('shift')
		}
		if (key.getAttribute('data-value') !== 'Space') {
			let first = document.createElement('span');
			first.innerHTML += inner[0];
			first.classList.add('inner');
			key.append(first);
		}
	}
	key.append(keyOverlay)
	return key;
}

function handleClickOnEnter(event) {
	let caretPos = OUTPUT.selectionStart;
	OUTPUT.value =
		OUTPUT.value.substring(0, OUTPUT.selectionStart) +
		"\n" +
		OUTPUT.value.substring(OUTPUT.selectionEnd, OUTPUT.value.length);
	// console.log(OUTPUT.selectionStart, OUTPUT.selectionEnd)
	OUTPUT.selectionStart = caretPos + 1;
	OUTPUT.selectionEnd = caretPos + 1;
}
const handleArrows = (symbol) => {
	let caretPos = OUTPUT.selectionStart
	let temp = document.createElement('div');
	temp.innerHTML = symbol;
	OUTPUT.value =
		OUTPUT.value.substring(0, OUTPUT.selectionStart) +
		temp.childNodes[0].data +
		OUTPUT.value.substring(OUTPUT.selectionEnd, OUTPUT.value.length);
	OUTPUT.selectionStart = caretPos + 1;
	OUTPUT.selectionEnd = caretPos + 1;
}
//fetch keys
let data = []
const QUERY_EN = {
	load: `data/keyboard_en.json`,
	user: null
};
async function fetchKeys(query) {
	const url = query.load;
	const res = await fetch(url);
	const data = await res.json();
	for (let item of data) {
		let key = createKey(item.value, item.shiftValue, item.keyCode, item.inner);
		KEYBOARD.append(key)
	}
}
window.addEventListener('load', () => {
	fetchKeys(QUERY_EN)
})

//event listeners on virtual keyboard

//EL for always focused textarea
const OUTPUT = document.querySelector('.output')
OUTPUT.addEventListener('blur', () => {
	OUTPUT.focus()
})
//EL for keyboard
KEYBOARD.addEventListener('click', (e) => {
	//EL for regular keys
	let caretPos = OUTPUT.selectionStart;

	if (e.target.classList.contains('key-overlay') && !e.target.classList.contains('server')) {
		let clickedKey = e.target.parentNode;
		let dataValue = clickedKey.getAttribute('data-value');
		let dataShiftValue = clickedKey.getAttribute('data-shift-value');
		if (!shiftActive) {
			if (caretPos === OUTPUT.value.length) {
				OUTPUT.value += dataValue
			} else if (caretPos < OUTPUT.value.length) {
				OUTPUT.value = OUTPUT.value.slice(0, caretPos) + dataValue + OUTPUT.value.slice(caretPos)
				OUTPUT.selectionStart = caretPos + 1
				OUTPUT.selectionEnd = caretPos + 1
			}
		} else {
			if (caretPos === OUTPUT.value.length) {
				OUTPUT.value += dataShiftValue
			} else if (caretPos < OUTPUT.value.length) {
				OUTPUT.value = OUTPUT.value.slice(0, caretPos) + dataShiftValue + OUTPUT.value.slice(caretPos)
				OUTPUT.selectionStart = caretPos + 1
				OUTPUT.selectionEnd = caretPos + 1
			}
		}
	}

	//EL for serve keys
	if (e.target.classList.contains('key-overlay') && e.target.classList.contains('server')) {
		let clickedKey = e.target.parentNode;
		let dataValue = clickedKey.getAttribute('data-value');

		if (dataValue === 'Backspace') {
			let caretPos = OUTPUT.selectionStart;
			if (caretPos === 0) {
				return
			}
			if (caretPos === OUTPUT.value.length) {
				OUTPUT.value = OUTPUT.value.slice(0, -1)
			} else if (caretPos < OUTPUT.value.length) {
				OUTPUT.value = OUTPUT.value.split('').filter((data, idx) => idx !== caretPos - 1).join('');
				OUTPUT.selectionStart = caretPos - 1
				OUTPUT.selectionEnd = caretPos - 1
			}
		}

		if (dataValue === 'Tab') {
			OUTPUT.value += `    `
		}
		if (dataValue === 'Del') {
			let caretPos = OUTPUT.selectionStart;
			if (caretPos < OUTPUT.value.length) {
				OUTPUT.value = OUTPUT.value.split('').filter((data, idx) => idx !== caretPos).join('');
				OUTPUT.selectionStart = caretPos
				OUTPUT.selectionEnd = caretPos
			}
		}
		if (dataValue === 'Shift-right' || dataValue === 'Shift-left') {
			!shiftActive ? shiftActive = true : shiftActive = false;
			KEYBOARD.querySelectorAll('.shift').forEach(elem => {
				elem.classList.toggle('key-active')
			})
		}
		if (dataValue === 'CapsLock') {
			!shiftActive ? shiftActive = true : shiftActive = false;
			KEYBOARD.querySelector('[data-value="CapsLock"]').classList.toggle('key-active')
		}
		if (dataValue === 'Enter') {
			handleClickOnEnter(e);
		}
		if (dataValue === 'Space') {
			OUTPUT.value += ' '
		}
		if (dataValue === 'Arrow-left') {
			handleArrows('&#8592')
		}
		if (dataValue === 'Arrow-right') {
			handleArrows('&#8594')

		}
		if (dataValue === 'Arrow-up') {
			handleArrows('&#8593')
		}
		if (dataValue === 'Arrow-down') {
			handleArrows('&#8595')
		}
	}
})



