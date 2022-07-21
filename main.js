const questions = [
	{
		question: "Какой язык работает в браузере?",
		answers: ["Java", "C", "Python", "JavaScript"],
		correct: 4,
	},
	{
		question: "Что означает CSS?",
		answers: [
			"Central Style Sheets",
			"Cascading Style Sheets",
			"Cascading Simple Sheets",
			"Cars SUVs Sailboats",
		],
		correct: 2,
	},
	{
		question: "Что означает HTML?",
		answers: [
			"Hypertext Markup Language",
			"Hypertext Markdown Language",
			"Hyperloop Machine Language",
			"Helicopters Terminals Motorboats Lamborginis",
		],
		correct: 1,
	},
	{
		question: "В каком году был создан JavaScript?",
		answers: ["1996", "1995", "1994", "все ответы неверные"],
		correct: 2,
	},
];




const titleQuize = document.querySelector('#header'),
	listQuize = document.querySelector('#list'),
	submitQuize = document.querySelector('#submit');


	let score = 0; // кол-во правильных ответов
	let questionIndex = 0; // текущий вопрос


	// get Data

	const getData = async (url) => { 
		const res = await fetch(url);
		const data = await res.json();
		// console.log(data);
		return data;
	}

	// console.log(getData('https://the-trivia-api.com/api/questions?categories=history&limit=5&region=US&difficulty=medium'));

	getData('https://the-trivia-api.com/api/questions?categories=history&limit=5&region=US&difficulty=medium')
		.then((data) =>  {
			console.log(data);
			// data.forEach(item => console.log(item))
			console.log(data[questionIndex].question); 
			renderQuestion(data);
		});



	function clearAnswer() { 
		titleQuize.innerHTML = '';
		listQuize.innerHTML = '';
	}
	clearAnswer();

	function renderQuestion(data) { 

		let answers = [];

		data[questionIndex].incorrectAnswers.forEach((item) => {
			answers.push(item);
		});
		answers.push(data[questionIndex].correctAnswer);

		randomArrayShuffle(answers)

		console.log('data is 0', data[0]);

		titleQuize.innerHTML =  `
		<h2 class="title">${data[questionIndex].question}</h2>
		` ;		

		answers.forEach((item, index) =>  {
			listQuize.innerHTML += `
				<li>
					<label>
						<input value = ${index+1} type="radio" class="answer" name="answer" />
						<span>${item}</span>
					</label>
				</li>
			`;
		});

		data[questionIndex];
	}

	

	function checkAnswer() { 
		
		const inputQuize = listQuize.querySelector('input[type="radio"]:checked');

		if(!inputQuize && questionIndex !== questions.length-1) { 
			alert('Пожалуйста выберите 1 вариант ответа')
			submitQuize.blur();
		}

		if(+inputQuize.value === questions[questionIndex].correct) {
			console.log('done correct')
			score++;
			console.log(score)
		}
		
		if(questionIndex !== questions.length-1) { 
			questionIndex++;
			clearAnswer();
			getData('https://the-trivia-api.com/api/questions?categories=history&limit=5&region=US&difficulty=medium')
				.then((data) =>  {
				console.log(data);
				// data.forEach(item => console.log(item))
				console.log(data[questionIndex].question); 
				renderQuestion(data);
		});
		}else {
			clearAnswer();
			showResults();
		}

		console.log();

	}

	function showResults() { 

		let title, message, result;

		if(score === questions.length) { 
			title = 'Поздравляем'
			message = 'Вы ответили на все вопросы'
		}else if ((score * 100) / questions.length >=70) { 
			title = 'Неплохой результат';
			message = `Вы ответили на ${(score * 100) / questions.length}%`;
		}else{ 
			title = 'Вам стоит постараться'
			message = `Вы ответили на ${(score * 100) / questions.length}%`;
		}

		result = `${score} из ${questions.length}`
		
		const resultTemplate = `
		<h2 class="title">${title}</h2>
		<h3 class="summary">${message}</h3>
		<p class="result">${result}</p>
		`;

		submitQuize.textContent = 'Пробовать снова'
		submitQuize.blur();
		submitQuize.onclick = function() { 
			history.go();
		};
		console.log(score);

		titleQuize.innerHTML = resultTemplate;
	}

	submitQuize.addEventListener('click', () =>  {
		

		checkAnswer();

	});



	function randomArrayShuffle(array) {
		let currentIndex = array.length, temporaryValue, randomIndex;
		while (0 !== currentIndex) {
		  randomIndex = Math.floor(Math.random() * currentIndex);
		  currentIndex -= 1;
		  temporaryValue = array[currentIndex];
		  array[currentIndex] = array[randomIndex];
		  array[randomIndex] = temporaryValue;
		}
		return array;
	  }