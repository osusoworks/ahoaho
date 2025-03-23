
/**
 * 時計マッチングアプリのマッチングロジック
 */

/**
 * ユーザーの回答に基づいて時計をマッチングする
 * @param {Object} userAnswers - ユーザーの回答（質問ID: 選択肢ID）
 * @param {Array} watches - 時計データの配列
 * @returns {Array} マッチングスコアでソートされた時計のリスト
 */
function matchWatches(userAnswers, watches) {
    const results = [];
    
    // 質問IDと属性名のマッピング
    const questionToAttribute = {
        "gender": "性別",
        "scene": "使用シーン",
        "design": "デザインの好み",
        "function": "機能の希望",
        "brand": "ブランド",
        "band_type": "バンドの種類",
        "case_color": "ケース色の好み",
        "standard": "定番",
        "hands": "針の有無",
        "build": "体格"
    };
    
    // 選択肢IDと実際の値のマッピング
    const optionMapping = {
        "gender": {"male": "男性用", "female": "女性用", "unisex": "ユニセックス"},
        "scene": {"office": "オフィス", "casual": "カジュアル", "formal": "フォーマル", "outdoor": "アウトドア", "sports": "スポーツ"},
        "design": {"simple": "シンプル", "sporty": "スポーティ", "gorgeous": "ゴージャス", "classic": "クラシック", "cute": "キュート"},
        "function": {"solar": "ソーラー", "radio_solar": "電波ソーラー", "water_resistant": "防水", "no_preference": "特にこだわらない"},
        "brand": {"seiko": "Seiko", "casio": "Casio", "citizen": "Citizen", "g_shock": "G-Shock", "no_preference": "特にこだわらない"},
        "band_type": {"leather": "レザー", "metal": "メタル", "rubber": "ラバー", "no_preference": "特にこだわらない"},
        "case_color": {"silver": "シルバー", "gold": "ゴールド", "pink_gold": "ピンクゴールド", "black": "ブラック", "white": "ホワイト", "colorful": "カラフル"},
        "standard": {"standard": "定番", "orthodox": "王道", "unique": "変化球", "fun": "おもしろ"},
        "hands": {"analog": "アナログ", "digital": "デジタル"},
        "build": {"large": "がっちり", "slim": "スリム", "medium": "ふつう"}
    };
    
    // 各時計に対してマッチングスコアを計算
    for (const watch of watches) {
        let score = 0;
        const matches = {};
        
        for (const [questionId, optionId] of Object.entries(userAnswers)) {
            if (optionId === "no_preference") {
                // 「特にこだわらない」は常にマッチ
                score += 1;
                matches[questionId] = true;
                continue;
            }
            
            const attributeName = questionToAttribute[questionId];
            const optionValue = optionMapping[questionId][optionId];
            
            // 時計の属性にユーザーの選択が含まれているか確認
            if (watch.attributes[attributeName] && watch.attributes[attributeName].includes(optionValue)) {
                score += 1;
                matches[questionId] = true;
            } else {
                matches[questionId] = false;
            }
        }
        
        // マッチング率を計算（0〜100%）
        const matchPercentage = (score / Object.keys(userAnswers).length) * 100;
        
        results.push({
            watch: watch,
            score: score,
            matchPercentage: matchPercentage,
            matches: matches
        });
    }
    
    // スコアの高い順にソート
    results.sort((a, b) => b.score - a.score);
    
    return results;
}

/**
 * マッチング結果を表示する
 * @param {Array} results - マッチング結果
 * @param {Object} userAnswers - ユーザーの回答
 */
function displayMatchingResults(results, userAnswers) {
    const resultContainer = document.getElementById('matching-results');
    resultContainer.innerHTML = '';
    
    // 上位の結果を表示
    const topResults = results.slice(0, 5);
    
    for (const [index, result] of topResults.entries()) {
        const watch = result.watch;
        
        const resultElement = document.createElement('div');
        resultElement.className = 'result-item';
        
        resultElement.innerHTML = `
            <h3>${index + 1}. ${watch.brand} ${watch.name}</h3>
            <p>マッチング率: ${result.matchPercentage.toFixed(1)}%</p>
            <img src="${watch.image_url}" alt="${watch.name}" class="watch-image">
            <p><a href="${watch.product_url}" target="_blank">商品詳細を見る</a></p>
            <div class="matched-attributes">
                <h4>マッチした属性:</h4>
                <ul>
                    ${Object.entries(result.matches)
                        .filter(([_, matched]) => matched)
                        .map(([questionId, _]) => {
                            const questionText = getQuestionText(questionId);
                            const optionText = getOptionText(questionId, userAnswers[questionId]);
                            return `<li>${questionText}: ${optionText}</li>`;
                        })
                        .join('')}
                </ul>
            </div>
        `;
        
        resultContainer.appendChild(resultElement);
    }
}

// ヘルパー関数
function getQuestionText(questionId) {
    // 質問IDから質問テキストを取得する実装
    const questionMap = {
        "gender": "性別",
        "scene": "使用シーン",
        "design": "デザインの好み",
        "function": "機能の希望",
        "brand": "ブランド",
        "band_type": "バンドの種類",
        "case_color": "ケース色の好み",
        "standard": "定番",
        "hands": "針の有無",
        "build": "体格"
    };
    return questionMap[questionId] || questionId;
}

function getOptionText(questionId, optionId) {
    // 質問IDと選択肢IDから選択肢テキストを取得する実装
    const optionMapping = {
        "gender": {"male": "男性用", "female": "女性用", "unisex": "ユニセックス"},
        "scene": {"office": "オフィス", "casual": "カジュアル", "formal": "フォーマル", "outdoor": "アウトドア", "sports": "スポーツ"},
        "design": {"simple": "シンプル", "sporty": "スポーティ", "gorgeous": "ゴージャス", "classic": "クラシック", "cute": "キュート"},
        "function": {"solar": "ソーラー", "radio_solar": "電波ソーラー", "water_resistant": "防水", "no_preference": "特にこだわらない"},
        "brand": {"seiko": "Seiko", "casio": "Casio", "citizen": "Citizen", "g_shock": "G-Shock", "no_preference": "特にこだわらない"},
        "band_type": {"leather": "レザー", "metal": "メタル", "rubber": "ラバー", "no_preference": "特にこだわらない"},
        "case_color": {"silver": "シルバー", "gold": "ゴールド", "pink_gold": "ピンクゴールド", "black": "ブラック", "white": "ホワイト", "colorful": "カラフル"},
        "standard": {"standard": "定番", "orthodox": "王道", "unique": "変化球", "fun": "おもしろ"},
        "hands": {"analog": "アナログ", "digital": "デジタル"},
        "build": {"large": "がっちり", "slim": "スリム", "medium": "ふつう"}
    };
    return optionMapping[questionId][optionId] || optionId;
}
