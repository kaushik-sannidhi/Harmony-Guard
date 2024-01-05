document.addEventListener('DOMContentLoaded', function() {
    const addWordBtn = document.getElementById('addWordBtn');
    const newBadWordInput = document.getElementById('newBadWord');

    addWordBtn.addEventListener('click', function() {
        const newBadWord = newBadWordInput.value.trim();
        if (newBadWord !== '') {
            chrome.storage.sync.get('badWords', function(data) {
                const badWords = data.badWords || [];
                badWords.push(newBadWord);
                chrome.storage.sync.set({ 'badWords': badWords }, function() {
                    newBadWordInput.value = '';
                });
            });
        }
    });
});
