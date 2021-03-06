let charInfos = $("#char-infos");
let characters = [];
let max;

$(document).ready(() => {
	var settings = {
		method: "GET",
		timeout: 0,
		Accept: "application/vnd.api+json",
		"Content-Type": "application/vnd.api+json",
	};

	$('#search-form').on('submit', function (e) { 
		e.preventDefault();
		let searchValue = $('#search-input').val().trim();
		if (searchValue.includes('  ') || searchValue === '') {
			return alert('There is an error in your search input');
		}
		$('#char-infos').html('');
		characters = [];
		max = 0;
		let searchQuery = searchValue.split(' ').join('%20');

		$.ajax({
			...settings,
			url: `https://kitsu.io/api/edge/anime?filter[text]=${searchQuery}&page[limit]=1`,
			success: (res) => {
				let id = res.data[0].id;
				let title = res.data[0].attributes.titles.en_jp;
				$('#anime-title').text(title);
				$.ajax({
					...settings,
					url: `https://kitsu.io/api/edge/anime/${id}/characters`,
					success: (res) => {
						let charArr = res.data;
						for (let i = 0; i < charArr.length ; i++) {
							characters.push(charArr[i].id);
						}
						max = characters.length - 1;
						characters.forEach((char) => {
							$.ajax({
								...settings,
								url: `https://kitsu.io/api/edge/media-characters/${char}/character`,
							}).done(function (res) {
								charInfos.html(
									charInfos.html() +
									`<div><img src="${res.data.attributes.image.original}" alt="" id="char-img"> 
									<h2 id="char-name">${res.data.attributes.name}</h2> 
									<p id="char-desc">${res.data.attributes.description}</p></div>`
								);
								$('#search-input').val('');
							});
						});
					}
				});
			}
		});
		
	});

	let base = 0;
	$('#next-btn').click(function (e) { 
		e.preventDefault();
		if (base !== -max*100 && characters.length) {
			base -= 100;
			charInfos.css("transform", `translateX(${base}%)`);
		}
	});
	$('#prev-btn').click(function (e) { 
		e.preventDefault();
		if (base !== 0 && characters.length) {
			base += 100;
			charInfos.css("transform", `translateX(${base}%)`);
		}
	});
});





// SWIPE SCRIPT 




document.addEventListener('touchstart', handleTouchStart, false);        
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;                                                        
var yDown = null;

function getTouches(evt) {
  return evt.touches ||             // browser API
         evt.originalEvent.touches; // jQuery
}                                                     

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];                                      
    xDown = firstTouch.clientX;                                      
    yDown = firstTouch.clientY;                                      
};                                                

function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
			/* left swipe */ 
			$('#next-btn').trigger('click')
        } else {
			$('#prev-btn').trigger('click');
            /* right swipe */
        }                       
    } else {
        if ( yDiff > 0 ) {
            /* up swipe */ 
        } else { 
            /* down swipe */
        }                                                                 
    }
    /* reset values */
    xDown = null;
    yDown = null;                                             
};