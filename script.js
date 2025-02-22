const apiToken = '73532256927db281cb8ba852d4a2f8fc73e95428f04b8118300c4adfa74d5dbb';
const ApiUrl = 'https://api.together.xyz/v1/chat/completions';

async function analyzeEmotions() {
    const text = document.getElementById('text-input').value.trim();
    const resultDiv = document.getElementById('result');
    const loadingDiv = document.getElementById('loading');

    if (!text) {
        resultDiv.innerHTML = '<div class="error">❗ Пожалуйста, введите текст для анализа.</div>';
        return;
    }

    loadingDiv.style.display = 'block';
    resultDiv.innerHTML = '';

    const cleanedText = text.replace(/,/g, '');
    const prompt = `Проанализируй текст: '${cleanedText}' и объясни, какие эмоции, тропы и переносные смыслы могут быть связаны с этим текстом. Дай полный литературный анализ.`;

    const data = {
        model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500
    };

    try {
        const response = await fetch(ApiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const responseData = await response.json();
        loadingDiv.style.display = 'none';
        displayEmotions(responseData);
    } catch (error) {
        loadingDiv.style.display = 'none';
        resultDiv.innerHTML = `<div class="error">⚠️ Ошибка: ${error.message}</div>`;
    }
}

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
    const cleanedText = text
        .replace(/[^\p{L}\p{N}\s.,!?\-:]/gu, '')
        .replace(/^\s*[\d\-*•]+\.?\s*/gm, '')
        .trim();

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

function clearText() {
    document.getElementById('text-input').value = '';
    document.getElementById('result').innerHTML = '';
}

async function pasteText() {
    try {
        const text = await navigator.clipboard.readText();
        document.getElementById('text-input').value = text;
    } catch (error) {
        alert('Не удалось вставить текст из буфера обмена.');
    }
}

document.getElementById('analyze-btn').addEventListener('click', analyzeEmotions);
document.getElementById('paste-btn').addEventListener('click', pasteText);
document.getElementById('clear-btn').addEventListener('click', clearText);
