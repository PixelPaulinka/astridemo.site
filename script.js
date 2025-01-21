   const apiToken = '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';  // Ваш API токен
    const emotionModelUrl = 'https://api-inference.huggingface.co/models/MaxKazak/ruBert-base-russian-emotion-detection';

    // Функция для отправки запроса на API и получения результата
    function analyzeEmotions() {
        const text = document.getElementById('text-input').value.trim();
        if (!text) {
            document.getElementById('result').innerHTML = '❗ Пожалуйста, введите текст для анализа.';
            return;
        }

        const emotionData = { "inputs": text.toLowerCase() };

        fetch(emotionModelUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emotionData)
        })
        .then(response => response.json())
        .then(data => displayEmotions(data[0]))
        .catch(error => {
            document.getElementById('result').innerHTML = `⚠️ Ошибка.Попробуйте ещё раз`;
        });
    }

    // Функция для отображения результатов
    function displayEmotions(emotions) {
        if (!emotions || emotions.length === 0) {
            document.getElementById('result').innerHTML = '⚠️ Не удалось определить эмоции.Попробуйте ещё раз';
            return;
        }

        let emotionText = '<b>🔍 Распределение эмоций:</b><br>';
        emotions.forEach(emotion => {
            const label = getEmotionLabel(emotion.label);
            const score = (emotion.score * 100).toFixed(2);
            emotionText += `• ${label}: <b>${score}%</b><br>`;
        });
        document.getElementById('result').innerHTML = emotionText;
    }

    // Функция для получения текста метки эмоции
    function getEmotionLabel(label) {
        const emotionLabels = {
            "joy": "😊 Радость",
            "sadness": "😢 Грусть",
            "anger": "😠 Злость",
            "surpise": "😲 Удивление",
            "disgust": "🤢 Отвращение",
            "fear": "😨 Страх",
            "neutral": "😐 Нейтральность",
            "interest": "🤔 Интерес",
            "guilt": "😔 Вина"
        };
        return emotionLabels[label] || label;
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
        });
    }

    // Добавление обработчиков событий для кнопок
    document.getElementById('analyze-btn').addEventListener('click', analyzeEmotions);
    document.getElementById('paste-btn').addEventListener('click', pasteText);
    document.getElementById('clear-btn').addEventListener('click', clearText);

