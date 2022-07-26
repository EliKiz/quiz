window.addEventListener('DOMContentLoaded', () => { 

	const titleQuize = document.querySelector('#header'),
		listQuize = document.querySelector('#list'),
		submitQuize = document.querySelector('#submit'),
		loader = document.querySelector('.loader'),
		game = document.querySelector('.quiz'),
		categories = document.querySelector('#category'),
		categoriesOption = document.querySelectorAll('.category-option'),
		progressText = document.querySelector('.quiz-bar-text'),
		progressBarFull = document.querySelector('.quiz-progress-bar-full');
		
		
	
		let score = 0; // кол-во правильных ответов
		let questionIndex = 0; // текущий вопрос
	
		let url ='https://the-trivia-api.com/api/questions?categories=history&limit=5&region=US&difficulty=medium';
	
		// === Render category ===
		
		function renderCategory() { 
			const category = ['History', 'Music', 'Science', 'Geography'];
			category.forEach((item, index) => {
				categories.innerHTML += `
				<option classs='category-option' value="${index}">${item}</option>
				`;
			});
		}
		renderCategory();
	
		// === / Render category ===
	
		// === Choose category ===  
	
		function chooseCategory() { 
			switch(categories.value) { 
				case '0': 
				url ='https://the-trivia-api.com/api/questions?categories=history&limit=5&region=US&difficulty=medium'
				getData(url)
				.then((data)=>  {
						reloadPage(data);
					})
					.catch((error)=>  {
						console.error(error);
					});
				break;
				case '1': 
				url ='https://the-trivia-api.com/api/questions?categories=music&limit=5&region=US&difficulty=medium'
				getData(url)
					.then((data)=>  {
						reloadPage(data);
					})
					.catch((error)=>  {
						console.error(error);
					});
				break;
				case '2': 
				url ='https://the-trivia-api.com/api/questions?categories=science&limit=5&region=US&difficulty=medium'
				getData(url)
					.then((data)=>  {
						reloadPage(data);	
					})
					.catch((error)=>  {
						console.error(error);
					});
				break;
				case '3': 
				url ='https://the-trivia-api.com/api/questions?categories=geography&limit=5&region=US&difficulty=medium'
				getData(url)
					.then((data)=>  {
						reloadPage(data);
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
	
		categories.addEventListener('change', chooseCategory);
	
		// === / Choose category ===  
	
		// === Reload page after choose ==
	
		const reloadPage = (data) => { 
			clearAnswer();
			renderQuestion(data);
			document.location.reload();	
		};
		
		// ===  /Reload page after choose ==
	
		// === get Data ===
		
		const getData = async (url) => { 
			const res = await fetch(url);
			const data = await res.json();
			if(!res.ok) { 
				throw new Error(`could not fetch ${url} status ${res.status}`);
			}
		
			return data;
		};
		
	
		getData(url)
			.then((data) =>  {
				renderQuestion(data);
				submitQuize.addEventListener('click', () =>  {
					checkAnswer(data);
				});
				game.classList.remove('hidden');
				loader.classList.add('hidden');
			})
			.catch((error)=> {
				console.error(error);
			});
	
		// === / get Data ===
		
		function clearAnswer() { 
			titleQuize.innerHTML = '';
			listQuize.innerHTML = '';
		}
		clearAnswer();
		// === Render question ===
		
		function renderQuestion(data) { 
			
			let answers = [];
	
			data[questionIndex].incorrectAnswers.forEach((item) => {
				answers.push(item);
			});
			answers.push(data[questionIndex].correctAnswer);
	
			randomArrayShuffle(answers);
			renderProgressBar(data);
			
			titleQuize.innerHTML =  `
			<h2 class="title">${data[questionIndex].question}</h2>
			` ;		
			
			answers.forEach((item, index) =>  {
	
				listQuize.innerHTML += `
					<li>
						<label class = 'choice' data-choice = '${item}' >
							<input value = ${index+1} type="radio" class="answer" name="answer" />
							<span>${item}</span>
						</label>
					</li>
				`;

			});

			// === Checking for the correct answer === 

			listQuize.addEventListener('click', (e) =>{
				const target = e.target;
				console.log(target.parentElement);
				data.forEach(question => {
					let correctAnswer = question.correctAnswer;
					if(correctAnswer === target.getAttribute('data-choice') || correctAnswer === target.textContent ) { 
						console.log('DONE');
						target.parentElement.classList.add('correct');
					}
				});
			
			 });
		
			// === / Checking for the correct answer === 

			submitQuize.blur();
			data[questionIndex];
		}
	
		// === / Render question ===
	
		// === Progress bur ===
	
		function renderProgressBar(data) { 
			
			progressText.innerHTML = `Question ${questionIndex}/${data.length}`;
			// console.log(`${(questionIndex / data.length) * 100}`);
			progressBarFull.style.width = `${(questionIndex / data.length) * 100}%`;
		}
		
		// === / Progress bur ===
	
		// === Check answer === 
		 
		function checkAnswer(data) { 
			const inputQuize = listQuize.querySelector('input[type="radio"]:checked');
			
				if(!inputQuize && submitQuize.textContent !== 'Try again' ) { 
					alert('Pleace select 1 answer');
					submitQuize.blur();
					return;
				}
				if(inputQuize.nextElementSibling.textContent === data[questionIndex].correctAnswer) {
					score++;
				}
				questionIndex++;
				if(questionIndex !== data.length) { 
					clearAnswer();	
					renderQuestion(data);
					
				}else {	
					clearAnswer();
					showResults();
				}
				return data;
				
		}
	
		// ===  / Check answer ===
	
		// === Shoow results === 
	
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
					
					result = `${score} of ${data.length}`;
					
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
				renderProgressBar(data);
			})
			.catch((error) => { 
				console.error(error);
			});
		}
	
		// === /Shoow results === 
	
		// === Get random array ===
	
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
	
		// ===  / Get random array === 
});