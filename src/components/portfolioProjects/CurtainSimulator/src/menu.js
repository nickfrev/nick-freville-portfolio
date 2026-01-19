$(document).ready(function () {
	$("#options_but").click(function () {
		if ($("#optionsDropDown").is(":visible")) {
			$("#optionsDropDown").slideUp("slow");
		} else {
			$("#optionsDropDown").slideDown("slow");
			$("#controlsDropDown").slideUp("slow");
			$("#levelDropDown").slideUp("slow");
			$("#customDropDown").slideUp("slow");
		}
	});

	$("#clean_but").click(function () {
		lasLevelNum = -10;
	});

	$("#disNodes_but").click(function () {
		allowNodes = !allowNodes;
		if (allowNodes) {
			$(this).css("background", "rgba(0,0,0,0.2)");
		} else {
			$(this).css("background", "rgba(255,255,255,0.2)");
		}
	});

	$("#disMusic_but").click(function () {
		allowMusic = !allowMusic;
		if (allowMusic) {
			$(this).css("background", "rgba(0,0,0,0.2)");
			myAudio.play();
		} else {
			$(this).css("background", "rgba(255,255,255,0.2)");
			myAudio.pause();
		}
	});

	$("#levels_but").click(function () {
		if ($("#levelDropDown").is(":visible")) {
			$("#levelDropDown").slideUp("slow");
		} else {
			levelOut = "";
			//add the level buttons
			for (var i = 0; i < level.length; i++) {
				levelOut +=
					'<center><button id="level_' +
					i +
					'" class="button bigrounded levelButton" value=' +
					i +
					">" +
					level[i][10] +
					"</button></center>";
			}
			$("#levelDropDown").html(levelOut);

			$(".levelButton").click(function () {
				curLevelNum = parseInt(this.value);
				curLevel = level[curLevelNum];
			});

			$("#levelDropDown").slideDown("slow");
			$("#customDropDown").slideUp("slow");
			$("#controlsDropDown").slideUp("slow");
			$("#optionsDropDown").slideUp("slow");
		}
	});

	$("#CustomLevel_but").click(function () {
		if ($("#customDropDown").is(":visible")) {
			$("#customDropDown").slideUp("slow");
		} else {
			$("#customDropDown").slideDown("slow");
			$("#levelDropDown").slideUp("slow");
			$("#controlsDropDown").slideUp("slow");
			$("#optionsDropDown").slideUp("slow");
		}
	});

	$("#Controls_but").click(function () {
		if ($("#controlsDropDown").is(":visible")) {
			$("#controlsDropDown").slideUp("slow");
		} else {
			$("#controlsDropDown").slideDown("slow");
			$("#levelDropDown").slideUp("slow");
			$("#customDropDown").slideUp("slow");
			$("#optionsDropDown").slideUp("slow");
		}
	});
});

window.addEventListener(
	"keydown",
	function (evt) {
		//alert("keydown: " + evt.keyCode);
		if (evt.keyCode == 27) {
			var $lefty = $("#menu");
			$lefty.animate({
				left: parseInt($lefty.css("left"), 10) == 0 ? -$lefty.outerWidth() : 0,
			});
		}
	},
	false
);
