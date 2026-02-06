function searchComic() {
    var input = document.getElementById('searchInput').value.toLowerCase();
    var cards = document.querySelectorAll('.comic-card');
    cards.forEach(function(card) {
        var title = card.querySelector('h3').innerText.toLowerCase();
        if (title.includes(input)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}
