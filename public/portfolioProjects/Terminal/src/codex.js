function userInput(inCmd) {
	if (sys_clearNextInput) {
		sys_clearNextInput = false;
		sys_clear();
	}
	interpret(inCmd);
}

function interpret(inCmd) {
	var found = false;
	cmd = inCmd.split(" ");
	//look for the function
	for (var i = 0; i < systexReg.length; i++) {
		if (systexReg[i].cmd == cmd[0]) {
			if(systexReg[i].run(cmd)) {//if the cmd returns that it worked
				curCmd = "";//clear the cmdline
				found = true;//end the interpret
			} else {
				disp("<rgb(200,0,50)>ERROR: <rgb(0,150,100)>"+cmd[0]+"</> returned an error.");
				found = true;//end the interpret
			}
			break;
		}
	}
	if (found) {return found;}
	//if it gets here that means the systex could not be found
	curCmd = "";//clear the cmdline
	disp("<rgb(200,0,50)>ERROR: <rgb(0,150,100)>"+cmd[0]+"</> could not be found.");
	return false;
}

systexReg = new Array();

//holds the run data
systex = function(inCmdName,inFunc) {
	this.cmd = inCmdName;
	this.run = inFunc;
} 

//register functions
function systexRegister(inCmdName,inFunc) {
	systexReg.unshift(new systex(inCmdName,inFunc));
}

///////////////////////////////
//Some basic system variables//
///////////////////////////////
var sys_inputHeader = "";
var sys_clearNextInput = false;

///////////////////////////////
//Some basic system functions//
///////////////////////////////

//welcome menu
function welcomeScreen(args) {
	disp("- For assistance enter \"help\"");
	disp("<rgb(0,255,0)>Welcome");
	disp("");
	disp("");
	sys_clearNextInput = true;
	return true;
}
//call this on start
welcomeScreen();

//ECHO systex - echos the input
function sys_print(args) {
	var stringOut = "";
	for (var i = 0; i < args.length; i++) {
		stringOut += args[i]+" ";
	}
	disp(stringOut);
	return true;
}

//ECHO systex - echos the input
function sys_echo(args) {
	var stringOut = "";
	for (var i = 1; i < args.length; i++) {
		stringOut += args[i]+" ";
	}
	disp(stringOut);
	return true;
}

systexRegister("echo",sys_echo);

//Clear systex - clears the screen
function sys_clear(args) {
	consoleLog = new Array();
	return true;
}
systexRegister("cls",sys_clear);
systexRegister("clear",sys_clear);

//Help systex - prints some help
function sys_help(args) {
	sys_clear();
	for (var i = 0; i < systexReg.length; i++) {
		disp(systexReg[i].cmd);
	}
	disp("<rgb(0,255,200)>List of functions:");
	sys_clearNextInput = true;
	return true;
}

systexRegister("help",sys_help);