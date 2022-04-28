'use strict';

const HTML = document.querySelector('html');
const HEAD = document.querySelector('head');
const BODY = document.querySelector('body');

let template = `<header>
<div class="container">
	<h1>Virtual Keyboard</h1>
</div>
</header>
<main class="main">
<div class="container">
	<textarea name="output" id="output" cols="30" rows="10" class="output"></textarea>

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



