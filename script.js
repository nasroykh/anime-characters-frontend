let charInfos = $("#char-infos");
let characters = [];
let max;

for (let i = 7508; i <= 7579; i++) {
	characters.push(i);
}

max = 7579 - 7508;

$(document).ready(() => {
	var settings = {
		method: "GET",
		timeout: 0,
		Accept: "application/vnd.api+json",
		"Content-Type": "application/vnd.api+json",
	};

	characters.forEach((char) => {
		$.ajax({
			...settings,
			url: `https://kitsu.io/api/edge/media-characters/${char}/character`,
		}).done(function (res) {
			console.log(res);
			charInfos.html(
				charInfos.html() +
				`<div><img src="${res.data.attributes.image.original}" alt="" id="char-img"> 
				<h2 id="char-name">${res.data.attributes.name}</h2> 
				<p id="char-desc">${res.data.attributes.description}</p></div>`
			);
		});
	});

	let base = 0;
	$('#next-btn').click(function (e) { 
		e.preventDefault();
		if (base !== -max*100) {
			base -= 100;
			charInfos.css("transform", `translateX(${base}%)`);
		}
	});
	$('#prev-btn').click(function (e) { 
		e.preventDefault();
		if (base !== 0) {
			base += 100;
			charInfos.css("transform", `translateX(${base}%)`);
		}
	});
});

/* 7509 > 7518 */
