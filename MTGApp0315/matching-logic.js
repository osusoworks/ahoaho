// 改善版マッチングロジック（エラーハンドリング強化版）
function matchWatches(answers, watches) {
    // データ検証
    if (!appData || !appData.questions || !Array.isArray(appData.questions) || appData.questions.length === 0) {
        console.error('質問データが正しく読み込まれていません');
        return [];
    }
    
    if (!watches || !Array.isArray(watches) || watches.length === 0) {
        console.error('時計データが正しく読み込まれていません');
        return [];
    }

    // 質問の重要度を設定（デフォルトは1、特に重要な質問は重み付けを高くする）
    const questionWeights = {
        "gender": 1.5,    // 性別は重要度高め
        "brand": 1.2,     // ブランドは重要度高め
        "scene": 1.2,     // 使用シーンは重要度高め
        "design": 1.0,    // デザインは標準
        "function": 1.0,  // 機能は標準
        "band": 0.8,      // バンドは標準よりやや低め
        "case_color": 0.8,// ケース色は標準よりやや低め
        "standard": 0.7,  // 定番は重要度低め
        "hands": 0.7,     // 針の有無は重要度低め
        "build": 0.7      // 体格は重要度低め
    };

    try {
        // フィルタリングと重み付けスコアリングを同時に行う
        const matchedWatches = watches.map(watch => {
            if (!watch) return null; // 無効なデータをスキップ
            
            let totalScore = 0;
            let maxPossibleScore = 0;
            let matchDetails = {};

            // 各質問に対するマッチング評価
            Object.entries(answers).forEach(([questionId, optionId]) => {
                // 「指定なし」の場合はスキップ
                if (optionId === "no_preference") return;

                const question = appData.questions.find(q => q.id === questionId);
                const selectedOption = question?.options?.find(o => o.id === optionId);

                if (!question || !selectedOption) return;

                // この質問の重み付け（デフォルトは1）
                const weight = questionWeights[questionId] || 1;
                maxPossibleScore += weight;

                // マッチング評価
                let isMatch = false;
                let matchScore = 0;

                // ブランドの場合は完全一致で評価
                if (question.question === "ブランド") {
                    isMatch = watch.brand && watch.brand === selectedOption.text;
                    matchScore = isMatch ? weight : 0;
                } 
                // 属性の場合は配列内の完全一致で評価
                else {
                    const attributes = watch.attributes || {};
                    const attributeValues = attributes[question.question] || [];
                    
                    // 完全一致を優先
                    if (attributeValues.includes(selectedOption.text)) {
                        isMatch = true;
                        matchScore = weight;
                    } 
                    // 部分一致も評価するが、スコアは低め
                    else {
                        for (const value of attributeValues) {
                            if (value && selectedOption.text && 
                                (value.includes(selectedOption.text) || selectedOption.text.includes(value))) {
                                isMatch = true;
                                matchScore = weight * 0.5; // 部分一致は完全一致の半分のスコア
                                break;
                            }
                        }
                    }
                }

                // マッチング詳細を記録
                matchDetails[question.question] = {
                    userChoice: selectedOption.text,
                    watchValue: question.question === "ブランド" ? 
                        watch.brand : 
                        (watch.attributes?.[question.question] || []).join(", "),
                    isMatch: isMatch,
                    score: matchScore,
                    weight: weight
                };

                totalScore += matchScore;
            });

            // マッチ率の計算（回答した質問がない場合は0%）
            const matchRate = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;

            // 結果オブジェクトを返す
            return {
                ...watch,
                matchRate: matchRate,
                matchDetails: matchDetails,
                totalScore: totalScore,
                maxPossibleScore: maxPossibleScore
            };
        }).filter(watch => watch !== null); // 無効なデータを除外

        // マッチ率でソート
        return matchedWatches
            .filter(watch => watch.matchRate > 0) // マッチ率0%の時計は除外
            .sort((a, b) => {
                // まずマッチ率で降順ソート
                if (b.matchRate !== a.matchRate) {
                    return b.matchRate - a.matchRate;
                }
                // マッチ率が同じ場合は、総スコアで降順ソート
                return b.totalScore - a.totalScore;
            });
    } catch (error) {
        console.error('マッチング処理中にエラーが発生しました:', error);
        return [];
    }
}

// マッチング結果を表示する関数
function displayMatchingResults(results, userAnswers) {
    const resultsContainer = document.getElementById('results-content');
    if (!resultsContainer) {
        console.error('結果表示コンテナが見つかりません');
        return;
    }
    
    resultsContainer.innerHTML = '';

    if (!results || results.length === 0) {
        resultsContainer.innerHTML = '<div class="no-results">条件に一致する時計が見つかりませんでした。条件を変更して再度お試しください。</div>';
        return;
    }

    try {
        // 上位5つの結果のみ表示
        const topResults = results.slice(0, 5);
        
        topResults.forEach((watch, index) => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            
            // 基本情報
            let brandName = watch.brand || '';
            let watchName = watch.name || '';
            let fullName = brandName + (watchName ? ' ' + watchName : '');
            
            if (!fullName.trim()) {
                fullName = 'ID: ' + watch.id; // 名前がない場合はIDを表示
            }
            
            // マッチ率に応じたスタイル
            let matchRateClass = '';
            if (watch.matchRate >= 80) {
                matchRateClass = 'excellent-match';
            } else if (watch.matchRate >= 60) {
                matchRateClass = 'good-match';
            } else if (watch.matchRate >= 40) {
                matchRateClass = 'fair-match';
            } else {
                matchRateClass = 'poor-match';
            }
            
            // 結果アイテムのHTML
            resultItem.innerHTML = `
                <h3>${index + 1}. ${fullName}</h3>
                <div class="match-rate ${matchRateClass}">マッチ率: ${watch.matchRate}%</div>
                ${watch.product_url ? `<a href="${watch.product_url}" target="_blank" class="product-link">製品詳細を見る</a>` : ''}
                ${watch.image ? `<img src="${watch.image}" alt="${fullName}" class="watch-image" onerror="this.style.display='none'">` : ''}
                
                <div class="watch-details">
                    <h4>時計の詳細</h4>
                    <table>
                        ${watch.price ? `<tr><td>価格:</td><td>${watch.price}</td></tr>` : ''}
                        ${watch.details?.caliber ? `<tr><td>キャリバー:</td><td>${watch.details.caliber}</td></tr>` : ''}
                        ${watch.details?.drive_system ? `<tr><td>駆動方式:</td><td>${watch.details.drive_system}</td></tr>` : ''}
                        ${watch.details?.water_resistance ? `<tr><td>防水性:</td><td>${watch.details.water_resistance}</td></tr>` : ''}
                        ${watch.details?.case_material ? `<tr><td>ケース素材:</td><td>${watch.details.case_material}</td></tr>` : ''}
                        ${watch.details?.band_material ? `<tr><td>バンド素材:</td><td>${watch.details.band_material}</td></tr>` : ''}
                    </table>
                </div>
                
                <div class="matched-attributes">
                    <h4>マッチした属性</h4>
                    <ul>
                        ${Object.entries(watch.matchDetails || {})
                            .filter(([_, detail]) => detail.isMatch)
                            .map(([question, detail]) => `
                                <li>
                                    <strong>${question}:</strong> 
                                    あなたの選択「${detail.userChoice}」が
                                    時計の「${detail.watchValue}」とマッチしました
                                </li>
                            `).join('')}
                    </ul>
                </div>
            `;
            
            resultsContainer.appendChild(resultItem);
        });
        
        // 結果の概要
        const resultsSummary = document.createElement('div');
        resultsSummary.className = 'results-summary';
        resultsSummary.innerHTML = `
            <p>合計 ${results.length} 件の時計が見つかりました（上位5件を表示）</p>
        `;
        
        resultsContainer.insertBefore(resultsSummary, resultsContainer.firstChild);
    } catch (error) {
        console.error('結果表示中にエラーが発生しました:', error);
        resultsContainer.innerHTML = '<div class="error-message">結果の表示中にエラーが発生しました。もう一度お試しください。</div>';
    }
}
