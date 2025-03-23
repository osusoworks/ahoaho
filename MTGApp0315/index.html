<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>時計マッチングアプリ</title>
    <style>
        /* 基本スタイル */
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif;
            background-color: #f5f5f7;
            color: #333;
            line-height: 1.6;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            margin-top: 20px;
            margin-bottom: 20px;
        }
        
        h1 {
            text-align: center;
            color: #007AFF;
            margin-bottom: 20px;
            font-size: 28px;
        }
        
        /* プログレスバー */
        .progress-container {
            background-color: #f2f2f7;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        
        .progress-steps {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        
        .step {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: #d1d1d6;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            position: relative;
        }
        
        .step.active {
            background-color: #007AFF;
        }
        
        .step.completed {
            background-color: #34C759;
        }
        
        .progress-bar {
            height: 4px;
            background-color: #d1d1d6;
            position: relative;
            margin-top: -15px;
            z-index: -1;
        }
        
        .progress-bar-fill {
            height: 100%;
            background-color: #34C759;
            width: 0%;
            transition: width 0.3s ease;
        }
        
        .progress-text {
            text-align: center;
            margin-top: 10px;
            font-size: 14px;
            color: #666;
        }
        
        /* 質問スタイル */
        .question-container {
            display: none;
            padding: 20px;
            border-radius: 8px;
            background-color: #fff;
            margin-bottom: 20px;
        }
        
        .question-container.active {
            display: block;
            animation: fadeIn 0.5s;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .question-number {
            display: inline-block;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: #007AFF;
            color: white;
            text-align: center;
            line-height: 30px;
            margin-right: 10px;
            font-weight: bold;
        }
        
        .question-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
        }
        
        .option {
            padding: 15px;
            margin-bottom: 10px;
            background-color: #f2f2f7;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .option:hover {
            background-color: #e5e5ea;
        }
        
        .option.selected {
            background-color: #d1e7ff;
            border-left: 4px solid #007AFF;
        }
        
        .skip-question {
            text-align: center;
            margin-top: 20px;
        }
        
        .skip-question a {
            color: #007AFF;
            text-decoration: none;
            font-size: 14px;
            display: inline-block;
            padding: 5px 10px;
            border-radius: 15px;
            background-color: #f2f2f7;
        }
        
        .skip-question a:hover {
            background-color: #e5e5ea;
        }
        
        /* ナビゲーションボタン */
        .navigation {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
        }
        
        .nav-button {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .prev-button {
            background-color: #e5e5ea;
            color: #333;
        }
        
        .prev-button:hover {
            background-color: #d1d1d6;
        }
        
        .next-button, .submit-button {
            background-color: #007AFF;
            color: white;
        }
        
        .next-button:hover, .submit-button:hover {
            background-color: #0062cc;
        }
        
        .submit-button {
            display: none;
        }
        
        /* 結果表示 */
        #results {
            display: none;
            padding: 20px;
        }
        
        .results-header {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .results-header h2 {
            color: #007AFF;
            margin-bottom: 10px;
        }
        
        .results-summary {
            background-color: #f2f2f7;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .result-item {
            border: 1px solid #e5e5ea;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        }
        
        .result-item h3 {
            margin-bottom: 10px;
            color: #333;
        }
        
        .match-rate {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 15px;
            font-weight: bold;
            margin-bottom: 15px;
        }
        
        .excellent-match {
            background-color: #34C759;
            color: white;
        }
        
        .good-match {
            background-color: #5AC8FA;
            color: white;
        }
        
        .fair-match {
            background-color: #FFCC00;
            color: #333;
        }
        
        .poor-match {
            background-color: #FF9500;
            color: white;
        }
        
        .watch-image {
            max-width: 100%;
            height: auto;
            margin: 15px 0;
            border-radius: 8px;
            max-height: 200px;
            object-fit: contain;
        }
        
        .watch-details, .matched-attributes {
            margin-top: 15px;
        }
        
        .watch-details h4, .matched-attributes h4 {
            margin-bottom: 10px;
            color: #666;
            border-bottom: 1px solid #e5e5ea;
            padding-bottom: 5px;
        }
        
        .watch-details table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .watch-details td {
            padding: 5px;
            border-bottom: 1px solid #f2f2f7;
        }
        
        .watch-details td:first-child {
            width: 40%;
            font-weight: bold;
            color: #666;
        }
        
        .matched-attributes ul {
            list-style-type: none;
        }
        
        .matched-attributes li {
            margin-bottom: 8px;
            padding-left: 20px;
            position: relative;
        }
        
        .matched-attributes li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #34C759;
            font-weight: bold;
        }
        
        .product-link {
            display: inline-block;
            padding: 8px 16px;
            background-color: #007AFF;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            margin-bottom: 15px;
            font-weight: bold;
        }
        
        .product-link:hover {
            background-color: #0062cc;
        }
        
        .restart-button {
            display: block;
            width: 100%;
            padding: 15px;
            background-color: #5AC8FA;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            margin-top: 30px;
            transition: all 0.2s ease;
        }
        
        .restart-button:hover {
            background-color: #4aa8d8;
        }
        
        .no-results, .error-message {
            padding: 30px;
            text-align: center;
            background-color: #f2f2f7;
            border-radius: 8px;
            margin-bottom: 20px;
            color: #666;
        }
        
        .error-message {
            background-color: #FFE5E5;
            color: #FF3B30;
        }
        
        /* レスポンシブデザイン */
        @media (max-width: 768px) {
            .container {
                padding: 15px;
                margin: 10px;
                width: auto;
            }
            
            h1 {
                font-size: 24px;
            }
            
            .question-title {
                font-size: 18px;
            }
            
            .option {
                padding: 12px;
            }
            
            .nav-button {
                padding: 10px 20px;
                font-size: 14px;
            }
        }
        
        @media (max-width: 480px) {
            .container {
                padding: 10px;
                margin: 5px;
            }
            
            h1 {
                font-size: 20px;
            }
            
            .progress-container {
                padding: 15px;
            }
            
            .step {
                width: 25px;
                height: 25px;
                font-size: 12px;
            }
            
            .question-title {
                font-size: 16px;
            }
            
            .option {
                padding: 10px;
            }
            
            .nav-button {
                padding: 8px 16px;
                font-size: 14px;
            }
            
            .result-item {
                padding: 15px;
            }
        }
        
        /* タッチデバイス最適化 */
        @media (hover: none) {
            .option {
                padding: 15px;
            }
            
            .option:active {
                background-color: #d1e7ff;
            }
            
            .nav-button {
                padding: 15px 25px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>時計マッチングアプリ</h1>
        
        <!-- プログレスバー -->
        <div class="progress-container">
            <div class="progress-steps">
                <div class="step active" id="step1">1</div>
                <div class="step" id="step2">2</div>
                <div class="step" id="step3">3</div>
            </div>
            <div class="progress-bar">
                <div class="progress-bar-fill" id="progress-fill"></div>
            </div>
            <div class="progress-text" id="progress-text">質問 1 / 10</div>
        </div>
        
        <!-- 質問コンテナ -->
        <div id="questions-container">
            <!-- 質問は動的に生成されます -->
        </div>
        
        <!-- ナビゲーションボタン -->
        <div class="navigation">
            <button class="nav-button prev-button" id="prev-button">前へ</button>
            <button class="nav-button next-button" id="next-button">次へ</button>
            <button class="nav-button submit-button" id="submit-button">マッチング開始</button>
        </div>
        
        <!-- 結果表示 -->
        <div id="results">
            <div class="results-header">
                <h2>あなたにおすすめの時計</h2>
                <p>あなたの回答に基づいて、最適な時計をご紹介します。</p>
            </div>
            <div id="results-content">
                <!-- 結果は動的に生成されます -->
            </div>
            <button class="restart-button" id="restart-button">もう一度やり直す</button>
        </div>
    </div>
    
    <script src="improved-matching-logic.js"></script>
    <script>
        // アプリケーションデータ
        let appData = null;
        let currentQuestionIndex = 0;
        let userAnswers = {};
        
        // DOMが読み込まれたら実行
        document.addEventListener('DOMContentLoaded', function() {
            // データの読み込み
            loadAppData();
            
            // イベントリスナーの設定
            document.getElementById('prev-button').addEventListener('click', goToPreviousQuestion);
            document.getElementById('next-button').addEventListener('click', goToNextQuestion);
            document.getElementById('submit-button').addEventListener('click', submitAnswers);
            document.getElementById('restart-button').addEventListener('click', restartApp);
        });
        
        // アプリケーションデータの読み込み
        function loadAppData() {
            fetch('final_app_data.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('データの読み込みに失敗しました: ' + response.status);
                    }
                    return response.json();
                })
                .then(data => {
                    appData = data;
                    
                    // データの検証
                    if (!appData || !appData.questions || !Array.isArray(appData.questions) || appData.questions.length === 0) {
                        throw new Error('質問データが正しくありません');
                    }
                    
                    if (!appData.watches || !Array.isArray(appData.watches) || appData.watches.length === 0) {
                        throw new Error('時計データが正しくありません');
                    }
                    
                    // 質問の表示
                    renderQuestions();
                    showQuestion(0);
                    updateProgressBar();
                })
                .catch(error => {
                    console.error('データ読み込みエラー:', error);
                    alert('データの読み込み中にエラーが発生しました。ページをリロードしてください。\n' + error.message);
                });
        }
        
        // 質問の表示
        function renderQuestions() {
            const questionsContainer = document.getElementById('questions-container');
            questionsContainer.innerHTML = '';
            
            appData.questions.forEach((question, index) => {
                const questionElement = document.createElement('div');
                questionElement.className = 'question-container';
                questionElement.id = `question-${index}`;
                
                let optionsHTML = '';
                question.options.forEach(option => {
                    optionsHTML += `
                        <div class="option" data-question-id="${question.id}" data-option-id="${option.id}">
                            ${option.text}
                        </div>
                    `;
                });
                
                questionElement.innerHTML = `
                    <div class="question-title">
                        <span class="question-number">${index + 1}</span>
                        ${question.question}
                    </div>
                    <div class="options">
                        ${optionsHTML}
                    </div>
                    <div class="skip-question">
                        <a href="#" class="skip-link" data-question-id="${question.id}">この質問をスキップ</a>
                    </div>
                `;
                
                questionsContainer.appendChild(questionElement);
            });
            
            // オプションのクリックイベント
            const options = document.querySelectorAll('.option');
            options.forEach(option => {
                option.addEventListener('click', function() {
                    const questionId = this.getAttribute('data-question-id');
                    const optionId = this.getAttribute('data-option-id');
                    
                    // 同じ質問の他のオプションから選択状態を削除
                    const siblingOptions = document.querySelectorAll(`.option[data-question-id="${questionId}"]`);
                    siblingOptions.forEach(sib => sib.classList.remove('selected'));
                    
                    // このオプションを選択状態に
                    this.classList.add('selected');
                    
                    // 回答を保存
                    userAnswers[questionId] = optionId;
                });
            });
            
            // スキップリンクのクリックイベント
            const skipLinks = document.querySelectorAll('.skip-link');
            skipLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const questionId = this.getAttribute('data-question-id');
                    
                    // この質問の回答を「指定なし」に設定
                    userAnswers[questionId] = 'no_preference';
                    
                    // 次の質問へ
                    goToNextQuestion();
                });
            });
        }
        
        // 特定の質問を表示
        function showQuestion(index) {
            // インデックスの範囲チェック
            if (index < 0) {
                index = 0;
            } else if (index >= appData.questions.length) {
                index = appData.questions.length - 1;
            }
            
            // 現在の質問を非表示
            const currentQuestion = document.querySelector('.question-container.active');
            if (currentQuestion) {
                currentQuestion.classList.remove('active');
            }
            
            // 新しい質問を表示
            const newQuestion = document.getElementById(`question-${index}`);
            if (newQuestion) {
                newQuestion.classList.add('active');
                currentQuestionIndex = index;
                
                // プログレスバーの更新
                updateProgressBar();
                
                // ボタンの状態更新
                updateNavigationButtons();
                
                // この質問の回答状態を復元
                restoreAnswerState();
            }
        }
        
        // 前の質問へ
        function goToPreviousQuestion() {
            if (currentQuestionIndex > 0) {
                showQuestion(currentQuestionIndex - 1);
            }
        }
        
        // 次の質問へ
        function goToNextQuestion() {
            if (currentQuestionIndex < appData.questions.length - 1) {
                showQuestion(currentQuestionIndex + 1);
            }
        }
        
        // プログレスバーの更新
        function updateProgressBar() {
            const progressText = document.getElementById('progress-text');
            const progressFill = document.getElementById('progress-fill');
            const totalQuestions = appData.questions.length;
            
            // プログレステキストの更新
            progressText.textContent = `質問 ${currentQuestionIndex + 1} / ${totalQuestions}`;
            
            // プログレスバーの更新
            const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;
            progressFill.style.width = `${progressPercentage}%`;
            
            // ステップの更新
            const steps = document.querySelectorAll('.step');
            steps.forEach((step, index) => {
                step.classList.remove('active', 'completed');
                
                if (index === 0 && currentQuestionIndex < Math.floor(totalQuestions / 3)) {
                    step.classList.add('active');
                } else if (index === 1 && currentQuestionIndex >= Math.floor(totalQuestions / 3) && currentQuestionIndex < Math.floor(totalQuestions * 2 / 3)) {
                    step.classList.add('active');
                    steps[0].classList.add('completed');
                } else if (index === 2 && currentQuestionIndex >= Math.floor(totalQuestions * 2 / 3)) {
                    step.classList.add('active');
                    steps[0].classList.add('completed');
                    steps[1].classList.add('completed');
                }
            });
        }
        
        // ナビゲーションボタンの状態更新
        function updateNavigationButtons() {
            const prevButton = document.getElementById('prev-button');
            const nextButton = document.getElementById('next-button');
            const submitButton = document.getElementById('submit-button');
            
            // 前へボタンの状態
            prevButton.disabled = currentQuestionIndex === 0;
            
            // 次へ/送信ボタンの状態
            if (currentQuestionIndex === appData.questions.length - 1) {
                nextButton.style.display = 'none';
                submitButton.style.display = 'block';
            } else {
                nextButton.style.display = 'block';
                submitButton.style.display = 'none';
            }
        }
        
        // 回答状態の復元
        function restoreAnswerState() {
            const currentQuestion = appData.questions[currentQuestionIndex];
            const questionId = currentQuestion.id;
            const savedAnswer = userAnswers[questionId];
            
            if (savedAnswer) {
                const selectedOption = document.querySelector(`.option[data-question-id="${questionId}"][data-option-id="${savedAnswer}"]`);
                if (selectedOption) {
                    selectedOption.classList.add('selected');
                }
            }
        }
        
        // 回答の送信
        function submitAnswers() {
            try {
                // 回答の検証
                if (Object.keys(userAnswers).length === 0) {
                    alert('少なくとも1つの質問に回答してください。');
                    return;
                }
                
                // マッチング処理
                const matchedWatches = matchWatches(userAnswers, appData.watches);
                
                // 質問コンテナを非表示
                document.getElementById('questions-container').style.display = 'none';
                document.querySelector('.navigation').style.display = 'none';
                document.querySelector('.progress-container').style.display = 'none';
                
                // 結果表示
                document.getElementById('results').style.display = 'block';
                displayMatchingResults(matchedWatches, userAnswers);
                
                // ページトップにスクロール
                window.scrollTo(0, 0);
            } catch (error) {
                console.error('マッチング処理エラー:', error);
                alert('マッチング処理中にエラーが発生しました。もう一度お試しください。');
            }
        }
        
        // アプリのリスタート
        function restartApp() {
            // 状態のリセット
            currentQuestionIndex = 0;
            userAnswers = {};
            
            // 選択状態のリセット
            const selectedOptions = document.querySelectorAll('.option.selected');
            selectedOptions.forEach(option => option.classList.remove('selected'));
            
            // 結果を非表示
            document.getElementById('results').style.display = 'none';
            
            // 質問コンテナを表示
            document.getElementById('questions-container').style.display = 'block';
            document.querySelector('.navigation').style.display = 'flex';
            document.querySelector('.progress-container').style.display = 'block';
            
            // 最初の質問を表示
            showQuestion(0);
        }
    </script>
</body>
</html>
