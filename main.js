
const titleQuize = document.querySelector('#header'),
	listQuize = document.querySelector('#list'),
	submitQuize = document.querySelector('#submit'),
	loader = document.querySelector('.loader'),
	game = document.querySelector('.quiz'),
	categories = document.querySelector('#category'),
	progressText = document.querySelector('.quiz-bar-text'),
	progressBarFull = document.querySelector('.quiz-progress-bar-full');
	

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
			url ='https://the-trivia-api.com/api/questions?categories=history&limit=5&region=US&difficulty=medium'
			getData(url)
			.then((data)=>  {
					clearAnswer();
					renderQuestion(data);	
				})
				.catch((error)=>  {
					console.error(error)
				});
			break;
			case '1': 
			url ='https://the-trivia-api.com/api/questions?categories=music&limit=5&region=US&difficulty=medium'
			getData(url)
				.then((data)=>  {
					clearAnswer();
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
					clearAnswer();
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
					clearAnswer();
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
	
		return data;
	};
	console.log('url is ', url)

	getData(url)
		.then((data) =>  {
			console.log(data);
			console.log('data[questionIndex].correctAnswer', data[questionIndex].correctAnswer);
			// data.forEach(item => console.log(item))
			// console.log(data[questionIndex].question); 
			renderQuestion(data);
			// checkAnswer();
			
			submitQuize.addEventListener('click', () =>  {
				checkAnswer(data);

			});

			game.classList.remove('hidden');
			loader.classList.add('hidden');
		})
		.catch((error)=> {
			console.error(error);
		});

	// console.log(getData());
	
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
		//progress bur 
		questionIndex++;
		progressText.innerHTML = `Question ${questionIndex}/${data.length-1}`;
		console.log(`${(questionIndex / data.length) * 100}`);
		progressBarFull.style.width = `${(questionIndex / data.length) * 100}%`;

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
		submitQuize.blur();
		data[questionIndex];
	}

	function checkAnswer(data) { 
		
		const inputQuize = listQuize.querySelector('input[type="radio"]:checked');
		// console.log(inputQuize.nextElementSibling.textContent);
		console.log('data ISSSS', data);

			if(!inputQuize && questionIndex !== data.length-1) { 
				alert('Pleace select 1 answer')
				submitQuize.blur();
				return;
			}
			console.log(data);
			

			if(inputQuize.nextElementSibling.textContent === data[questionIndex].correctAnswer) {
				console.log('done correct')
				score++;
				console.log(score)
			}

			if(questionIndex !== data.length-1) { 
				
				clearAnswer();	
				renderQuestion(data);
				
			}else {
				
				clearAnswer();
				showResults();
			}
			
			
			return data;
			
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
				}else if ((score * 100) / data.length >= 70) { 
					title = 'Not bad result';
					message = `You answered ${(score * 100) / data.length}%`;
				}else{ 
					title = 'You should try'
					message = `You answered ${(score * 100) / data.length}%`;
				}
				
				result = `${score} of ${data.length-1}`;
				
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
			console.log(`${(questionIndex / data.length) * 100}`);
			questionIndex++;
			progressBarFull.style.width = `${(questionIndex / data.length) * 100}%`;
		});
		
			
	}

	



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



	//   const reverseSeq = n => {
	// 	// return n > 0 ? n-- : n.split("") ;
	// 	let res = [];
	// 	while(n>0) { 
	// 		res.push(n--);
	// 	}
	// 	return res;
	//   };

	//   console.log(reverseSeq(5));
	
	//   function areYouPlayingBanjo(name) {
	// 	let play =`${name} plays banjo`;
	// 	let dose =`${name} does not play banjo`;
	// 		for(let i = 0; i<name.length; i++) { 
	// 		let ap =  name[i] === 'R' ||  name[i] === 'r' ?  play : dose ;
	// 		//   if(name[i] === 'R' ||  name[i] === 'r') { 
	// 		// 	return play
	// 		//   }else {
	// 		// 	return dose
	// 		//   }
	// 		return ap
	// 		}
		
	//   }
	//   console.log(areYouPlayingBanjo('Robvert'));

	//   function invert(array) {
	// 	return array.map((item) => -item );
	// }
	//  console.log(invert([1,2,-3,4,5])) ;

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