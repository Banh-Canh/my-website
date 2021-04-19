/*console.log("start loading background");
var bgvideo = document.getElementById('backgroundvideo');
bgvideo.src = 'videos/background.mp4';
bgvideo.load();
bgvideo.addEventListener('canplaythrough', function() {
	console.log("Success : background loaded");
	closeLoadingPage();
}, false);*/
/*function loadBg()
{
	var loaded = false
	var image = document.createElement('img');
	image.src = getBgUrl(document.getElementById('bodycontent'));
	image.onload = function () 										// Wait for BG to be loaded before closing de page !!
	{
		closeLoadingPage();
		console.log("Success : background loaded");
	};

}*/

async function closeLoadingPage()
{
	await rePositioningSizing()
	console.log("Successfully Repositioned & Resized the page");
	var body = document.body;
	var sideloaders = document.getElementsByClassName("sideloader");
	setTimeout(function(){															// Wait a bit before opening because font etc.. may still not be fully loaded/rendered and it's uglys..
		body.style.overflow = "hidden"	
		sideloaders[0].style.opacity = "0";
		sideloaders[0].style.transform = "scale(3)";
		sideloaders[0].style.zIndex = "-99999";
		body.style.overflow = "visible"
		console.log("loading page closed - REAAAADY !!");
	},200) 
};

function rePositioningSizing()          // Reposition & Resize each "parts" of the fetched html content
{
	console.log("rePositioningSizing started");
	
	var bodycontents = document.getElementById("bodycontent");
	var fullpages = document.getElementsByClassName("fullpage");
	
	resizeToClientHeight();
	
	window.addEventListener('resize', function(event) 				// Resize classes with "parts divs" of the website that should always be at 100vh
	{																// because css equivalent bugs out on resize, or when the virtual keyboard appear
		resizeToClientHeight();
	});
	
	function resizeToClientHeight()	
	{	
		if((document.activeElement.tagName === "TEXTAREA" && !(document.body.classList.contains("hasHover")))	// Workaround check for virtualkeyboard on mobile
				||	((document.activeElement.tagName === "INPUT" && document.activeElement.type === "text") 	// See watchForHover for touch detection
						&& !(document.body.classList.contains("hasHover")))
				|| ((document.activeElement.tagName === "INPUT" && document.activeElement.type === "tel")
						&& !(document.body.classList.contains("hasHover"))))
		{
			console.log("text is in focus no resize");
			document.body.classList.add('hasVirtualKeyboard');			// Add temporary class to prevent messing up if virtual keyboard disappear
			return
		}
		else if (document.body.classList.contains('hasVirtualKeyboard') 
				&& !(document.body.classList.contains("hasHover")))
		{
			console.log("just quitted texts, bye virtual keyboard");
			document.body.classList.remove('hasVirtualKeyboard');
		}

		var clientHeight = document.documentElement.clientHeight;
		bodycontents.style.height = clientHeight + "px";	
		for (var i=0; i<fullpages.length; i++) 
		{
			fullpages[i].style.height = clientHeight + "px";
		};
	}
}

function openNav() {
  document.getElementById("mySidenav").style.top = "0";
  document.getElementById("mySidenav").style.left = "0";
  document.getElementById("mySidenav").style.transform = "scale(1)";
  document.getElementById("mySidenav").style.borderRadius = "0";
  document.getElementById("opennav").removeEventListener("click", openNav);
  document.getElementById("opennav").addEventListener("click", closeNav);
}

/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.top = "-100vh";
  document.getElementById("mySidenav").style.left = "-100vw";
  document.getElementById("mySidenav").style.borderRadius = "50%";
  document.getElementById("mySidenav").style.transform = "scale(0.1)";
  document.getElementById("opennav").removeEventListener("click", closeNav);
  document.getElementById("opennav").addEventListener("click", openNav);
} 

/****************############################**********************************/
document.addEventListener('dragstart', function (e) {	// disable dragging (because it can't be done for mozilla with just css)
    e.preventDefault();
});
closeLoadingPage();
document.getElementById("bodycontent").onscroll = function() {scrollBarProgress()};
watchForHover();
smoothAnchorScrolling();		// With snap-scroll the vanilla smooth scrolling doesn't work. This function fixes this.
checkForm();			// Basic Front-End form check
document.getElementById("aboutmebutton").addEventListener("click", showAboutMe);
document.getElementById("opennav").addEventListener("click", openNav);
document.getElementById("mySidenav").addEventListener("click", closeNav);

/*function updateClock() {
    var now = new Date(), // current date
        hours = ("0" + now.getHours()).slice(-2);
        minutes = ("0" + now.getMinutes()).slice(-2);
        seconds = ("0" + now.getSeconds()).slice(-2);
    document.getElementById('hours').innerHTML = hours;
    document.getElementById('minutes').innerHTML = minutes;
    document.getElementById('seconds').innerHTML = seconds;
    setTimeout(updateClock, 1000);
}

updateClock();*/

const animates = document.querySelectorAll('.fade-in, .fade-in-section-left, .fade-in-section-right, .fade-in-section-down, .fade-in-section-up, .fade-in-section-rotate180'); // Fade in stylish animation

animationObserver = new IntersectionObserver(entries => 
{
	entries.forEach(entry => 
	{
		if (entry.intersectionRatio > 0)
		{
			/*console.log('elem to fade is in the view');*/
			entry.target.classList.add("is-visible");
		} 
		else 
		{
			/*console.log('elem to fade is out of view');*/
			entry.target.classList.remove("is-visible");
		}
	});
});

animates.forEach(elem => 
{
	animationObserver.observe(elem);
});

const imagesLazy = document.querySelectorAll('img');		// Basic lazy load img

imagesObserver = new IntersectionObserver(entries => 
{
	entries.forEach(entry => 
	{
		if (entry.intersectionRatio > 0)
		{
			const img = entry.target;
			img.src = img.getAttribute('data-lazy');
			img.onload = function () 										// Wait for img to be loaded before fade in
			{
				img.style.opacity = "1";
				img.style.visibility = "visible";
				imagesObserver.unobserve(img);
			}
		} 
	});
});

imagesLazy.forEach(elem => 
{
	imagesObserver.observe(elem);
});

const bgLazy = document.querySelectorAll('.lazyBg');	// For now, lazy load all images of a partX if one of the image enter view

backgroundObserver = new IntersectionObserver(entries => 
{
	entries.forEach(entry => 
	{
		if (entry.intersectionRatio > 0)
		{
			if (document.querySelector('.part2').contains( entry.target )) 
			{
				for (i=0;i<bgLazy.length;i++)
				{
					if ( document.querySelector('.part2').contains( bgLazy[i] ) )
					{
						var src = bgLazy[i].getAttribute('data-lazy');	
						var imgbg = document.createElement('img');
						imgbg.src = src;
						imgbg.onload = bgLazy[i].style.backgroundImage = "url('"+src+"')"; 
						backgroundObserver.unobserve(bgLazy[i]);
					}
				}
			}
			else if (document.querySelector('.part3').contains( entry.target )) 
			{
				for (i=0;i<bgLazy.length;i++)
				{
					if ( document.querySelector('.part3').contains( bgLazy[i] ) )
					{
						var src = bgLazy[i].getAttribute('data-lazy');	
						var imgbg = document.createElement('img');
						imgbg.src = src;
						imgbg.onload = bgLazy[i].style.backgroundImage = "url('"+src+"')"; 
						backgroundObserver.unobserve(bgLazy[i]);
					}
				}
			}
		} 
	});
});

bgLazy.forEach(elem => 
{
	backgroundObserver.observe(elem);
});

/******************##########################********************************/
function getBgUrl(el) 					//https://jsfiddle.net/tovic/gmzSG/ thanks google, 
{								
    var bg = "";
    if (el.currentStyle) { // IE
        bg = el.currentStyle.backgroundImage;
    } else if (document.defaultView && document.defaultView.getComputedStyle) { // Firefox
        bg = document.defaultView.getComputedStyle(el, "").backgroundImage;
    } else { // try and get inline style
        bg = el.style.backgroundImage;
    }
    return bg.replace(/url\(['"]?(.*?)['"]?\)/i, "$1");
}

function scrollBarProgress()   // Custom made scrollbar ( browser scrollbar disabled )
{
	//console.log("bodycontent scrolled");
	var winScroll = document.getElementById("bodycontent").scrollTop;
	var test = document.getElementById("bodycontent").scrollTop;
	//console.log("winScroll = " + winScroll);
	var height = document.getElementById("bodycontent").scrollHeight - document.getElementById("bodycontent").clientHeight;
	//console.log("height = " + height);
	var scrolled = (winScroll / height) * 100;
	document.getElementById("progressionBar").style.width = scrolled + "%";
}

function showAboutMe()
{
	document.getElementById("aboutme").style.height = "auto";
	document.getElementById("aboutme").style.opacity = "1";
	document.getElementById("aboutmebutton").removeEventListener("click", showAboutMe);
	document.getElementById("aboutmebutton").addEventListener("click", hideAboutMe);
}

function hideAboutMe()
{
	setTimeout(function(){
		document.getElementById("aboutme").style.height = "0";
	}, 150);
	document.getElementById("aboutme").style.opacity = "0";
	document.getElementById("aboutmebutton").removeEventListener("click", hideAboutMe);
	document.getElementById("aboutmebutton").addEventListener("click", showAboutMe);
}

function smoothAnchorScrolling()
{
	document.querySelectorAll('a[href^="#"]').forEach(anchor => 
	{
		anchor.addEventListener('click', function (e) 
		{
			e.preventDefault();
			document.querySelector(this.getAttribute('href')).scrollIntoView({
				behavior: 'smooth',
				block: "nearest"
			});
		});
	});
}

function checkForm() 
{
	var contactforms = document.getElementById('contactform');	
	var result = false;	
	var firstnames = document.getElementById("firstname");
	var lastnames = document.getElementById("lastname");
	var companies = document.getElementById("company");
	var messages = document.getElementById("message");
	var telInput = document.getElementById("phone");
	var emailInput = document.getElementById("email");	
	var result = false;
//	var allInputForms = [firstnames, lastnames, companies, telInput, emailInput];

	nameCheck(firstnames);
	nameCheck(lastnames);
	nameCheck(companies);
//	nameCheck(message);
	
	function isFormValid()
	{
		if ( firstnames.classList.contains("validform") 
			&& lastnames.classList.contains("validform")
			&& companies.classList.contains("validform")
//			&& telInput.classList.contains("validform")
			&& emailInput.classList.contains("validform") )
//			&& messages.classList.contains("validform") )
		{
			return true
		}
		else
		{	
			return false
		}
	}
	
	function nameCheck(nameInput)
	{
		nameInput.addEventListener("input", checkNameValidity);
		
		function checkNameValidity(event)
		{
			if (nameInput.value.length >= 2)
			{
				nameInput.classList.remove("invalidform");
				nameInput.classList.add("validform");
				if (isFormValid())
				{
					document.querySelectorAll("input[type=submit]")[0].disabled = false;
				}
				else
				{
					document.querySelectorAll("input[type=submit]")[0].disabled = true; 
					console.log("submit disabled");
				}
			}
			else if (nameInput.value.length == 0)
			{
				nameInput.classList.remove("validform");
				nameInput.classList.remove("invalidform");
				document.querySelectorAll("input[type=submit]")[0].disabled = true; 
			}
			else
			{
				nameInput.classList.remove("validform");
				nameInput.classList.add("invalidform");
				document.querySelectorAll("input[type=submit]")[0].disabled = true; 
			}
		};
	}
	
	emailInput.addEventListener("input", checkEmailValidity);

	function checkEmailValidity(event)
	{
		if (validateEmail(emailInput))
		{
			emailInput.classList.remove("invalidform");
			emailInput.classList.add("validform");
			console.log("do correct email things");	
			if (isFormValid())
			{
				document.querySelectorAll("input[type=submit]")[0].disabled = false;
			}
		}
		else if (emailInput.value.length == 0)
		{
			emailInput.classList.remove("validform");
			emailInput.classList.remove("invalidform");
			document.querySelectorAll("input[type=submit]")[0].disabled = true; 
		}
		else
		{
			emailInput.classList.remove("validform");
			emailInput.classList.add("invalidform");
			document.querySelectorAll("input[type=submit]")[0].disabled = true; 
			console.log("do bad email things");
		}
	};
	
//	telInput.addEventListener("input", checkTelValidity);
	function checkTelValidity(event)
	{
		if (validateNumberOnly(telInput) && telInput.value.length === 10)
		{
			telInput.classList.remove("invalidform");
			telInput.classList.add("validform");
			telInput.classList.remove("invalidform");
			telInput.classList.add("validform");
			// if (isFormValid())
			// {
				// document.querySelectorAll("input[type=submit]")[0].disabled = false;
			// }

		}
		else if (telInput.value.length == 0)
		{
			telInput.classList.remove("validform");
			telInput.classList.remove("invalidform");
			//document.querySelectorAll("input[type=submit]")[0].disabled = true; 
		}
		else
		{
			telInput.classList.remove("validform");
			telInput.classList.add("invalidform");
			//document.querySelectorAll("input[type=submit]")[0].disabled = true; 
		}
	};
		
	contactforms.addEventListener('reset', function() 
	{	
		inputContactForm = document.querySelectorAll('input[type=text], input[type=password], input[type=tel]');
		for (var i = 0; i < inputContactForm.length; i++) 
		{
			inputContactForm[i].className = "";
		}
		document.querySelectorAll("input[type=submit]")[0].disabled = true;
    });
}

function validateNumberOnly(inputText)
{
	var numberformat = /^\d*\.?\d*$/;
	if(inputText.value.match(numberformat))
	{
		return true;	
	}
	else
	{
		return false;
	}
}
	
function validateEmail(inputText)
{
	var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	if(inputText.value.match(mailformat))
	{
		return true;	
	}
	else
	{
		return false;
	}
}

/*  https://stackoverflow.com/questions/23885255/how-to-remove-ignore-hover-css-style-on-touch-devices */
function watchForHover()    // Prevent hover on touch devices
{
	
	// lastTouchTime is used for ignoring emulated mousemove events
	// that are fired after touchstart events. Since they're
	// indistinguishable from real events, we use the fact that they're
	// fired a few milliseconds after touchstart to filter them.
	
	let lastTouchTime = 0
	document.addEventListener('touchstart', updateLastTouchTime, true)
	function updateLastTouchTime() 
	{
		lastTouchTime = new Date()
	}
	

	function enableHover() {
		if (new Date() - lastTouchTime < 500) return
		document.body.classList.add('hasHover')
		console.log("has hover")
	}

	function disableHover() {
		document.body.classList.remove('hasHover')
		console.log("disable hover")
	}

	document.addEventListener('touchstart', disableHover, true)
	document.addEventListener('mousemove', enableHover, true)

	enableHover()
};
/***********************************************************************/
