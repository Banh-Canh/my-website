/*function loaded() 										// Load the actual main "body" page using xhttp old ? just learned about fetch
{
	var xhttp = new XMLHttpRequest();
	xhttp.responseType = "text";
	xhttp.onreadystatechange = function() 
	{
		if (xhttp.readyState == 4 && xhttp.status == 200) 
		{
			document.getElementById("bodycontent").innerHTML = xhttp.responseText;
			waitFontLoaded();	                                      // Wait Font to be loaded
			console.log("completed xhttp request");			  // It then start the post AJAX - XMLHttpRequest and wait for it to be ended
		}															  // Then it close de loading pag.
	};	
	xhttp.open("GET", "bodycontent.html", true);
	xhttp.send();
};*/

window.addEventListener("load", loaded);
/***********************************************/
function loaded() 										// Load the actual main "body" page using fetch
{
	const promise1 = new Promise(resolve => 
	{
		console.log("wait for all Fonts to be Loaded")
		document.fonts.ready.then(function() 			// Wait for font to load CSS, doesn't looks like it is supported for edge.
		{ 
			console.log("Fonts all Loaded")	
			loadCSS( "assets/css/stylebodycontent.css" )		// https://github.com/filamentgroup/loadCSS Allow me to pre-load CSS
			resolve("Successfully waited for fonts to be loaded to load CSS");
		});
	})
	.then((value) =>
	{
		console.log(value);
	})
	.catch((value) =>
	{
		console.log("Couldn't wait for fonts to be loaded. Loaded CSS anyway ... \nCatch Value = "+value);
		loadCSS( "assets/css/stylebodycontent.css" );	
	})
	.then(function ()
	{
		loadBodyContent();
		console.log("Loading BodyContent ...");
	});
	
};

function loadBodyContent()
{
	fetch('assets/html/bodycontent.html')
	.then(function (data)
	{
		return data.text();
	})
	.then(function (html) 
	{
		document.getElementById('bodycontent').innerHTML = html;
	})
	.then(function()
	{
		var scripts = document.getElementById("bodycontent").querySelectorAll("script");		// Thanks buddy https://stackoverflow.com/questions/57987543/how-do-i-use-the-fetch-api-to-load-html-page-with-its-javascript
		for (var i = 0; i < scripts.length; i++) 
		{
			if (scripts[i].innerText) 
			{
				eval(scripts[i].innerText);
			} else 
			{
				fetch(scripts[i].src).then(function (data) 
				{
					data.text().then(function (r) 
					{
						eval(r);
					})
				});
			}
			// To not repeat the element
			scripts[i].parentNode.removeChild(scripts[i]);
		}
	})
	.then(function ()
	{
		console.log("Successfully loaded bodycontent");
	})
	.catch((value) =>
	{
		alert("It looks like your browser might be going to have trouble with my website. If you still want to visit my website, please install Mozilla Firefox (recommended) or Google Chrome.\n\nERROR : "+value);
		console.log("Catch Value = "+value);
	});
}