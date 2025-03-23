// 改善版マッチングロジック（エラーハンドリング強化版 v2）
function matchWatches(answers, watches) {
    console.log("マッチング開始: 回答データ", answers);
    console.log("マッチング開始: 時計データ数", watches ? watches.length : 0);
    
    // データ検証
    if (!appData || !appData.questions || !Array.isArray(appData.questions) || appData.questions.length === 0) {
        console.error('質問データが正しく読み込まれていません');
        return [];
    }
    
    if (!watches || !Array.isArray(watches) || watches.length === 0) {
        console.error('時計データが正しく読み込まれていません');
        return [];
    }
    
    if (!answers || Object.keys(answers).length === 0) {
        console.error('回答データがありません');
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
                // 「指定なし」または未回答の場合はスキップ
                if (!optionId || optionId === "no_preference") return;

                // 質問データの取得
                const question = appData.questions.find(q => q.id === questionId);
                if (!question) {
                    console.log(`質問ID ${questionId} が見つかりません`);
                    return;
                }
                
                // 選択肢データの取得
                const selectedOption = question.options.find(o => o.id === optionId);
                if (!selectedOption) {
                    console.log(`質問 ${questionId} の選択肢ID ${optionId} が見つかりません`);
                    return;
                }

                // この質問の重み付け（デフォルトは1）
                const weight = questionWeights[questionId] || 1;
                maxPossibleScore += weight;

                // マッチング評価
                let isMatch = false;
                let matchScore = 0;

                // ブランドの場合は完全一致で評価
                if (question.question === "ブランド" && selectedOption.text) {
                    // ブランド名の正規化（大文字小文字を無視）
                    const normalizedBrand = (watch.brand || "").toLowerCase();
                    const normalizedOption = selectedOption.text.toLowerCase();
                    
                    isMatch = normalizedBrand === normalizedOption;
                    matchScore = isMatch ? weight : 0;
                } 
                // 属性の場合は配列内の完全一致で評価
                else if (selectedOption.text) {
                    const attributes = watch.attributes || {};
                    // 質問のテキストを属性名として使用
                    const attributeKey = question.question;
                    const attributeValues = attributes[attributeKey] || [];
                    
                    // 属性値が配列でない場合は配列に変換
                    const attributeArray = Array.isArray(attributeValues) ? attributeValues : [attributeValues];
                    
                    // 選択肢のテキストを正規化
                    const normalizedOption = selectedOption.text.toLowerCase();
                    
                    // 完全一致を優先
                    let hasExactMatch = false;
                    let hasPartialMatch = false;
                    
                    for (const value of attributeArray) {
                        if (!value) continue;
                        
                        // 属性値を正規化
                        const normalizedValue = value.toLowerCase();
                        
                        // 完全一致チェック
                        if (normalizedValue === normalizedOption) {
                            hasExactMatch = true;
                            break;
                        }
                        
                        // 部分一致チェック
                        if (normalizedValue.includes(normalizedOption) || normalizedOption.includes(normalizedValue)) {
                            hasPartialMatch = true;
                        }
                    }
                    
                    if (hasExactMatch) {
                        isMatch = true;
                        matchScore = weight;
                    } else if (hasPartialMatch) {
                        isMatch = true;
                        matchScore = weight * 0.5; // 部分一致は完全一致の半分のスコア
                    }
                }

                // マッチング詳細を記録
                matchDetails[question.question] = {
                    userChoice: selectedOption.text || "",
                    watchValue: question.question === "ブランド" ? 
                        (watch.brand || "") : 
                        ((watch.attributes && watch.attributes[question.question]) ? 
                            (Array.isArray(watch.attributes[question.question]) ? 
                                watch.attributes[question.question].join(", ") : 
                                watch.attributes[question.question]) : 
                            ""),
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

        console.log("マッチング完了: 結果数", matchedWatches.length);

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
        // エラーの詳細をコンソールに出力
        console.error('エラーの詳細:', error.message);
        console.error('エラーのスタックトレース:', error.stack);
        return [];
    }
}

// マッチング結果を表示する関数
function displayMatchingResults(results, userAnswers) {
    try {
        console.log("結果表示開始: 結果数", results ? results.length : 0);
        
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
                fullName = 'ID: ' + (watch.id || 'unknown'); // 名前がない場合はIDを表示
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
                        ${watch.details && watch.details.caliber ? `<tr><td>キャリバー:</td><td>${watch.details.caliber}</td></tr>` : ''}
                        ${watch.details && watch.details.drive_system ? `<tr><td>駆動方式:</td><td>${watch.details.drive_system}</td></tr>` : ''}
                        ${watch.details && watch.details.water_resistance ? `<tr><td>防水性:</td><td>${watch.details.water_resistance}</td></tr>` : ''}
                        ${watch.details && watch.details.case_material ? `<tr><td>ケース素材:</td><td>${watch.details.case_material}</td></tr>` : ''}
                        ${watch.details && watch.details.band_material ? `<tr><td>バンド素材:</td><td>${watch.details.band_material}</td></tr>` : ''}
                    </table>
                </div>
                
                <div class="matched-attributes">
                    <h4>マッチした属性</h4>
                    <ul>
                        ${Object.entries(watch.matchDetails || {})
                            .filter(([_, detail]) => detail && detail.isMatch)
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
        console.log("結果表示完了");
    } catch (error) {
        console.error('結果表示中にエラーが発生しました:', error);
        console.error('エラーの詳細:', error.message);
        console.error('エラーのスタックトレース:', error.stack);
        
        const resultsContainer = document.getElementById('results-content');
        if (resultsContainer) {
            resultsContainer.innerHTML = '<div class="error-message">結果の表示中にエラーが発生しました。もう一度お試しください。</div>';
        }
    }
}
