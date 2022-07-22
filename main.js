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
	submitQuize = document.querySelector('#submit'),
	loader = document.querySelector('.loader'),
	game = document.querySelector('.quiz'),
	categories = document.querySelector('#category');
	

	let score = 0; // кол-во правильных ответов
	let questionIndex = 0; // текущий вопрос

	let url ='https://the-trivia-api.com/api/questions?categories=history&limit=5&region=US&difficulty=medium';
	

	
	function renderCategory() { 
		const category = ['History', 'Music', 'Science', 'Geography'];

		category.forEach((item, index) => {
			categories.innerHTML += `
			<option classs='category-option' value="${index}">${item}</option>
			`;
		});

	}
	renderCategory();

	
	function chooseCategory() { 

		switch(categories.value) { 
			case '0': 
			getData()
				.then(()=>  {

				});
			break;
			case '1': 
			url ='https://the-trivia-api.com/api/questions?categories=music&limit=5&region=US&difficulty=medium'
			getData(url)
				.then((data)=>  {
					renderQuestion(data);			
				})
				.catch((error)=>  {
					console.error(error);
				});
			break;
			case '2': 
			url ='https://the-trivia-api.com/api/questions?categories=science&limit=5&region=US&difficulty=medium'
			getData(url)
				.then((data)=>  {
					renderQuestion(data);			
				})
				.catch((error)=>  {
					console.error(error);
				});
			break;
			case '3': 
			url ='https://the-trivia-api.com/api/questions?categories=geography&limit=5&region=US&difficulty=medium'
			getData(url)
				.then((data)=>  {
					renderQuestion(data);			
				})
				.catch((error)=>  {
					console.error(error);
				});
			break;
			case '4': 
			console.log('Запрсо на сервер')
			break;
		}
	}
	;
	categories.addEventListener('change', chooseCategory);
	
	// get Data
	

	const getData = async (url) => { 
		const res = await fetch(url);
		const data = await res.json();
		if(!res.ok) { 
			throw new Error(`could not fetch ${url} status ${res.status}`);
		}
		// console.log(data);
		return data;
	};

	// let Data = getData(url)
	// 	.then((data) =>  {
	// 		console.log(data)
	// 		return data;
	// 	})

	// console.log(Data);

	console.log('url is ', url)

	getData(url)
		.then((data) =>  {
			// console.log(data);
			// data.forEach(item => console.log(item))
			// console.log(data[questionIndex].question); 
			renderQuestion(data);
			
			game.classList.remove('hidden');
			loader.classList.add('hidden');
		})
		.catch((error)=> {
			console.error(error);
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

		// console.log('data is 0', data[0]);

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
		console.log(inputQuize.nextElementSibling.textContent)
		getData(url)

			.then((data) =>  {

				if(!inputQuize && questionIndex !== data.length-1) { 
					alert('Пожалуйста выберите 1 вариант ответа')
					submitQuize.blur();
				}
		
				if(inputQuize.nextElementSibling.textContent === data[questionIndex].correctAnswer) {
					console.log('done correct')
					score++;
					console.log(score)
				}

				if(questionIndex !== data.length-1) { 
					questionIndex++;
					clearAnswer();	
		
					getData(url)
					// loader.classList.remove('hidden')
					.then((data) =>  {			
						// game.parentNode.appendChild(loader);
						renderQuestion(data);
					});
					
				}else {
					clearAnswer();
					showResults();
				}
				
				
				return data;
			})
			.catch((error)=> { 
				console.error(error);
			});
	}

	function showResults() { 

		getData(url)
		.then((data) =>  {
				let title, message, result;
				console.log('data IS', data)
				console.log('data.length IS', data.length)
				if(score === data.length) { 
					title = 'Congratulations'
					message = 'You answered all the questions'
				}else if ((score * 100) / data.length >=70) { 
					title = 'Not bad result';
					message = `You answered ${(score * 100) / data.length}%`;
				}else{ 
					title = 'You should try'
					message = `You answered ${(score * 100) / data.length}%`;
				}
				
				result = `${score} из ${data.length}`;
				
				const resultTemplate = `
			<h2 class="title">${title}</h2>
			<h3 class="summary">${message}</h3>
			<p class="result">${result}</p>
			`;

			submitQuize.textContent = 'Try again';
			submitQuize.blur();
			submitQuize.onclick = function() { 
				history.go();
			};
			console.log(score);

			titleQuize.innerHTML = resultTemplate;
			
			
		});
		
			
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


	// function printerError(s) {
	// 	let currentArr = [...s];
	// 	let correct =  'abcdefghijklm';
	// 	let correctArr = [...correct];

	// 	console.log('splite is', s.split(''));
	// 	console.log('spread', currentArr);

	// 	let pop = currentArr.filter(i => !correctArr.includes(i))
	// 		.concat(currentArr.filter(i=>!currentArr.includes(i)));

	// 		console.log(pop)
	// 		// pop
	// 		// [
	// 		// 	'x', 'y', 'y',
	// 		// 	'w', 'w', 'w',
	// 		// 	'w', 'w', 'с'
	// 		// ]
	// 		// 

	// 	return `${pop.length}/${s.length}`;
		
	// }
	// console.log(printerError('aaaxbbbbyyhwawiwjjjwwmс')); 

	// [ТекущиеЭлементыВМассиве].идтиПоНимФильтром.(ВозвращаяЭлементКоторогоНетВ[ПравильномМассиве])