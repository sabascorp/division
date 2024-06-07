document.addEventListener('DOMContentLoaded', function() {
    // Obtiene los elementos del DOM
    var countdownDisplay = document.getElementById('countdown');
    var progressBar = document.getElementById('progressBar');
    var answerInput = document.getElementById('answer');
    var resultDisplay = document.getElementById('result');
    var startButton = document.getElementById('startButton');
    var resetButton = document.getElementById('resetButton');
    var leaderboardBody = document.getElementById('leaderboardBody');
    var userNameInput = document.getElementById('userNameInput');
    var submitNameButton = document.getElementById('submitNameButton');
    var leaderboardCaption = document.getElementById('leaderboardCaption');
    var nameInputContainer = document.getElementById('nameInputContainer');
    var practiceContainer = document.getElementById('practiceContainer');
    var leaderboard = document.getElementById('leaderboard');
    var correctAnswer;
    var timer;
    var correctCount = 0;
    var wrongCount = 0;
    var totalAttempts = 0;
    var practiceStarted = false;
    var countdownTimer;
    var userName = '';

    // Función para obtener un número aleatorio entre min y max
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Función para mostrar una nueva división
    function showDivision() {
        var divisor = getRandomNumber(1, 12); // Genera un divisor aleatorio del 1 al 12
        correctAnswer = getRandomNumber(1, 12); // Genera un resultado aleatorio del 1 al 12
        var dividend = divisor * correctAnswer; // Calcula el dividendo para que la división sea exacta
        document.getElementById('division').innerText = dividend + ' ÷ ' + divisor;
    }

    // Función para verificar la respuesta del usuario
    function checkAnswer() {
        var userAnswer = parseInt(answerInput.value);
        if (!isNaN(userAnswer)) {
            totalAttempts++;
            if (userAnswer === correctAnswer) {
                correctCount++;
                answerInput.style.backgroundColor = '#c8e6c9'; // Color verde claro para respuesta correcta
            } else {
                wrongCount++;
                answerInput.style.backgroundColor = '#ffcdd2'; // Color rojo claro para respuesta incorrecta
            }
            setTimeout(function() {
                answerInput.style.backgroundColor = '';
            }, 500);
            answerInput.value = '';
            showDivision();
        }
    }

    // Función para iniciar la práctica de divisiones
    function startPractice() {
        if (!practiceStarted) {
            practiceStarted = true;
            showDivision();
            startCountdown();
            answerInput.disabled = false;
            answerInput.focus();
            resetButton.style.display = 'none';
        }
    }

    // Función para reiniciar la práctica
    function resetPractice() {
        clearInterval(timer);
        clearInterval(countdownTimer);
        countdownDisplay.textContent = '';
        resultDisplay.textContent = '';
        correctCount = 0;
        wrongCount = 0;
        totalAttempts = 0;
        practiceStarted = false;
        startButton.disabled = false;
        resetButton.style.display = 'none';
        progressBar.style.width = '100%';
        answerInput.disabled = true;
        answerInput.value = '';
        progressBar.className = 'progress-bar progress-bar-green';
    }

    // Función para mostrar los resultados en la tabla de liderazgo
    function showResults() {
        var currentDate = new Date().toLocaleString();
        var newRow = document.createElement('tr');
        var difference = correctCount - wrongCount;
        var classification = '';
        
        if (difference >= 0 && difference <= 19) {
            classification = 'FP';
        } else if (difference >= 20 && difference <= 29) {
            classification = 'ED';
        } else if (difference >= 30 && difference <= 39) {
            classification = 'TP';
        } else {
            classification = 'CF';
        }

        newRow.innerHTML = '<td>' + currentDate + '</td>' +
                           '<td>' + correctCount + '</td>' +
                           '<td>' + wrongCount + '</td>' +
                           '<td>' + totalAttempts + '</td>' +
                           '<td>' + difference + '</td>' +
                           '<td>' + classification + '</td>';
        leaderboardBody.appendChild(newRow);
    }

    // Función para iniciar el temporizador de cuenta regresiva antes de comenzar la práctica
    function startCountdownTimer() {
        var countdownTime = 5;
        countdownDisplay.textContent = countdownTime;
        startButton.disabled = true;
        countdownTimer = setInterval(function() {
            countdownTime--;
            countdownDisplay.textContent = countdownTime;
            if (countdownTime <= 0) {
                clearInterval(countdownTimer);
                countdownDisplay.textContent = '';
                startPractice();
            }
        }, 1000);
    }

    // Función para iniciar la cuenta regresiva de la práctica
    function startCountdown() {
        var totalTime = 60;
        var intervalDuration = 1000;
        var timeLeft = totalTime;
        var progressBarIncrement = 100 / totalTime;

        timer = setInterval(function() {
            timeLeft--;
            countdownDisplay.textContent = timeLeft;
            updateProgressBar(progressBarIncrement * timeLeft);
            if (timeLeft <= 0) {
                clearInterval(timer);
                countdownDisplay.textContent = '¡Tiempo!';
                document.getElementById('division').textContent = '';
                answerInput.disabled = true;
                showResults();
                resetButton.style.display = 'block';
            }
        }, intervalDuration);
    }

    // Función para actualizar la barra de progreso
    function updateProgressBar(progress) {
        progressBar.style.width = progress + '%';
        if (progress <= 10) {
            progressBar.className = 'progress-bar progress-bar-red';
        } else if (progress <= 50) {
            progressBar.className = 'progress-bar progress-bar-orange';
        } else {
            progressBar.className = 'progress-bar progress-bar-green';
        }
    }

    // Evento para enviar el nombre de usuario
    submitNameButton.addEventListener('click', function() {
        userName = userNameInput.value.trim();
        if (userName !== '') {
            nameInputContainer.style.display = 'none';
            practiceContainer.classList.remove('hidden');
            leaderboard.classList.remove('hidden');
            leaderboardCaption.textContent = `Resultados de ${userName}`;
            startButton.disabled = false;
        }
    });

    // Evento para iniciar la práctica
    startButton.addEventListener('click', startCountdownTimer);

    // Evento para reiniciar la práctica
    resetButton.addEventListener('click', resetPractice);
    resetButton.style.display = 'none';

    // Evento para manejar el envío de respuestas con la tecla Enter
    answerInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            checkAnswer();
        }
    });
});
