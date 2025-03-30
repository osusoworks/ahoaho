// 改善されたマッチングロジック
// ブランド選択の優先度を大幅に向上させたバージョン

// 質問データを読み込む
let questions = [];
let watches = [];
let currentQuestionIndex = 0;
let selectedOptions = [];
let matchedWatches = [];

// DOM要素
const questionContainer = document.getElementById('question-container');
const questionTitle = document.getElementById('question-title');
const optionsContainer = document.getElementById('options-container');
const prevButton = document.getElementById('prev-button');
const skipButton = document.getElementById('skip-button');
const nextButton = document.getElementById('next-button');
const progressBar = document.getElementById('progress-bar');
const progressIndicator = document.getElementById('progress-indicator');
const resultsContainer = document.getElementById('results-container');
const matchingButton = document.getElementById('matching-button');
const loadingMessage = document.getElementById('loading-message');
const errorContainer = document.getElementById('error-container');

// 質問データを読み込む
async function loadQuestions() {
    try {
        const response = await fetch('final_app_data.json');
        if (!response.ok) {
            throw new Error('質問データの読み込みに失敗しました');
        }
        const data = await response.json();
        questions = data.questions;
        watches = data.watches;
        
        // 最初の質問を表示
        if (questions.length > 0) {
            displayQuestion(0);
            updateProgressBar();
            loadingMessage.style.display = 'none';
        } else {
            throw new Error('質問データが見つかりません');
        }
    } catch (error) {
        console.error('エラー:', error);
        errorContainer.textContent = `エラーが発生しました: ${error.message}`;
        errorContainer.style.display = 'block';
        loadingMessage.style.display = 'none';
    }
}

// 質問を表示する
function displayQuestion(index) {
    if (index < 0 || index >= questions.length) {
        return;
    }
    
    currentQuestionIndex = index;
    const question = questions[index];
    
    questionTitle.textContent = question.title;
    progressIndicator.textContent = index + 1;
    
    // 選択肢をクリア
    optionsContainer.innerHTML = '';
    
    // 選択肢を表示
    question.options.forEach((option, optionIndex) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option.text;
        
        // 選択済みの選択肢をハイライト
        if (selectedOptions[index] && selectedOptions[index].index === optionIndex) {
            optionElement.classList.add('selected');
        }
        
        optionElement.addEventListener('click', () => {
            // 選択肢をハイライト
            document.querySelectorAll('.option').forEach(el => el.classList.remove('selected'));
            optionElement.classList.add('selected');
            
            // 選択肢を保存
            selectedOptions[index] = {
                index: optionIndex,
                text: option.text,
                value: option.value
            };
            
            // 次へボタンを有効化
            nextButton.disabled = false;
        });
        
        optionsContainer.appendChild(optionElement);
    });
    
    // ボタンの状態を更新
    prevButton.disabled = index === 0;
    skipButton.disabled = false;
    nextButton.disabled = !selectedOptions[index];
    
    // 最後の質問の場合、マッチングボタンを表示
    if (index === questions.length - 1) {
        matchingButton.style.display = 'block';
    } else {
        matchingButton.style.display = 'none';
    }
}

// プログレスバーを更新
function updateProgressBar() {
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
}

// 前の質問へ
function goToPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        displayQuestion(currentQuestionIndex - 1);
        updateProgressBar();
    }
}

// 質問をスキップ
function skipQuestion() {
    selectedOptions[currentQuestionIndex] = null;
    goToNextQuestion();
}

// 次の質問へ
function goToNextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        displayQuestion(currentQuestionIndex + 1);
        updateProgressBar();
    }
}

// マッチング処理
function startMatching() {
    // マッチング結果をクリア
    matchedWatches = [];
    
    // 各時計に対してマッチングスコアを計算
    watches.forEach(watch => {
        let score = 0;
        let maxScore = 0;
        let matchedAttributes = [];
        
        // ブランド選択を特別に処理（優先度を大幅に向上）
        const brandQuestion = questions.find(q => q.title === 'ブランド');
        const brandQuestionIndex = questions.indexOf(brandQuestion);
        const selectedBrand = selectedOptions[brandQuestionIndex];
        
        // ブランド選択がある場合
        if (selectedBrand && selectedBrand.text !== '特にこだわらない') {
            // 時計のブランド属性を確認
            const watchBrands = watch.attributes['ブランド'] || [];
            
            // 選択したブランドが時計のブランド属性に含まれているか確認
            const brandMatch = watchBrands.includes(selectedBrand.text);
            
            // ブランドが一致しない場合は大幅なペナルティを適用
            if (!brandMatch) {
                score -= 1000; // 大きなペナルティ
            } else {
                score += 500; // 大きなボーナス
                matchedAttributes.push({
                    question: 'ブランド',
                    userChoice: selectedBrand.text,
                    watchValue: `${selectedBrand.text}, 特にこだわらない`
                });
            }
        }
        
        // 他の質問に対するマッチングスコアを計算
        selectedOptions.forEach((selectedOption, index) => {
            if (!selectedOption) return; // スキップされた質問
            
            const question = questions[index];
            
            // ブランド質問は既に特別処理したのでスキップ
            if (question.title === 'ブランド') return;
            
            maxScore += 10; // 各質問の最大スコア
            
            // 選択肢に対応する時計の属性を取得
            const watchAttributes = watch.attributes[question.title] || [];
            
            // 選択肢が「特にこだわらない」の場合は常にマッチ
            if (selectedOption.text === '特にこだわらない') {
                score += 10;
                matchedAttributes.push({
                    question: question.title,
                    userChoice: selectedOption.text,
                    watchValue: '特にこだわらない'
                });
                return;
            }
            
            // 時計の属性に選択肢が含まれているかチェック
            const attributeMatch = watchAttributes.some(attr => 
                attr.includes(selectedOption.text) || selectedOption.text.includes(attr)
            );
            
            if (attributeMatch) {
                score += 10;
                matchedAttributes.push({
                    question: question.title,
                    userChoice: selectedOption.text,
                    watchValue: watchAttributes.join(', ')
                });
            }
        });
        
        // マッチング率を計算（ブランドペナルティを考慮）
        let matchRate = Math.max(0, Math.min(100, Math.round((score / maxScore) * 100)));
        
        // ブランドペナルティが適用された場合は低いマッチング率に調整
        if (score < 0) {
            matchRate = Math.max(0, Math.min(50, matchRate)); // 最大50%に制限
        }
        
        // マッチング結果を保存
        matchedWatches.push({
            watch: watch,
            score: score,
            matchRate: matchRate,
            matchedAttributes: matchedAttributes
        });
    });
    
    // スコアの高い順にソート
    matchedWatches.sort((a, b) => b.score - a.score);
    
    // 結果を表示
    displayResults();
}

// 結果を表示
function displayResults() {
    // 質問コンテナを非表示
    questionContainer.style.display = 'none';
    
    // 結果コンテナを表示
    resultsContainer.style.display = 'block';
    
    // 結果をクリア
    resultsContainer.innerHTML = '';
    
    // 結果のヘッダーを追加
    const header = document.createElement('h2');
    header.textContent = 'あなたにおすすめの腕時計';
    resultsContainer.appendChild(header);
    
    // 見つかった時計の数を表示
    const countInfo = document.createElement('p');
    countInfo.textContent = `合計 ${watches.length} 件の時計が見つかりました（上位5件を表示）`;
    resultsContainer.appendChild(countInfo);
    
    // 上位5件の時計を表示
    matchedWatches.slice(0, 5).forEach((matchedWatch, index) => {
        const watch = matchedWatch.watch;
        const matchRate = matchedWatch.matchRate;
        const matchedAttributes = matchedWatch.matchedAttributes;
        
        const watchCard = document.createElement('div');
        watchCard.className = 'watch-card';
        
        // 時計のタイトル
        const title = document.createElement('h3');
        title.textContent = `${index + 1}. ${watch.brand}`;
        watchCard.appendChild(title);
        
        // マッチング率
        const rateContainer = document.createElement('div');
        rateContainer.className = 'match-rate-container';
        
        const rateLabel = document.createElement('span');
        rateLabel.className = 'match-rate';
        rateLabel.textContent = `マッチ率: ${matchRate}%`;
        rateContainer.appendChild(rateLabel);
        
        const detailButton = document.createElement('a');
        detailButton.className = 'detail-button';
        detailButton.textContent = '製品詳細を見る';
        detailButton.href = '#';
        detailButton.addEventListener('click', (e) => {
            e.preventDefault();
            // 製品詳細ページへのリンク（実装予定）
            alert(`${watch.brand}の詳細ページは準備中です`);
        });
        rateContainer.appendChild(detailButton);
        
        watchCard.appendChild(rateContainer);
        
        // 時計の詳細
        const detailsContainer = document.createElement('div');
        detailsContainer.className = 'watch-details';
        
        // 時計のスペック
        const specsList = document.createElement('div');
        specsList.className = 'specs-list';
        
        // キャリバー
        const caliber = document.createElement('div');
        caliber.className = 'spec-item';
        caliber.innerHTML = `<span class="spec-label">キャリバー:</span> <span class="spec-value">${watch.caliber || '不明'}</span>`;
        specsList.appendChild(caliber);
        
        // 駆動方式
        const movement = document.createElement('div');
        movement.className = 'spec-item';
        movement.innerHTML = `<span class="spec-label">駆動方式:</span> <span class="spec-value">${watch.movement || '不明'}</span>`;
        specsList.appendChild(movement);
        
        // 防水性
        const waterResistance = document.createElement('div');
        waterResistance.className = 'spec-item';
        waterResistance.innerHTML = `<span class="spec-label">防水性:</span> <span class="spec-value">${watch.waterResistance || '不明'}</span>`;
        specsList.appendChild(waterResistance);
        
        // ケース素材
        const caseMaterial = document.createElement('div');
        caseMaterial.className = 'spec-item';
        caseMaterial.innerHTML = `<span class="spec-label">ケース素材:</span> <span class="spec-value">${watch.caseMaterial || '不明'}</span>`;
        specsList.appendChild(caseMaterial);
        
        // バンド素材
        const bandMaterial = document.createElement('div');
        bandMaterial.className = 'spec-item';
        bandMaterial.innerHTML = `<span class="spec-label">バンド素材:</span> <span class="spec-value">${watch.bandMaterial || '不明'}</span>`;
        specsList.appendChild(bandMaterial);
        
        detailsContainer.appendChild(specsList);
        
        // マッチした属性
        const matchedAttributesContainer = document.createElement('div');
        matchedAttributesContainer.className = 'matched-attributes';
        
        const matchedAttributesTitle = document.createElement('h4');
        matchedAttributesTitle.textContent = 'マッチした属性';
        matchedAttributesContainer.appendChild(matchedAttributesTitle);
        
        matchedAttributes.forEach(attr => {
            const attributeItem = document.createElement('div');
            attributeItem.className = 'attribute-item';
            attributeItem.innerHTML = `<span class="check-mark">✓</span> <span class="attribute-label">${attr.question}:</span> あなたの選択「${attr.userChoice}」が時計の「${attr.watchValue}」とマッチしました`;
            matchedAttributesContainer.appendChild(attributeItem);
        });
        
        detailsContainer.appendChild(matchedAttributesContainer);
        watchCard.appendChild(detailsContainer);
        
        resultsContainer.appendChild(watchCard);
    });
    
    // 再検索ボタン
    const restartButton = document.createElement('button');
    restartButton.className = 'restart-button';
    restartButton.textContent = '質問をやり直す';
    restartButton.addEventListener('click', () => {
        // 選択をリセット
        selectedOptions = [];
        
        // 最初の質問に戻る
        displayQuestion(0);
        updateProgressBar();
        
        // 質問コンテナを表示
        questionContainer.style.display = 'block';
        
        // 結果コンテナを非表示
        resultsContainer.style.display = 'none';
    });
    
    resultsContainer.appendChild(restartButton);
}

// イベントリスナーを設定
document.addEventListener('DOMContentLoaded', () => {
    // 質問データを読み込む
    loadQuestions();
    
    // ボタンのイベントリスナー
    prevButton.addEventListener('click', goToPreviousQuestion);
    skipButton.addEventListener('click', skipQuestion);
    nextButton.addEventListener('click', goToNextQuestion);
    matchingButton.addEventListener('click', startMatching);
});
