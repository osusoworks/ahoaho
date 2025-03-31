// 修正されたマッチングロジック
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
const questionNumber = document.getElementById('question-number'); // 修正: progressIndicatorの代わりにquestion-numberを使用
const optionsContainer = document.getElementById('options-container');
const prevButton = document.getElementById('prev-button');
const skipButton = document.getElementById('skip-button');
const nextButton = document.getElementById('next-button');
const progressBar = document.getElementById('progress-bar');
const resultsContainer = document.getElementById('results-section'); // 修正: results-containerからresults-sectionに変更
const startMatchingButton = document.getElementById('start-matching'); // 修正: matchingButtonからstart-matchingに変更
const errorContainer = document.getElementById('error-container');
const resultsContent = document.getElementById('results-content'); // 追加: 結果を表示する要素
const restartButton = document.getElementById('restart-button'); // 追加: 再開ボタン

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
            // loadingMessageは使用しない
        } else {
            throw new Error('質問データが見つかりません');
        }
    } catch (error) {
        console.error('エラー:', error);
        const errorMessage = document.getElementById('error-message');
        if (errorMessage) {
            errorMessage.textContent = `エラーが発生しました: ${error.message}`;
        }
        errorContainer.style.display = 'block';
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
    questionNumber.textContent = index + 1; // 修正: progressIndicatorの代わりにquestionNumberを使用
    
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
        startMatchingButton.style.display = 'block'; // 修正: matchingButtonからstartMatchingButtonに変更
    } else {
        startMatchingButton.style.display = 'none'; // 修正: matchingButtonからstartMatchingButtonに変更
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
        if (brandQuestion) { // 追加: brandQuestionがundefinedの場合の対策
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
        }
        
        // 他の質問に対するマッチングスコアを計算
        selectedOptions.forEach((selectedOption, index) => {
            if (!selectedOption) return; // スキップされた質問
            
            const question = questions[index];
            if (!question) return; // 追加: questionがundefinedの場合の対策
            
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
        let matchRate = maxScore > 0 ? Math.max(0, Math.min(100, Math.round((score / maxScore) * 100))) : 0;
        
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
    startMatchingButton.style.display = 'none'; // 追加: マッチングボタンを非表示
    
    // 結果コンテナを表示
    resultsContainer.style.display = 'block';
    
    // 結果をクリア
    resultsContent.innerHTML = ''; // 修正: resultsContainerからresultsContentに変更
    
    // 見つかった時計の数を表示
    const countInfo = document.createElement('p');
    countInfo.className = 'results-summary';
    countInfo.textContent = `合計 ${watches.length} 件の時計が見つかりました（上位5件を表示）`;
    resultsContent.appendChild(countInfo); // 修正: resultsContainerからresultsContentに変更
    
    // 上位5件の時計を表示
    matchedWatches.slice(0, 5).forEach((matchedWatch, index) => {
        const watch = matchedWatch.watch;
        const matchRate = matchedWatch.matchRate;
        const matchedAttributes = matchedWatch.matchedAttributes;
        
        const watchCard = document.createElement('div');
        watchCard.className = 'result-item'; // 修正: watch-cardからresult-itemに変更
        
        // 時計のタイトル
        const title = document.createElement('h3');
        title.textContent = `${index + 1}. ${watch.brand}`;
        watchCard.appendChild(title);
        
        // マッチング率
        const rateSpan = document.createElement('span');
        rateSpan.className = 'match-rate';
        if (matchRate >= 80) {
            rateSpan.classList.add('excellent-match');
        } else if (matchRate >= 60) {
            rateSpan.classList.add('good-match');
        } else if (matchRate >= 40) {
            rateSpan.classList.add('fair-match');
        } else {
            rateSpan.classList.add('poor-match');
        }
        rateSpan.textContent = `マッチ率: ${matchRate}%`;
        watchCard.appendChild(rateSpan);
        
        // 製品詳細リンク
        const detailLink = document.createElement('a');
        detailLink.className = 'product-link';
        detailLink.textContent = '製品詳細を見る';
        detailLink.href = '#';
        detailLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert(`${watch.brand}の詳細ページは準備中です`);
        });
        watchCard.appendChild(detailLink);
        
        // 時計の詳細
        const detailsContainer = document.createElement('div');
        detailsContainer.className = 'watch-details';
        
        // 時計のスペック
        const specsTable = document.createElement('table');
        
        // キャリバー
        const caliberRow = document.createElement('tr');
        caliberRow.innerHTML = `<td>キャリバー</td><td>${watch.caliber || '不明'}</td>`;
        specsTable.appendChild(caliberRow);
        
        // 駆動方式
        const movementRow = document.createElement('tr');
        movementRow.innerHTML = `<td>駆動方式</td><td>${watch.movement || '不明'}</td>`;
        specsTable.appendChild(movementRow);
        
        // 防水性
        const waterResistanceRow = document.createElement('tr');
        waterResistanceRow.innerHTML = `<td>防水性</td><td>${watch.waterResistance || '不明'}</td>`;
        specsTable.appendChild(waterResistanceRow);
        
        // ケース素材
        const caseMaterialRow = document.createElement('tr');
        caseMaterialRow.innerHTML = `<td>ケース素材</td><td>${watch.caseMaterial || '不明'}</td>`;
        specsTable.appendChild(caseMaterialRow);
        
        // バンド素材
        const bandMaterialRow = document.createElement('tr');
        bandMaterialRow.innerHTML = `<td>バンド素材</td><td>${watch.bandMaterial || '不明'}</td>`;
        specsTable.appendChild(bandMaterialRow);
        
        detailsContainer.appendChild(specsTable);
        
        // マッチした属性
        const matchedAttributesContainer = document.createElement('div');
        matchedAttributesContainer.className = 'matched-attributes';
        
        const matchedAttributesTitle = document.createElement('h4');
        matchedAttributesTitle.textContent = 'マッチした属性';
        matchedAttributesContainer.appendChild(matchedAttributesTitle);
        
        const matchedAttributesList = document.createElement('ul');
        
        matchedAttributes.forEach(attr => {
            const attributeItem = document.createElement('li');
            attributeItem.textContent = `${attr.question}: あなたの選択「${attr.userChoice}」が時計の「${attr.watchValue}」とマッチしました`;
            matchedAttributesList.appendChild(attributeItem);
        });
        
        matchedAttributesContainer.appendChild(matchedAttributesList);
        detailsContainer.appendChild(matchedAttributesContainer);
        watchCard.appendChild(detailsContainer);
        
        resultsContent.appendChild(watchCard); // 修正: resultsContainerからresultsContentに変更
    });
    
    // 再開ボタンは既にHTMLに存在するので、イベントリスナーのみ追加
    restartButton.addEventListener('click', restartQuestions);
}

// 質問をやり直す
function restartQuestions() {
    // 選択をリセット
    selectedOptions = [];
    
    // 最初の質問に戻る
    displayQuestion(0);
    updateProgressBar();
    
    // 質問コンテナを表示
    questionContainer.style.display = 'block';
    
    // 結果コンテナを非表示
    resultsContainer.style.display = 'none';
}

// イベントリスナーを設定
document.addEventListener('DOMContentLoaded', () => {
    // 質問データを読み込む
    loadQuestions();
    
    // ボタンのイベントリスナー
    prevButton.addEventListener('click', goToPreviousQuestion);
    skipButton.addEventListener('click', skipQuestion);
    nextButton.addEventListener('click', goToNextQuestion);
    startMatchingButton.addEventListener('click', startMatching); // 修正: matchingButtonからstartMatchingButtonに変更
    
    // エラーOKボタン
    const errorOkButton = document.getElementById('error-ok-button');
    if (errorOkButton) {
        errorOkButton.addEventListener('click', () => {
            errorContainer.style.display = 'none';
        });
    }
});
