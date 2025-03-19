/**
 * 時計マッチングアプリのマッチングロジック
 * GitHubで配置し、iPadでの使用に最適化しています
 */

/**
 * ユーザーの回答に基づいて時計をマッチングする
 * @param {Object} userAnswers - ユーザーの回答（質問ID: 選択肢ID）
 * @param {Array} watches - 時計データの配列
 * @returns {Array} マッチングスコアでソートされた時計のリスト
 */
function matchWatches(userAnswers, watches) {
    // パラメータチェック
    if (!userAnswers || !watches || !Array.isArray(watches)) {
        console.error('無効なパラメータ:', userAnswers, watches);
        return [];
    }
    
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
    
    try {
        // 各時計に対してマッチングスコアを計算
        for (const watch of watches) {
            let score = 0;
            const matches = {};
            let totalQuestions = 0;
            
            // watchのattributesプロパティがない場合はエラー回避のために空オブジェクトを設定
            const attributes = watch.attributes || {};
            
            for (const [questionId, optionId] of Object.entries(userAnswers)) {
                // 質問が対応していない場合はスキップ
                if (!questionToAttribute[questionId] || !optionMapping[questionId]) {
                    continue;
                }
                
                totalQuestions++;
                
                if (optionId === "no_preference") {
                    // 「特にこだわらない」は常にマッチ
                    score += 1;
                    matches[questionId] = true;
                    continue;
                }
                
                const attributeName = questionToAttribute[questionId];
                const optionValue = optionMapping[questionId][optionId];
                
                if (!optionValue) {
                    continue; // 無効な選択肢はスキップ
                }
                
                // 時計の属性を配列として扱う（文字列の場合は分割）
                let attributeValues = attributes[attributeName];
                if (typeof attributeValues === 'string') {
                    attributeValues = attributeValues.split(',').map(v => v.trim());
                } else if (!Array.isArray(attributeValues)) {
                    attributeValues = attributeValues ? [attributeValues] : [];
                }
                
                // 時計の属性にユーザーの選択が含まれているか確認
                if (attributeValues.includes(optionValue)) {
                    score += 1;
                    matches[questionId] = true;
                } else {
                    matches[questionId] = false;
                }
            }
            
            // マッチング率を計算（0〜100%）
            const matchPercentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;
            
            // 結果を追加
            results.push({
                id: watch.id || '',
                brand: watch.brand || '不明',
                name: watch.name || watch.id || '',
                image_url: watch.image_url || '',
                product_url: watch.product_url || '#',
                score: score,
                matchRate: Math.round(matchPercentage),
                matches: matches
            });
        }
    } catch (error) {
        console.error('マッチング処理中にエラーが発生しました:', error);
        return [];
    }
    
    // スコアの高い順にソート
    results.sort((a, b) => b.score - a.score || b.matchRate - a.matchRate);
    
    return results;
}

/**
 * マッチング結果を表示する
 * @param {Array} results - マッチング結果
 * @param {Object} userAnswers - ユーザーの回答
 */
function displayMatchingResults(results, userAnswers) {
    const resultContainer = document.getElementById('results-content');
    resultContainer.innerHTML = '';
    
    if (!results || results.length === 0) {
        resultContainer.innerHTML = '<div class="no-results" style="text-align:center;padding:20px;">マッチする時計が見つかりませんでした。別の条件で試してみてください。</div>';
        return;
    }
    
    // 上位の結果を表示（最大5件）
    const topResults = results.slice(0, 5);
    
    for (const [index, result] of topResults.entries()) {
        const resultElement = document.createElement('div');
        resultElement.className = 'result-item';
        
        // 画像のエラーハンドリング
        const imageUrl = result.image_url || '/api/placeholder/300/200';
        const imageHtml = `<img src="${imageUrl}" alt="${result.name}" class="watch-image" onerror="this.src='/api/placeholder/300/200'; this.onerror=null;">`;
        
        // マッチング率の表示（色付け）
        const matchRateColor = getMatchRateColor(result.matchRate);
        const matchRateHtml = `<p style="font-weight:bold;color:${matchRateColor}">マッチング率: ${result.matchRate}%</p>`;
        
        // マッチした属性のリスト生成
        let matchedAttributesHtml = '';
        try {
            const matchedAttributes = Object.entries(result.matches)
                .filter(([_, matched]) => matched)
                .map(([questionId, _]) => {
                    const questionText = getQuestionText(questionId);
                    const optionText = getOptionText(questionId, userAnswers[questionId]);
                    return `<li>${questionText}: ${optionText}</li>`;
                });
                
            if (matchedAttributes.length > 0) {
                matchedAttributesHtml = `
                    <div class="matched-attributes">
                        <h4>マッチした属性:</h4>
                        <ul>${matchedAttributes.join('')}</ul>
                    </div>
                `;
            }
        } catch (error) {
            console.error('マッチング属性の表示エラー:', error);
            matchedAttributesHtml = '';
        }
        
        resultElement.innerHTML = `
            <h3>${index + 1}. ${result.brand} ${result.name}</h3>
            ${matchRateHtml}
            ${imageHtml}
            <p><a href="${result.product_url}" target="_blank" rel="noopener">商品詳細を見る</a></p>
            ${matchedAttributesHtml}
        `;
        
        resultContainer.appendChild(resultElement);
    }
    
    // 結果がもっとある場合は表示
    if (results.length > 5) {
        const moreResultsElement = document.createElement('div');
        moreResultsElement.style.textAlign = 'center';
        moreResultsElement.style.margin = '20px 0';
        moreResultsElement.innerHTML = `<p>他に ${results.length - 5} 件の時計があります。</p>`;
        resultContainer.appendChild(moreResultsElement);
    }
}

/**
 * マッチング率に応じた色を返す
 * @param {number} rate - マッチング率（0-100）
 * @returns {string} - カラーコード
 */
function getMatchRateColor(rate) {
    if (rate >= 80) return '#28a745'; // 高マッチ: 緑
    if (rate >= 50) return '#ffc107'; // 中マッチ: 黄色
    return '#dc3545';                 // 低マッチ: 赤
}

/**
 * 質問IDから質問テキストを取得
 * @param {string} questionId - 質問ID
 * @returns {string} - 質問テキスト
 */
function getQuestionText(questionId) {
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

/**
 * 質問IDと選択肢IDから選択肢テキストを取得
 * @param {string} questionId - 質問ID
 * @param {string} optionId - 選択肢ID
 * @returns {string} - 選択肢テキスト
 */
function getOptionText(questionId, optionId) {
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
    
    if (optionMapping[questionId] && optionMapping[questionId][optionId]) {
        return optionMapping[questionId][optionId];
    }
    return optionId;
}
