// エラー対策済み マッチングロジック完全版
function matchWatches(answers, watches) {
    if (!appData || !appData.questions) return [];

    return watches.filter(watch => {
        return Object.entries(answers).every(([questionId, optionId]) => {
            if (optionId === "no_preference") return true;

            const question = appData.questions.find(q => q.id === questionId);
            const selectedOption = question?.options.find(o => o.id === optionId);

            if (!question || !selectedOption) return false;

            if (question.question === "ブランド") {
                return watch["ブランド"] && watch["ブランド"] === selectedOption.text;
            }

            const watchAttributeValue = watch.attributes?.[question.question];
            return watchAttributeValue && watchAttributeValue.includes(selectedOption.text);
        });
    }).map(watch => {
        let matchCount = Object.entries(answers).reduce((count, [questionId, optionId]) => {
            if (optionId === "no_preference") return count;

            const question = appData.questions.find(q => q.id === questionId);
            const selectedOption = question?.options.find(o => o.id === optionId);

            if (!question || !selectedOption) return count;

            if (question.question === "ブランド") {
                return watch["ブランド"] && watch["ブランド"] === selectedOption.text ? count + 1 : count;
            }

            const watchAttributeValue = watch.attributes?.[question.question];
            return watchAttributeValue && watchAttributeValue.includes(selectedOption.text) ? count + 1 : count;
        }, 0);

        const totalAnswered = Object.values(answers).filter(a => a !== "no_preference").length;
        watch.matchRate = totalAnswered > 0 ? Math.round((matchCount / totalAnswered) * 100) : 0;

        return watch;
    }).sort((a, b) => b.matchRate - a.matchRate);
}