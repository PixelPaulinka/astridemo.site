const apiToken = '73532256927db281cb8ba852d4a2f8fc73e95428f04b8118300c4adfa74d5dbb';  // Ваш API токен
const deepseekUrl = 'https://api.together.xyz/v1/chat/completions';

// Функция для отправки запроса на API и получения результата
function analyzeEmotions() {
    const text = document.getElementById('text-input').value.trim();
    const resultDiv = document.getElementById('result');
    const loadingDiv = document.getElementById('loading');

    // Проверка на пустой текст
    if (!text) {
        resultDiv.innerHTML = '<div class="error">❗ Пожалуйста, введите текст для анализа.</div>';
        return;
    }

    // Показываем анимацию загрузки
    loadingDiv.style.display = 'block';
    resultDiv.innerHTML = '';

    // Подготовка текста и запроса
    const cleanedText = text.replace(/,/g, '');
    const prompt = `Проанализируй текст: '${cleanedText}' и объясни, какие эмоции, тропы и переносные смыслы могут быть связаны с этим текстом. Дай полный литературный анализ.`;

    const data = {
        model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',  // Модель для глубокого анализа
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500  // Увеличьте количество токенов для подробного анализа
    };

    // Отправка запроса на API
    fetch(deepseekUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Скрываем анимацию загрузки
        loadingDiv.style.display = 'none';
        displayEmotions(data);
    })
    .catch(error => {
        // Скрываем анимацию загрузки и показываем ошибку
        loadingDiv.style.display = 'none';
        resultDiv.innerHTML = `<div class="error">⚠️ Ошибка: ${error.message}</div>`;
    });
}

// Функция для отображения результатов
function displayEmotions(data) {
    const resultDiv = document.getElementById('result');

    if (!data || !data.choices || data.choices.length === 0) {
        resultDiv.innerHTML = '<div class="error">⚠️ Не удалось провести полный анализ.</div>';
        return;
    }

    const analysisText = data.choices[0].message.content;
    const formattedAnalysis = formatAnalysis(analysisText);

    resultDiv.innerHTML = `
        <div class="analysis-container">
            <h2>📖 Полный анализ текста:</h2>
            ${formattedAnalysis}
        </div>
    `;
}

function formatAnalysis(text) {
    // Сохраняем только базовые символы и структуру
    const cleanedText = text
        .replace(/[^\p{L}\p{N}\s.,!?\-:]/gu, '') // Разрешаем буквы, цифры и базовые знаки
        .replace(/^\s*[\d\-*•]+\.?\s*/gm, '') // Удаляем нумерацию и маркеры
        .trim();

    // Создаем чистую структуру
    return `<div class="text-container">${cleanedText
        .split(/\n\n+/)
        .map(section => {
            const lines = section
                .split('\n')
                .filter(line => line.trim())
                .map(line => line.replace(/^[:]\s*/, ''));

            if (!lines.length) return '';
            
            return `
                <div class="section">
                    ${lines[0] ? `<h3 class="section-title">${lines[0]}</h3>` : ''}
                    ${lines.slice(1).map(line => `
                        <div class="section-line">
                            <div class="decorator"></div>
                            <p>${line}</p>
                        </div>
                    `).join('')}
                </div>
            `;
        })
        .join('')}</div>`;
}
// Функция для очистки текста
function clearText() {
    document.getElementById('text-input').value = '';
    document.getElementById('result').innerHTML = '';
}

// Функция для вставки текста из буфера обмена
function pasteText() {
    navigator.clipboard.readText().then(text => {
        document.getElementById('text-input').value = text;
    }).catch(() => {
        alert('Не удалось вставить текст из буфера обмена.');
    });
}

// Добавление обработчиков событий для кнопок
document.getElementById('analyze-btn').addEventListener('click', analyzeEmotions);
document.getElementById('paste-btn').addEventListener('click', pasteText);
document.getElementById('clear-btn').addEventListener('click', clearText);
