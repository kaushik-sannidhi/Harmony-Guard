function addWordsToStorage(wordsArray) {
    chrome.storage.sync.get('badWords', function(data) {
        const existingBadWords = data.badWords || [];
        const updatedBadWords = [...existingBadWords, ...wordsArray];

        chrome.storage.sync.set({ 'badWords': updatedBadWords }, function() {
            console.log('Words added to storage:', wordsArray);
        });
    });
}

const CensoredWords = []; // removed censored words and phrases to make it appropriate for submission. Words taken from https://www.cs.cmu.edu/~biglou/resources/bad-words.txt by accessing the txt file and adding all of the words in the Carnigie Mellon College txt file into the bad words chrome storage section using js fetch.

addWordsToStorage(CensoredWords);


function censorBadWords(node) {
    const regexPattern = new RegExp('\\b(' + badWords.join('|') + ')\\b', 'gi');

    if (node.nodeType === Node.TEXT_NODE) {
        node.textContent = node.textContent.replace(regexPattern, (match) => '*'.repeat(match.length));
    } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (!['SCRIPT', 'STYLE'].includes(node.tagName)) {
            node.childNodes.forEach(censorBadWords);
        }
    }
}

function startCensorship() {
    censorBadWords(document.body);

    const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                censorBadWords(node);
            });
        });
    });

    observer.observe(document.body, { subtree: true, childList: true });
}

function initializeCensorship() {
    chrome.storage.sync.get(['badWords', 'userBadWords'], function(data) {
        const defaultBadWords = data.badWords || [];
        const userSelectedBadWords = data.userBadWords || [];
        badWords = [...defaultBadWords, ...userSelectedBadWords];
        startCensorship();
    });
}

initializeCensorship();
