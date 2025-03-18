// 修正版 マッチングロジック
function matchWatches(answers, watches) {
    // 各時計データを選択した条件と比較してフィルタリング
    return watches.filter(watch => {
        return Object.entries(answers).every(([questionId, optionId]) => {
            // 無回答はすべてOK
            if (optionId === "no_preference") return true;

            const question = appData.questions.find(q => q.id === questionId);
            const selectedOption = question.options.find(o => o.id === optionId);

            if (!question || !selectedOption) return false;

            // ブランドなど完全一致を求める属性の場合
            if (question.question === "ブランド") {
                return watch["ブランド"] === selectedOption.text;
            }

            // それ以外の属性はattributes内にあり、部分一致でOK
            const watchAttributeValue = watch.attributes[question.question];
            return watchAttributeValue && watchAttributeValue.includes(selectedOption.text);
        });
    }).map(watch => {
        // マッチング率を算出
        let matchCount = Object.entries(answers).reduce((count, [questionId, optionId]) => {
            if (optionId === "no_preference") return count;

            const question = appData.questions.find(q => q.id === questionId);
            const selectedOption = question.options.find(o => o.id === optionId);

            if (question.question === "ブランド") {
                return watch["ブランド"] === selectedOption.text ? count + 1 : count;
            }

            const watchAttributeValue = watch.attributes[question.question];
            return watchAttributeValue && watchAttributeValue.includes(selectedOption.text) ? count + 1 : count;
        }, 0);

        const totalAnswered = Object.values(answers).filter(a => a !== "no_preference").length;
        watch.matchRate = totalAnswered > 0 ? Math.round((matchCount / totalAnswered) * 100) : 0;

        return watch;
    }).sort((a, b) => b.matchRate - a.matchRate);
}
