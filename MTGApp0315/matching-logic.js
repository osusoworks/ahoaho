// ブランド名に基づいて画像を表示するための修正版JavaScriptコード

// 質問データを読み込む
let questions = [];
let watches = [];
let currentQuestionIndex = 0;
let selectedOptions = [];
let progressBar;
let questionContainer;
let questionTitle;
let optionsContainer;
let prevButton;
let nextButton;
let skipButton;
let resultContainer;

// ブランドごとの画像マッピング
const brandImages = {
  'Seiko': 'watch_images/brands/seiko_presage.jpeg',
  'SEIKO': 'watch_images/brands/seiko_presage.jpeg',
  'セイコー': 'watch_images/brands/seiko_presage.jpeg',
  'Sセレクション': 'watch_images/brands/seiko_5sports.jpeg',
  'PROSPEX': 'watch_images/brands/seiko_prospex.jpeg',
  'PRESAGE': 'watch_images/brands/seiko_presage.jpeg',
  'ASTRON': 'watch_images/brands/seiko_astron.jpeg',
  'KING SEIKO': 'watch_images/brands/seiko_king.jpeg',
  '5 SPORTS': 'watch_images/brands/seiko_5sports.jpeg',
  'COUTURA': 'watch_images/brands/seiko_coutura.jpeg',
  'Citizen': 'watch_images/brands/citizen_axiom.webp',
  'CITIZEN': 'watch_images/brands/citizen_axiom.webp',
  'シチズン': 'watch_images/brands/citizen_axiom.webp',
  'CITIZEN COLLECTION': 'watch_images/brands/citizen_axiom.webp',
  'ATTESA': 'watch_images/brands/citizen_axiom.webp',
  'EXCEED': 'watch_images/brands/citizen_axiom.webp',
  'PROMASTER': 'watch_images/brands/citizen_axiom.webp',
  'xC': 'watch_images/brands/citizen_axiom.webp',
  'Wicca': 'watch_images/brands/citizen_axiom.webp',
  'WICCA': 'watch_images/brands/citizen_axiom.webp',
  'ウィッカ': 'watch_images/brands/citizen_axiom.webp',
  'Casio': 'watch_images/brands/citizen_axiom.webp',
  'CASIO': 'watch_images/brands/citizen_axiom.webp',
  'カシオ': 'watch_images/brands/citizen_axiom.webp',
  'G-SHOCK': 'watch_images/brands/citizen_axiom.webp',
  'BABY-G': 'watch_images/brands/citizen_axiom.webp',
  'OCEANUS': 'watch_images/brands/citizen_axiom.webp',
  'EDIFICE': 'watch_images/brands/citizen_axiom.webp',
  'SHEEN': 'watch_images/brands/citizen_axiom.webp'
};

// 時計画像を取得する関数
function getWatchImage(watch) {
  // 1. 時計のimage_urlまたはthumbnail_urlが有効な場合はそれを使用
  if (watch.image_url && watch.image_url !== '') {
    return watch.image_url;
  }
  if (watch.thumbnail_url && watch.thumbnail_url !== '') {
    return watch.thumbnail_url;
  }
  
  // 2. ブランド名に基づいて画像を選択
  if (watch.brand && brandImages[watch.brand]) {
    return brandImages[watch.brand];
  }
  
  // 3. attributes.ブランド配列に基づいて画像を選択
  if (watch.attributes && watch.attributes.ブランド) {
    for (const brand of watch.attributes.ブランド) {
      if (brandImages[brand]) {
        return brandImages[brand];
      }
    }
  }
  
  // 4. デフォルト画像を返す
  return 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22286%22%20height%3D%22180%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20286%20180%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5f25a9e7%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5f25a9e7%22%3E%3Crect%20width%3D%22286%22%20height%3D%22180%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22106.6640625%22%20y%3D%2296.3%22%3E%E7%94%BB%E5%83%8F%E6%BA%96%E5%82%99%E4%B8%AD%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
}

// データを読み込む
fetch('final_app_data.json')
  .then(response => response.json())
  .then(data => {
    questions = data.questions;
    watches = data.watches;
    initializeApp();
  })
  .catch(error => {
    console.error('データの読み込みに失敗しました:', error);
    document.getElementById('error-container').style.display = 'block';
    document.getElementById('error-message').textContent = 'データの読み込みに失敗しました: ' + error.message;
  });

function initializeApp() {
  progressBar = document.getElementById('progress-bar');
  questionContainer = document.getElementById('question-container');
  questionTitle = document.getElementById('question-title');
  optionsContainer = document.getElementById('options-container');
  prevButton = document.getElementById('prev-button');
  nextButton = document.getElementById('next-button');
  skipButton = document.getElementById('skip-button');
  resultContainer = document.getElementById('result-container');

  // 初期状態の設定
  updateProgressBar();
  showQuestion(currentQuestionIndex);

  // イベントリスナーの設定
  prevButton.addEventListener('click', showPreviousQuestion);
  nextButton.addEventListener('click', showNextQuestion);
  skipButton.addEventListener('click', skipQuestion);
}

function updateProgressBar() {
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  progressBar.style.width = `${progress}%`;
  document.getElementById('question-number').textContent = `${currentQuestionIndex + 1}`;
}

function showQuestion(index) {
  if (index < 0 || index >= questions.length) {
    return;
  }

  const question = questions[index];
  questionTitle.textContent = question.text;
  optionsContainer.innerHTML = '';

  question.options.forEach((option, optionIndex) => {
    const optionElement = document.createElement('div');
    optionElement.className = 'option';
    
    // 選択済みのオプションにはselectedクラスを追加
    if (selectedOptions[index] && selectedOptions[index].index === optionIndex) {
      optionElement.classList.add('selected');
    }
    
    optionElement.textContent = option.text;
    optionElement.addEventListener('click', () => selectOption(optionIndex, option));
    optionsContainer.appendChild(optionElement);
  });

  // ボタンの状態を更新
  prevButton.disabled = index === 0;
  nextButton.disabled = !selectedOptions[index];
  
  // 最後の質問の場合、「次へ」ボタンのテキストを「結果を表示」に変更
  if (index === questions.length - 1) {
    nextButton.textContent = '結果を表示';
  } else {
    nextButton.textContent = '次へ';
  }
  
  // 質問コンテナを表示、結果コンテナを非表示
  questionContainer.style.display = 'block';
  resultContainer.style.display = 'none';
}

function selectOption(optionIndex, option) {
  // 現在の質問に対する選択を保存
  selectedOptions[currentQuestionIndex] = {
    index: optionIndex,
    text: option.text,
    value: option.value
  };
  
  // オプションの表示を更新
  const optionElements = optionsContainer.querySelectorAll('.option');
  optionElements.forEach((element, index) => {
    if (index === optionIndex) {
      element.classList.add('selected');
    } else {
      element.classList.remove('selected');
    }
  });
  
  // 次へボタンを有効化
  nextButton.disabled = false;
}

function showPreviousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    updateProgressBar();
    showQuestion(currentQuestionIndex);
  }
}

function showNextQuestion() {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    updateProgressBar();
    showQuestion(currentQuestionIndex);
  } else {
    showResults();
  }
}

function skipQuestion() {
  // 現在の質問をスキップ（選択をクリア）
  selectedOptions[currentQuestionIndex] = null;
  
  // 次の質問へ
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    updateProgressBar();
    showQuestion(currentQuestionIndex);
  } else {
    showResults();
  }
}

function showResults() {
  // マッチング処理
  const matchedWatches = findMatchingWatches();
  
  // 結果の表示
  displayResults(matchedWatches);
  
  // 質問コンテナを非表示、結果コンテナを表示
  questionContainer.style.display = 'none';
  resultContainer.style.display = 'block';
}

function findMatchingWatches() {
  // 各時計に対してスコアを計算
  const watchScores = watches.map(watch => {
    let score = 0;
    let matchedAttributes = [];
    
    // 選択された各オプションについて
    selectedOptions.forEach((selectedOption, questionIndex) => {
      if (!selectedOption) return; // スキップされた質問
      
      const question = questions[questionIndex];
      
      // ブランド選択の特別処理
      if (question.id === 'brand') {
        const selectedBrand = selectedOption.text;
        let brandMatch = false;
        
        // attributes.ブランド配列でのマッチをチェック
        if (watch.attributes && watch.attributes.ブランド) {
          brandMatch = watch.attributes.ブランド.some(brand => 
            brand.toLowerCase() === selectedBrand.toLowerCase()
          );
        }
        
        // ブランドが一致する場合は大きなボーナスを追加
        if (brandMatch) {
          score += 500;
          matchedAttributes.push({
            type: 'ブランド',
            userSelection: selectedBrand,
            watchValue: watch.attributes.ブランド.join(', ')
          });
        } else {
          // ブランドが一致しない場合は大きなペナルティを適用
          score -= 1000;
        }
        return;
      }
      
      // その他の属性のマッチング
      if (watch.attributes && watch.attributes[question.id]) {
        const watchAttributes = Array.isArray(watch.attributes[question.id]) 
          ? watch.attributes[question.id] 
          : [watch.attributes[question.id]];
        
        const matchValue = selectedOption.value || selectedOption.text;
        
        if (watchAttributes.some(attr => attr === matchValue)) {
          score += 100;
          matchedAttributes.push({
            type: question.id,
            userSelection: selectedOption.text,
            watchValue: watchAttributes.join(', ')
          });
        }
      }
    });
    
    // マッチング率の計算（最大100%）
    let matchRate = Math.min(Math.max(score / 1000, 0), 1) * 100;
    
    // ブランドペナルティが適用された場合はマッチング率を最大50%に制限
    if (score < 0) {
      matchRate = Math.min(matchRate, 50);
    }
    
    return {
      watch,
      score,
      matchRate: Math.round(matchRate),
      matchedAttributes
    };
  });
  
  // スコアの高い順にソート
  return watchScores.sort((a, b) => b.score - a.score);
}

function displayResults(matchedWatches) {
  resultContainer.innerHTML = '';
  
  // 結果のヘッダー
  const resultHeader = document.createElement('h2');
  resultHeader.textContent = 'あなたにおすすめの腕時計';
  resultContainer.appendChild(resultHeader);
  
  // 見つかった時計の数
  const resultCount = document.createElement('p');
  resultCount.textContent = `合計 ${watches.length} 件の時計が見つかりました（上位5件を表示）`;
  resultContainer.appendChild(resultCount);
  
  // 上位5件の時計を表示
  matchedWatches.slice(0, 5).forEach((result, index) => {
    const watch = result.watch;
    
    // 時計コンテナ
    const watchContainer = document.createElement('div');
    watchContainer.className = 'watch-result';
    
    // 時計のタイトル
    const watchTitle = document.createElement('h3');
    watchTitle.textContent = `${index + 1}. ${watch.brand || '不明なブランド'}`;
    watchContainer.appendChild(watchTitle);
    
    // マッチング率
    const matchRate = document.createElement('div');
    matchRate.className = 'match-rate';
    matchRate.textContent = `マッチ率: ${result.matchRate}%`;
    watchContainer.appendChild(matchRate);
    
    // 時計の詳細情報と画像を表示するコンテナ
    const watchDetailsContainer = document.createElement('div');
    watchDetailsContainer.className = 'watch-details-container';
    
    // 時計の画像
    const watchImageContainer = document.createElement('div');
    watchImageContainer.className = 'watch-image-container';
    
    const watchImage = document.createElement('img');
    watchImage.className = 'watch-image';
    watchImage.src = getWatchImage(watch);
    watchImage.alt = watch.brand || '時計の画像';
    watchImage.onerror = function() {
      this.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22286%22%20height%3D%22180%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20286%20180%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5f25a9e7%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5f25a9e7%22%3E%3Crect%20width%3D%22286%22%20height%3D%22180%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22106.6640625%22%20y%3D%2296.3%22%3E%E7%94%BB%E5%83%8F%E6%BA%96%E5%82%99%E4%B8%AD%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
    };
    watchImageContainer.appendChild(watchImage);
    
    // 製品詳細ボタン
    const detailsButton = document.createElement('a');
    detailsButton.className = 'details-button';
    detailsButton.textContent = '製品詳細を見る';
    detailsButton.href = watch.url || '#';
    if (!watch.url) {
      detailsButton.classList.add('disabled');
    }
    watchImageContainer.appendChild(detailsButton);
    
    watchDetailsContainer.appendChild(watchImageContainer);
    
    // 時計の詳細情報
    const watchInfo = document.createElement('div');
    watchInfo.className = 'watch-info';
    
    // 詳細情報のテーブル
    const detailsTable = document.createElement('table');
    detailsTable.className = 'details-table';
    
    // 詳細情報の項目
    const details = [
      { label: 'キャリバー', value: watch.details && watch.details.caliber },
      { label: '駆動方式', value: watch.details && watch.details.drive_system },
      { label: '防水性', value: watch.details && watch.details.water_resistance },
      { label: 'ケース素材', value: watch.details && watch.details.case_material },
      { label: 'バンド素材', value: watch.details && watch.details.band_material }
    ];
    
    details.forEach(detail => {
      if (detail.value) {
        const row = document.createElement('tr');
        
        const labelCell = document.createElement('td');
        labelCell.className = 'detail-label';
        labelCell.textContent = detail.label;
        row.appendChild(labelCell);
        
        const valueCell = document.createElement('td');
        valueCell.className = 'detail-value';
        valueCell.textContent = detail.value;
        row.appendChild(valueCell);
        
        detailsTable.appendChild(row);
      }
    });
    
    watchInfo.appendChild(detailsTable);
    
    // マッチした属性
    if (result.matchedAttributes.length > 0) {
      const matchedAttributesTitle = document.createElement('h4');
      matchedAttributesTitle.textContent = 'マッチした属性';
      watchInfo.appendChild(matchedAttributesTitle);
      
      const matchedAttributesList = document.createElement('ul');
      matchedAttributesList.className = 'matched-attributes';
      
      result.matchedAttributes.forEach(attr => {
        const listItem = document.createElement('li');
        listItem.textContent = `${attr.type}: あなたの選択「${attr.userSelection}」が時計の「${attr.watchValue}」とマッチしました`;
        matchedAttributesList.appendChild(listItem);
      });
      
      watchInfo.appendChild(matchedAttributesList);
    }
    
    watchDetailsContainer.appendChild(watchInfo);
    watchContainer.appendChild(watchDetailsContainer);
    resultContainer.appendChild(watchContainer);
  });
  
  // 再検索ボタン
  const restartButton = document.createElement('button');
  restartButton.id = 'restart-button';
  restartButton.textContent = '再検索する';
  restartButton.addEventListener('click', restartQuiz);
  resultContainer.appendChild(restartButton);
}

function restartQuiz() {
  // 選択をリセット
  selectedOptions = [];
  currentQuestionIndex = 0;
  
  // 最初の質問を表示
  updateProgressBar();
  showQuestion(currentQuestionIndex);
  
  // 質問コンテナを表示、結果コンテナを非表示
  questionContainer.style.display = 'block';
  resultContainer.style.display = 'none';
}
